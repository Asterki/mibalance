import { v4 as uuidv4 } from "uuid";
import dayJs from "dayjs";

import AccountModel from "../../models/Account";

import { NextFunction, Request, Response } from "express";
import type * as AuthAPITypes from "../../../../shared/types/api/auth";

import LoggingService from "../../services/logging";
import EmailService from "../../services/email";

const handler = async (
	req: Request<{}, {}, AuthAPITypes.ForgotPasswordRequestBody>,
	res: Response<AuthAPITypes.ForgotPasswordResponseData>,
	_next: NextFunction,
) => {
	// There's no account session in this request
	const { email } = req.body;

	try {
		const account = await AccountModel.findOne({
			"email.value": email.toLowerCase(),
			deleted: false,
		});
		if (!account) {
			res.status(404).send({
				status: "account-not-found",
			});
			return;
		}

		let token = uuidv4();
		while (
			await AccountModel.findOne({
				"preferences.security.forgotPasswordToken": token,
				deleted: false,
			})
		) {
			token = uuidv4();
		}

		await AccountModel.updateOne(
			{ _id: account._id },
			{
				$set: {
					"preferences.security.forgotPasswordToken": token,
					"preferences.security.forgotPasswordTokenExpires": dayJs()
						.add(24, "hour")
						.toDate(),
				},
			},
		);

		// Set the email
		if (process.env.NODE_ENV === "production") {
			const emailToSend = await EmailService.getEmailHTMLTemplate(
				"forgot-password",
				account.preferences.general.language,
				{
					name: account.profile.name,
					token: `${process.env.FRONT_END_ORIGIN}/accounts/reset-password?token=${token}`,
					year: new Date().getFullYear().toString(),
				},
			);
			await EmailService.sendEmail(email, "Reset your password", emailToSend);
		}

		// Log the action
		LoggingService.log({
			level: "info",
			source: "system",
			message: "User requested password reset",
			details: {
				email: email,
			},
		});

		res.status(200).send({
			status: "success",
		});
	} catch (error: any) {
		// Log the action
		LoggingService.log({
			level: "error",
			source: "system",
			message: "Error requesting password reset",
			details: {
				email: email,
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
