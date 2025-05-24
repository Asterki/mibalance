import { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import LoggingService from "../services/logging";

interface ApiError {
	status: string;
	message?: string;
}

const errorHandler = (
	err: any,
	_req: Request,
	res: Response<ApiError>,
	_next: NextFunction,
) => {
	// Default response
	let statusCode = 500;
	let errorResponse: ApiError = { status: "internal-error" };

	// Handle known error types
	if (err instanceof MongooseError.ValidationError) {
		statusCode = 400;
		errorResponse = { status: "validation-error", message: err.message };
	} else if ((err as any).code === 11000) {
		// MongoDB Duplicate Key Error (e.g., trying to create a duplicate supplier)
		statusCode = 400;
		errorResponse = {
			status: "duplicate-entry",
			message: "Duplicate record exists",
		};
	} else if (err instanceof Error) {
		// Other generic errors
		errorResponse = { status: "error", message: err.message };
	}

	// Log error
	LoggingService.log({
		source: "system",
		level: "error",
		message: "An error occurred in request handling",
		details: {
			error: err.toString(),
		},
	});

	// Send response
	res.status(statusCode).json(errorResponse);
};

export default errorHandler;
