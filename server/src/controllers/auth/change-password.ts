import AccountModel from "../../models/Account";

import AccountUtils from "../../utils/accounts";
import type { IAccount } from "../../models/Account";

import { NextFunction, Request, Response } from "express";
import type * as AuthAPITypes from "../../../../shared/types/api/auth";

import LoggingService from "../../services/logging";
import EmailService from "../../services/email";

const handler = async (
	req: Request<{}, {}, AuthAPITypes.ChangePasswordRequestBody>,
	res: Response<AuthAPITypes.ChangePasswordResponseData>,
	_next: NextFunction,
) => {
	const account = req.user as IAccount;
	const { currentPassword, newPassword } = req.body;

	try {
		// Verify the password
		const verifyPasswordResult = AccountUtils.verifyPassword(
			account.preferences.security.password,
			currentPassword,
		);
		if (!verifyPasswordResult) {
			res.status(401).send({ status: "invalid-credentials" });
			return;
		}

		await AccountModel.findOneAndUpdate(
			{
				_id: account._id,
				deleted: false,
			},
			{
				$set: {
					"preferences.security.password": newPassword, // Update only the password
					"preferences.security.passwordUpdatedAt": new Date(), // Update the password updated date
				},
			},
		);

		// Send the email verification email
		if (process.env.NODE_ENV === "production") {
			const emailToSend = await EmailService.getEmailHTMLTemplate(
				"password-change",
				account.preferences.general.language,
				{},
			);
			EmailService.sendEmail(
				account.email.value,
				"Password Change",
				emailToSend,
			);
		}

		// Log the password change
		LoggingService.log({
			level: "info",
			message: `User ${account._id} changed their password.`,
			source: "system",
			details: {
				accountId: account._id.toString(),
				action: "password-change",
			},
		});

		res.status(200).send({ status: "success" });
	} catch (error: any) {
		// Log the error
		LoggingService.log({
			level: "error",
			message: `Error changing password for user ${account._id}: ${error.message}`,
			source: "system",
			details: {
				accountId: account._id.toString(),
				action: "password-change-error",
				error: error.message,
			},
		});
		res.status(500).send({ status: "internal-error" });
	}
};

export default handler;
