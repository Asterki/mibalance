import AccountModel from "../../models/Account";
import bcrypt from "bcrypt";

import { NextFunction, Request, Response } from "express";
import type * as AuthAPITypes from "../../../../shared/types/api/auth";

import LoggingService from "../../services/logging";
import EmailService from "../../services/email";

const handler = async (
	req: Request<{}, {}, AuthAPITypes.ResetPasswordRequestBody>,
	res: Response<AuthAPITypes.ResetPasswordResponseData>,
	_next: NextFunction,
) => {
	const { token, newPassword } = req.body;

	try {
		const account = await AccountModel.findOneAndUpdate(
			{
				"preferences.security.forgotPasswordToken": token,
				"preferences.security.forgotPasswordTokenExpires": { $gt: new Date() },
			},
			{
				$set: {
					"preferences.security.password": await bcrypt.hash(newPassword, 10),
					"preferences.security.forgotPasswordToken": null,
					"preferences.security.forgotPasswordTokenExpires": null,
					"preferences.security.lastPasswordChange": new Date(),
				},
			},
			{
				new: true,
			},
		);

		if (!account) {
			res.status(400).send({
				status: "invalid-token",
			});
			return;
		}

		if (process.env.NODE_ENV === "production") {
			const emailToSend = await EmailService.getEmailHTMLTemplate(
				"password-change",
				account.preferences.general.language,
				{
					name: account.profile.name,
					email: account.email.value,
					year: new Date().getFullYear().toString(),
				},
			);

			await EmailService.sendEmail(
				account.email.value,
				"Password Changed",
				emailToSend,
			);
		}

		// Log the action
		LoggingService.log({
			level: "info",
			source: "system",
			message: "User password changed",
			details: {
				email: account.email.value,
			},
		});

		res.status(200).send({
			status: "success",
		});
	} catch (error: any) {
		LoggingService.log({
			level: "error",
			source: "system",
			message: "Error while reseting user password",
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
