// The purpose of this file is to manage user accounts, this file is required for user registration, deletion, and other account-related operations.
// This file cannot be disabled in case the application requires user accounts.

import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import AccountsModel from "../models/Account";
import { HydratedDocument } from "mongoose";

import LoggingService from "./logging"; // This is for logging user actions

import { IAccount } from "../models/Account";
import { DeepPartial } from "../../../shared/types/custom";

class AccountService {
	private static instance: AccountService;

	private constructor() {}

	public static getInstance(): AccountService {
		if (!AccountService.instance) {
			AccountService.instance = new AccountService();
		}
		return AccountService.instance;
	}

	public async getAccount(accountID: string): Promise<IAccount | null> {
		const account = await AccountsModel.findById(accountID);
		return account;
	}

	public async getAccountByEmail(email: string): Promise<IAccount | null> {
		const account = await AccountsModel.findOne({ "email.value": email });
		return account;
	}

	// These two methods are for accounts that come from an email link
	public async getAccountByPasswordResetToken(
		token: string,
	): Promise<IAccount | null> {
		const account = await AccountsModel.findOne({
			"preferences.security.forgotPasswordToken": token,
		});
		return account as unknown as IAccount;
	}

	public async getAccountByVerificationToken(
		token: string,
	): Promise<IAccount | null> {
		const account = await AccountsModel.findOne({
			"email.verificationToken": token,
		});
		return account as unknown as IAccount;
	}

	public async getAccounts(count: number, offset: number): Promise<IAccount[]> {
		const accounts = await AccountsModel.find().skip(offset).limit(count);
		return accounts as unknown as IAccount[];
	}

	public async createAccount(
		email: string,
		password: string,
		name: string,
		language: "en" | "es",
	): Promise<{
		status: "success" | "email-exists";
		account?: IAccount;
	}> {
		const emailTaken = await AccountsModel.findOne({
			$or: [{ "email.value": email }],
		});
		if (emailTaken) return { status: "email-exists" };

		// Check if it's the first account, if so make it an admin
		const totalAccounts = await AccountsModel.countDocuments();
		const isAdmin = totalAccounts === 0;

		// Create the account
		const account = new AccountsModel({
			accountID: uuidv4(),
			email: {
				value: email,
				verificationToken: uuidv4(),
			},
			data: {
				role: isAdmin ? "admin" : "employee",
			},
			profile: {
				name,
			},
			preferences: {
				general: {
					language,
				},
				security: {
					password: bcrypt.hashSync(password, 10),
				},
			},
		});
		await account.save();

		// Log the account creation
		LoggingService.log({
			message: `Account created for ${email}`,
			source: "application",
			level: "info",
		});

		return {
			status: "success",
			account: account as unknown as IAccount,
		};
	}

	// It is assumed that any controller that calls this function will have already verified the user's password and TFA code
	public async deleteAccount(accountID: string): Promise<{
		status: "success" | "account-not-found";
	}> {
		const user: HydratedDocument<IAccount> | null =
			await AccountsModel.findById(accountID);
		if (!user) {
			return { status: "account-not-found" };
		}

		// Delete the user and their related documents
		await AccountsModel.findByIdAndDelete(accountID);
		// Log the account deletion
		LoggingService.log({
			message: `Account deleted for ${user.email.value}`,
			source: "application",
			level: "info",
		});

		return {
			status: "success",
		};
	}

	public async updateAccount(
		accountId: String,
		updates: DeepPartial<IAccount>,
	): Promise<{
		status: "success" | "account-not-found";
		account?: IAccount;
	}> {
		let account = await AccountsModel.findById(accountId);
		if (!account) {
			return { status: "account-not-found" };
		}

		// If the password is being updated, hash it
		if (updates.preferences?.security?.password) {
			updates.preferences.security.password = bcrypt.hashSync(
				updates.preferences.security.password,
				10,
			);
		}

		// It is assumed that the controller has already verified the user's password and TFA code
		// Plus the controller has already verified that the user has the correct permissions to update the accounts
		// And that the email is unique

		// @ts-ignore
		function applyUpdates(target: any, updates: any) {
			for (const key in updates) {
				if (
					updates[key] !== null &&
					typeof updates[key] === "object" &&
					!Array.isArray(updates[key])
				) {
					if (!target[key]) target[key] = {}; // Ensure nested object exists
					applyUpdates(target[key], updates[key]); // Recursively merge
				} else {
					target[key] = updates[key]; // Directly assign non-object values
				}
			}
		}

		// Apply updates to the account object
		applyUpdates(account, updates);
		await account.save();

		// Log the action
		LoggingService.log({
			message: `Account updated for ${account.email.value}`,
			source: "application",
			level: "info",
		});

		return { status: "success", account };
	}
}

export default AccountService.getInstance();
