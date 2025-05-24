import AccountModel from "../../models/Account";

import { NextFunction, Request, Response } from "express";
import type * as AuthAPITypes from "../../../../shared/types/api/auth";

import LoggingService from "../../services/logging";
import EmailService from "../../services/email";

const handler = async (
	req: Request<{}, {}, AuthAPITypes.VerifyAccountEmailRequestBody>,
	res: Response<AuthAPITypes.VerifyAccountEmailResponseData>,
	_next: NextFunction,
) => {
	const { token } = req.body;

	try {
		const account = await AccountModel.findOneAndUpdate(
			{
				"email.verificationToken": token,
				"email.verificationTokenExpires": { $gt: new Date() },
				deleted: false,
			},
			{
				$set: {
					"email.verified": true,
					"email.verificationToken": null,
					"email.verificationTokenExpires": null,
				},
			},
			{
				new: true,
			},
		);

		if (!account) {
			res.status(406).send({
				status: "invalid-token",
			});
			return;
		}

		if (process.env.NODE_ENV === "production") {
			const emailToSend = await EmailService.getEmailHTMLTemplate(
				"email-verified",
				account.preferences.general.language,
				{
					name: account.profile.name,
					year: new Date().getFullYear().toString(),
				},
			);

			await EmailService.sendEmail(
				account.email.value,
				"Your email has been verified",
				emailToSend,
			);
		}

		LoggingService.log({
			message: "Email verified",
			source: "application",
			level: "info",
			details: {
				email: account.email.value,
			},
		});

		res.status(200).send({
			status: "success",
		});
		return;
	} catch (error: any) {
		LoggingService.log({
			message: "Error while verifying email",
			source: "application",
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
