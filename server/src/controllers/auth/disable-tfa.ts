import AccountModel from "../../models/Account";
import AccountUtils from "../../utils/accounts";
import type { IAccount } from "../../models/Account";

import { NextFunction, Request, Response } from "express";
import type * as AuthAPITypes from "../../../../shared/types/api/auth";

import LoggingService from "../../services/logging";
import EmailService from "../../services/email";

const handler = async (
	req: Request<{}, {}, AuthAPITypes.DisableTFARequestBody>,
	res: Response<AuthAPITypes.DisableTFAResponseData>,
	_next: NextFunction,
) => {
	const account = req.user as IAccount;
	const { password, tfaCode } = req.body;

	if (account.preferences.security.tfaSecret === null) {
		res.status(403).send({ status: "tfa-not-enabled" });
		return;
	}

	try {
		const verifyPasswordResult = AccountUtils.verifyPassword(
			account.preferences.security.password,
			password,
		);
		if (!verifyPasswordResult) {
			res.status(403).send({ status: "invalid-credentials" });
			return;
		}

		// Validate the TFA code
		const validCode = AccountUtils.verifyTFA(
			account.preferences.security.tfaSecret!,
			tfaCode,
		);
		if (!validCode) {
			res.status(403).send({ status: "invalid-credentials" });
			return;
		}

		await AccountModel.updateOne(
			{
				_id: account._id,
				deleted: false,
			},
			{
				$set: {
					"preferences.security.tfaSecret": null,
				},
			},
		);

		// Send the email verification email
		if (process.env.NODE_ENV === "production") {
			const emailToSend = await EmailService.getEmailHTMLTemplate(
				"tfa-disabled",
				account.preferences.general.language,
				{},
			);
			EmailService.sendEmail(
				account.email.value,
				"TFA Disabled for your account",
				emailToSend,
			);
		}

		// Log the action
		LoggingService.log({
			level: "info",
			source: "system",
			message: "User disabled TFA",
			details: {
				accountId: account._id.toString(),
			},
		});

		res.status(200).send({ status: "success" });
	} catch (error: any) {
		LoggingService.log({
			source: "system",
			level: "error",
			message: "Unexpected error while disabling TFA",
			details: { error: error.message, stack: error.stack },
		});

		res.status(500).send({ status: "internal-error" });
	}
};

export default handler;
