// src/utils/validation.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const validateRequestBody =
	(schema: ZodSchema<any>) =>
	(req: Request, res: Response, next: NextFunction) => {
		const parsedBody = schema.safeParse(req.body);
		if (!parsedBody.success) {
			res.status(200).send({
				status: "invalid-parameters",
				errors: parsedBody.error.errors,
			});
		} else {
			next();
		}
	};

const validateRequestQuery =
	(schema: ZodSchema<any>) =>
	(req: Request, res: Response, next: NextFunction) => {
		const parsedQuery = schema.safeParse(req.query);
		if (!parsedQuery.success) {
			res.status(200).send({
				status: "invalid-parameters",
				errors: parsedQuery.error.errors,
			});
		} else {
			next();
		}
	};

export { validateRequestBody, validateRequestQuery };
