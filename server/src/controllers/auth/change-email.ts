import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

import AccountModel from "../../models/Account";
import AccountUtils from "../../utils/accounts";
import type { IAccount } from "../../models/Account";

import { NextFunction, Request, Response } from "express";
import type * as AuthAPITypes from "../../../../shared/types/api/auth";

import LoggingService from "../../services/logging";
import EmailService from "../../services/email";

const handler = async (
	req: Request<{}, {}, AuthAPITypes.ChangeEmailRequestBody>,
	res: Response<AuthAPITypes.ChangeEmailResponseData>,
	_next: NextFunction,
) => {
	const account = req.user as IAccount;
	const { password, newEmail } = req.body;

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		// Validate that the provided password matches the user's one
		const verifyPasswordResult = AccountUtils.verifyPassword(
			account.preferences.security.password,
			password,
		);
		if (!verifyPasswordResult) {
			res.status(401).send({ status: "invalid-credentials" });
			return;
		}

		const emailInUse = await AccountModel.exists({
			_id: { $ne: account._id }, // Exclude the current account
			"email.value": newEmail, // Check if the new email already exists
			deleted: false, // Ensure the account is not deleted
		}).session(session);
		if (emailInUse) {
			res.status(409).send({ status: "email-exists" });
			return;
		}

		// Generate the verification token, ensuring it's unique (in the weird case it already exists)
		let verificationToken = uuidv4();
		while (
			await AccountModel.exists({
				"email.verificationToken": verificationToken,
			}).session(session)
		) {
			verificationToken = uuidv4();
		}

		await AccountModel.findOneAndUpdate(
			{
				_id: account._id,
				deleted: false,
			},
			{
				$set: {
					email: {
						value: newEmail.toLowerCase(),
						verified: false,
						lastChanged: new Date(),
						verificationToken,
					},
				},
			},
			{ session },
		);

		// Commit the transaction
		await session.commitTransaction();

		// Send the email verification email
		if (process.env.NODE_ENV === "production") {
			const emailToSend = await EmailService.getEmailHTMLTemplate(
				"email-verification",
				account.preferences.general.language,
				{
					emailVerificationURL: `${process.env.WEB_URL}/verify-email?token=${verificationToken}`,
				},
			);
			EmailService.sendEmail(newEmail, "Verify your email", emailToSend);
		}

		// Log the action
		LoggingService.log({
			level: "info",
			source: "system",
			message: "Email change requested",
			details: {
				accountId: account._id.toString(),
				oldEmail: account.email.value,
				newEmail,
			},
		});

		res.status(200).send({ status: "success" });
	} catch (error: any) {
		await session.abortTransaction();
		LoggingService.log({
			source: "system",
			level: "error",
			message: "Unexpected error during email change",
			details: { error: error.message, stack: error.stack },
		});
		res.status(500).send({ status: "internal-error" });
	} finally {
		await session.endSession();
	}
};

export default handler;
