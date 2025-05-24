import AccountModel from "../../models/Account";
import AccountUtils from "../../utils/accounts";
import type { IAccount } from "../../models/Account";

import { NextFunction, Request, Response } from "express";
import type * as AuthAPITypes from "../../../../shared/types/api/auth";

import LoggingService from "../../services/logging";
import EmailService from "../../services/email";

const handler = async (
	req: Request<{}, {}, AuthAPITypes.EnableTFARequestBody>,
	res: Response<AuthAPITypes.EnableTFAResponseData>,
	_next: NextFunction,
) => {
	const account = req.user as IAccount;
	const { password, secret, tfaCode } = req.body;

	try {
		const verifyPasswordResult = AccountUtils.verifyPassword(
			account.preferences.security.password,
			password,
		);

		if (!verifyPasswordResult) {
			res.status(403).send({ status: "invalid-credentials" });
			return;
		}

		const validCode = AccountUtils.verifyTFA(secret, tfaCode);
		if (!validCode) {
			res.status(403).send({ status: "invalid-tfa-code" });
			return;
		}

		await AccountModel.updateOne(
			{ _id: account._id, deleted: false },
			{
				$set: {
					"preferences.security.tfaSecret": secret,
				},
			},
		);

		// Send the email verification email
		if (process.env.NODE_ENV === "production") {
			const emailToSend = await EmailService.getEmailHTMLTemplate(
				"tfa-enabled",
				account.preferences.general.language,
				{},
			);
			EmailService.sendEmail(
				account.email.value,
				"TFA Enabled for your account",
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
			message: "Unexpected error while enabling TFA",
			details: { error: error.message, stack: error.stack },
		});

		res.status(500).send({ status: "internal-error" });
	}
};

export default handler;
