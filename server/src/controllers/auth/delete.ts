import AccountModel from "../../models/Account";
import AccountUtils from "../../utils/accounts";
import type { IAccount } from "../../models/Account";

import { NextFunction, Request, Response } from "express";
import type * as AuthAPITypes from "../../../../shared/types/api/auth";

import LoggingService from "../../services/logging";
import EmailService from "../../services/email";

const handler = async (
	req: Request<{}, {}, AuthAPITypes.DeleteRequestBody>,
	res: Response<AuthAPITypes.DeleteResponseData>,
	_next: NextFunction,
) => {
	const account = req.user as IAccount;
	const { password, tfaCode } = req.body;

	// Contrary to popular belief, users need permission to delete their accounts
	// Why? Because it's not like they're gonna go around the app, delete their account and then
	// Go harrass an admin to get their account back

	try {
		// Verify the password and TFA code
		if (
			!AccountUtils.verifyPassword(
				account.preferences.security.password,
				password,
			)
		) {
			res.status(401).send({
				status: "invalid-credentials",
			});
			return;
		}

		// If the user has 2fa active, then verify it
		if (account.preferences.security.tfaSecret !== null) {
			if (!tfaCode) {
				res.status(400).send({
					status: "missing-tfa-code",
				});
				return;
			}
			if (
				!AccountUtils.verifyTFA(
					account.preferences.security.tfaSecret!,
					tfaCode,
				)
			) {
				res.status(401).send({
					status: "invalid-credentials",
				});
				return;
			}
		}

		await AccountModel.findOneAndUpdate({
			_id: account._id,
			deleted: false,
		});

		// Send the email verification email
		if (process.env.NODE_ENV === "production") {
			const emailToSend = await EmailService.getEmailHTMLTemplate(
				"account-deletion",
				account.preferences.general.language,
				{},
			);
			EmailService.sendEmail(
				account.email.value,
				"Account Deletion",
				emailToSend,
			);
		}

		// Log the action
		LoggingService.log({
			source: "application",
			message: `Account for ${account.email.value} was deleted.`,
			level: "info",
			details: {
				accountId: account._id.toString(),
			},
		});

		req.logOut({ keepSessionInfo: false }, () => {
			res.status(200).send({
				status: "success",
			});
			return;
		});
	} catch (error: any) {
		LoggingService.log({
			source: "application",
			message: `Failed to delete ${account.email.value}'s account.`,
			level: "error",
			details: {
				message: error.message,
				stack: error.stack,
			},
		});

		res.status(500).send({
			status: "internal-error",
		});
	}
};

export default handler;
