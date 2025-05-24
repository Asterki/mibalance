import AccountModel, { IAccount } from "../../models/Account";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import dayJs from "dayjs";

import { NextFunction, Request, Response } from "express";
import type * as AuthAPITypes from "../../../../shared/types/api/auth";

import LoggingService from "../../services/logging";
import EmailService from "../../services/email";

const handler = async (
	req: Request<{}, {}, {}>,
	res: Response<AuthAPITypes.RequestAccountEmailVerificationResponseData>,
	_next: NextFunction,
) => {
	const account = req.user as IAccount;
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		if (account.email.verified) {
			res.status(406).send({
				status: "email-already-verified",
			});
			return;
		}

		let token = uuidv4();
		while (
			await AccountModel.exists({ "email.verificationToken": token }).session(
				session,
			)
		) {
			token = uuidv4();
		}

		await AccountModel.updateOne(
			{ _id: account._id },
			{
				$set: {
					"email.verificationToken": token,
					"email.verificationTokenExpires": dayJs().add(24, "hour").toDate(),
				},
			},
			{ session },
		);

		await session.commitTransaction();

		if (process.env.NODE_ENV === "production") {
			const emailToSend = await EmailService.getEmailHTMLTemplate(
				"verify-email",
				account.preferences.general.language,
				{
					name: account.profile.name,
					email: account.email.value,
					year: new Date().getFullYear().toString(),
					token: `${process.env.FRONT_END_ORIGIN}/accounts/verify-email?token=${token}`,
				},
			);

			await EmailService.sendEmail(
				account.email.value,
				"Verify your email address",
				emailToSend,
			);
		}

		// Log the action
		LoggingService.log({
			level: "info",
			source: "system",
			message: "User solicited an email verification",
			details: {
				email: account.email.value,
			},
		});

		res.status(200).send({
			status: "success",
		});
	} catch (error: any) {
		await session.abortTransaction();

		LoggingService.log({
			level: "error",
			source: "system",
			message: "Error while requesting email verification",
			details: {
				message: error.message,
				stack: error.stack,
			},
		});

		res.status(500).send({
			status: "internal-error",
		});
	} finally {
		session.endSession();
	}
};

export default handler;
