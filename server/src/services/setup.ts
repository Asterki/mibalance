import mongoose from "mongoose";
import bcrypt from "bcrypt";

import AccountModel from "../models/Account";
import AccountRoleModel from "../models/AccountRole";

// Adjust as needed
const DEFAULT_ADMIN_EMAIL = "admin@example.com";
const DEFAULT_ADMIN_PASSWORD = "admin123";

// Optional: List all permissions
const ALL_PERMISSIONS = [
	"categories:create",
	"categories:update",
	"categories:delete",
	"products:create",
	"products:update",
	"products:delete",
	"suppliers:create",
	"suppliers:update",
	"suppliers:delete",
	"stores:create",
	"stores:update",
	"stores:delete",
	"users:manage",
	// Add more as needed
];

export const setupInitialAdmin = async () => {
	const existingUsers = await AccountModel.countDocuments();

	if (existingUsers > 0) {
		console.log("[Setup] Users already exist. Skipping setup.");
		return;
	}

	console.log(
		"[Setup] No users found. Creating initial admin role and user...",
	);

	const existingAdminRole = await AccountRoleModel.findOne({ name: "admin" });

	const adminRole =
		existingAdminRole ||
		(await AccountRoleModel.create({
			name: "admin",
			permissions: ALL_PERMISSIONS,
		}));

	const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

	await AccountModel.create({
		email: DEFAULT_ADMIN_EMAIL,
		passwordHash,
		displayName: "Admin",
		role: adminRole._id,
		active: true,
	});

	console.log("[Setup] Admin user created:");
	console.log(`Email: ${DEFAULT_ADMIN_EMAIL}`);
	console.log(`Password: ${DEFAULT_ADMIN_PASSWORD}`);
};
