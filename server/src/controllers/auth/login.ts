import passport from "passport";

import LoggingService from "../../services/logging";
import EmailService from "../../services/email";

import AccountUtils from "../../utils/accounts";

import { NextFunction, Request, Response } from "express";
import type * as AuthAPITypes from "../../../../shared/types/api/auth";

import { IAccount } from "../../../../server/src/models/Account";

const handler = (
	req: Request<{}, {}, AuthAPITypes.LoginRequestBody>,
	res: Response<AuthAPITypes.LoginResponseData>,
	next: NextFunction,
) => {
	try {
		passport.authenticate(
			"local",
			(err: any, user: IAccount | null, info: any) => {
				if (err) {
					next(err);
					return;
				}

				if (!user) {
					res.status(403).send({
						status: info.message,
					});
					return;
				} else {
					req.logIn(user, async (err) => {
						if (err) {
							next(err);
							return;
						}

						// Alert the user of their successful login
						if (process.env.NODE_ENV === "production") {
							const emailToSend = await EmailService.getEmailHTMLTemplate(
								"new-login",
								user.preferences.general.language,
								{
									name: user.profile.name,
									email: user.email.value,
									year: new Date().getFullYear().toString(),
									date: new Date().toLocaleString(),
								},
							);

							await EmailService.sendEmail(
								user.email.value,
								"New login to your account",
								emailToSend,
							);
						}

						res.status(200).send({
							status: "success",
							account: await AccountUtils.createSessionAccount(user),
						});
					});
				}
			},
		)(req, res, next);
	} catch (error: any) {
		LoggingService.log({
			level: "error",
			message: `Error logging user in`,
			source: "system",
			details: {
				stack: error.stack,
				error: error.message,
			},
		});
		res.status(500).send({ status: "internal-error" });
	}
};

export default handler;
