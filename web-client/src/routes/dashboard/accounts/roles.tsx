import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

import {
	App,
	Button,
	Input,
	Modal,
	Drawer,
	Tooltip,
	Table,
	Typography,
	Switch,
	Collapse,
} from "antd";
const { Title, Text } = Typography;

import AdminPageLayout from "../../../layouts/AdminLayout";
import { FaPencilAlt, FaTrash, FaUsersCog } from "react-icons/fa";

import RolesFeature from "../../../features/roles";

export const Route = createFileRoute("/dashboard/accounts/roles")({
	component: RouteComponent,
});

function RouteComponent() {
	const { account } = useSelector((state: RootState) => state.auth);

	const navigate = useNavigate();
	const { message } = App.useApp();
	const { t } = useTranslation(["main", "dashboard"]);

	interface ListRole {
		_id: string;
		name: string;
		level: number;
		totalPermissions: number;
	}
	const [rolesListState, setRolesListState] = useState<{
		loading: boolean;
		roles: ListRole[];
		totalRoles: number;
		page: number;
		count: number;
	}>({
		loading: true,
		roles: [],
		totalRoles: 0,
		page: 0,
		count: 10,
	});

	// Search
	const [searchState, setSearchState] = useState<{
		query: string;
		loading: boolean;
	}>({
		query: "",
		loading: false,
	});
	const searchRoles = async () => {
		setSearchState({
			...searchState,
			loading: true,
		});

		const result = await RolesFeature.rolesAPI.list({
			query: searchState.query,
			count: 50,
			page: 0,
			fields: ["_id", "name", "level", "permissions"],
		});

		if (result.status == "success" && result.roles !== undefined) {
			setRolesListState({
				...rolesListState,
				roles: result.roles.map((roles) => ({
					_id: roles._id.toString(),
					name: roles.name,
					level: roles.level,
					totalPermissions: roles.permissions.length,
				})),
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}

		setSearchState({
			...searchState,
			loading: false,
		});
	};

	// Fetch roles
	const fetchRoles = async (count: number, page: number) => {
		const result = await RolesFeature.rolesAPI.list({
			count,
			page,
			fields: ["_id", "name", "level", "permissions"],
		});

		if (result.status == "success") {
			setRolesListState({
				count: count,
				page: page,
				roles: result.roles!.map((roles) => ({
					_id: roles._id.toString(),
					name: roles.name,
					level: roles.level,
					totalPermissions: roles.permissions.length,
				})),
				totalRoles: result.totalRoles!,
				loading: false,
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	// Create Role
	const [createRoleState, setCreateRoleState] = useState<{
		isOpen: boolean;
		name: string;
		level: number;
	}>({
		isOpen: false,
		name: "",
		level: 1,
	});
	const createRolesSchema = z.object({
		name: z
			.string()
			.min(1, { message: "invalid-name" })
			.max(100, { message: "invalid-name" }),
		level: z
			.number()
			.positive({ message: "invalid-level" })
			.max(100, { message: "invalid-level" })
			.refine(
				(val: number) => {
					const existingLevels = rolesListState.roles.map((role) => role.level);
					return !existingLevels.includes(val);
				},
				{ message: "level-in-use" },
			)
			.refine(
				(val: number) => {
					return val > account!.data.role.level;
				},
				{ message: "role-too-high" },
			),
	});
	const createRole = async () => {
		const parseResult = createRolesSchema.safeParse(createRoleState);
		if (!parseResult.success) {
			for (const issue of parseResult.error.issues) {
				message.warning(
					t(`dashboard:roles.modals.create.messages.${issue.message}`),
				);
			}
			return;
		}

		const result = await RolesFeature.rolesAPI.create(parseResult.data);

		if (result.status == "success") {
			message.success(t("dashboard:roles.modals.create.messages.success"));
			setCreateRoleState({
				isOpen: false,
				name: "",
				level: 1,
			});

			await fetchRoles(rolesListState.count, rolesListState.page);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	// Delete Role
	const [deleteRoleState, setDeleteRoleState] = useState<{
		roleId?: string;
	}>({
		roleId: undefined,
	});
	const deleteRole = async () => {
		if (deleteRoleState.roleId == null) return;
		const result = await RolesFeature.rolesAPI.delete({
			roleId: deleteRoleState.roleId,
		});

		if (result.status == "success") {
			message.success(t("dashboard:roles.modals.delete.messages.success"));

			setDeleteRoleState({
				roleId: undefined,
			});

			await fetchRoles(rolesListState.count, rolesListState.page);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	// Edit Category
	const [updateRoleState, setUpdateRoleState] = useState<{
		roleId?: string;
		name: string;
		level: number;
		permissions: string[];
		requiresTwoFactor: boolean;
	}>({
		roleId: undefined,
		name: "",
		level: 1,
		permissions: [],
		requiresTwoFactor: false,
	});
	const updateRoleSchema = z.object({
		name: z
			.string()
			.min(1, { message: "invalid-name-length" })
			.max(100, { message: "invalid-name-length" }),
		level: z
			.number()
			.positive({ message: "invalid-level" })
			.max(100, { message: "invalid-level" })
			.refine(
				(val: number) => {
					// Check if the level is not in use by any other role, plus, if the level is not the same as the current selected role, then it is valid
					const existingLevels = rolesListState.roles
						.filter((role) => role._id !== updateRoleState.roleId)
						.map((role) => role.level);
					return !existingLevels.includes(val);
				},
				{ message: "level-in-use" },
			)
			.refine(
				(val: number) => {
					return val > account!.data.role.level;
				},
				{ message: "role-too-high" },
			),
		permissions: z.array(z.string()).optional(),
	});
	const updateCategory = async () => {
		if (updateRoleState.roleId == null) return;
		const parseResult = updateRoleSchema.safeParse(updateRoleState);
		if (!parseResult.success) {
			for (const issue of parseResult.error.issues) {
				message.warning(
					t(`dashboard:roles.modals.update.messages.${issue.message}`),
				);
			}
			return;
		}

		const result = await RolesFeature.rolesAPI.update({
			roleId: updateRoleState.roleId,
			name: parseResult.data.name,
			level: parseResult.data.level,
			permissions: parseResult.data.permissions,
			requiresTwoFactor: false,
		});

		if (result.status == "success") {
			message.success(t("dashboard:roles.modals.update.messages.success"));
			setUpdateRoleState({
				roleId: undefined,
				name: "",
				requiresTwoFactor: false,
				permissions: [],
				level: 1,
			});

			await fetchRoles(rolesListState.count, rolesListState.page);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	useEffect(() => {
		// Fetch products and categories
		(async () => {
			await fetchRoles(rolesListState.count, rolesListState.page);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AdminPageLayout selectedPage="accounts">
			{/* Edit Category */}
			<Drawer
				onClose={() => {
					setUpdateRoleState({
						...updateRoleState,
						roleId: undefined,
						requiresTwoFactor: false,
						level: 1,
						permissions: [],
					});
				}}
				open={updateRoleState.roleId != undefined}
				title={t("dashboard:roles.modals.update.title")}
				width={1000}
				extra={
					<Button
						variant="solid"
						type="primary"
						onClick={() => {
							updateCategory();
						}}
					>
						{t("dashboard:common.save")}
					</Button>
				}
			>
				<p>{t("dashboard:roles.modals.update.description")}</p>
				<div className="flex flex-col gap-4 mt-4">
					<div>
						<p>{t("dashboard:roles.modals.update.name")}</p>
						<Input
							type="text"
							value={updateRoleState.name}
							onChange={(e) => {
								setUpdateRoleState({
									...updateRoleState,
									name: e.target.value,
								});
							}}
							placeholder={t("dashboard:roles.modals.update.namePlaceholder")}
						/>
					</div>

					<div>
						<p>{t("dashboard:roles.modals.update.level")}</p>
						<Input
							type="number"
							value={updateRoleState.level}
							onChange={(e) => {
								setUpdateRoleState({
									...updateRoleState,
									level: parseInt(e.target.value) || 1,
								});
							}}
							placeholder={t("dashboard:roles.modals.update.levelPlaceholder")}
						/>
					</div>

					<div>
						<p>{t("dashboard:roles.modals.update.requiresTwoFactor")}</p>
						<Tooltip
							title={t(
								"dashboard:roles.modals.update.requiresTwoFactorTooltip",
							)}
						>
							<Switch
								value={updateRoleState.requiresTwoFactor}
								onChange={(e) => {
									setUpdateRoleState({
										...updateRoleState,
										requiresTwoFactor: e,
									});
								}}
							/>
						</Tooltip>
					</div>

					<div>
						<p>{t("dashboard:roles.modals.update.permissions")}</p>
						<Collapse
							defaultActiveKey={["1"]}
							className="w-full"
							items={[
								{
									key: "1",
									label: (
										<div className="flex items-center gap-2">
											{t("dashboard:roles.modals.update.products")}
											<Tooltip
												title={t("dashboard:roles.modals.update.enableAll")}
												placement="right"
											>
												<Switch
													checked={
														updateRoleState.permissions.includes(
															"products:create",
														) &&
														updateRoleState.permissions.includes(
															"products:update",
														) &&
														updateRoleState.permissions.includes(
															"products:delete",
														)
													}
													onChange={(checked) => {
														setUpdateRoleState({
															...updateRoleState,
															permissions: checked
																? [
																		...new Set([
																			...updateRoleState.permissions,
																			"products:create",
																			"products:update",
																			"products:view",
																			"products:delete",
																		]),
																	]
																: updateRoleState.permissions.filter(
																		(p) =>
																			![
																				"products:create",
																				"products:update",
																				"products:delete",
																				"products:view",
																			].includes(p),
																	),
														});
													}}
												/>
											</Tooltip>
										</div>
									),
									children: (
										<div className="flex items-center flex-wrap gap-8">
											{["create", "update", "delete", "view"].map((action) => (
												<div
													key={`purchases-${action}`}
													className="flex gap-2 items-center"
												>
													<label htmlFor={`update-products-${action}`}>
														{t(`dashboard:roles.modals.update.${action}`)}
													</label>
													<Switch
														id={`update-products-${action}`}
														checked={updateRoleState.permissions.includes(
															`products:${action}`,
														)}
														onChange={(e) => {
															setUpdateRoleState({
																...updateRoleState,
																permissions: e
																	? [
																			...updateRoleState.permissions,
																			`products:${action}`,
																		]
																	: updateRoleState.permissions.filter(
																			(perm) => perm !== `products:${action}`,
																		),
															});
														}}
													/>
												</div>
											))}
										</div>
									),
								},
								{
									key: "2",
									label: (
										<div className="flex items-center gap-2">
											{t("dashboard:roles.modals.update.sales")}
											<Tooltip
												title={t("dashboard:roles.modals.update.enableAll")}
												placement="right"
											>
												<Switch
													checked={
														updateRoleState.permissions.includes(
															"purchases:create",
														) &&
														updateRoleState.permissions.includes(
															"purchases:update",
														) &&
														updateRoleState.permissions.includes(
															"purchases:refund",
														) &&
														updateRoleState.permissions.includes(
															"purchases:delete",
														) &&
														updateRoleState.permissions.includes(
															"purchases:view",
														)
													}
													onChange={(checked) => {
														setUpdateRoleState({
															...updateRoleState,
															permissions: checked
																? [
																		...new Set([
																			...updateRoleState.permissions,
																			"purchases:create",
																			"purchases:update",
																			"purchases:refund",
																			"purchases:delete",
																			"purchases:view",
																		]),
																	]
																: updateRoleState.permissions.filter(
																		(p) =>
																			![
																				"purchases:create",
																				"purchases:update",
																				"purchases:refund",
																				"purchases:view",
																				"purchases:delete",
																			].includes(p),
																	),
														});
													}}
												/>
											</Tooltip>
										</div>
									),
									children: (
										<div className="flex items-center flex-wrap gap-8">
											{["create", "update", "refund", "delete", "view"].map(
												(action) => (
													<div
														key={`purchases-${action}`}
														className="flex gap-2 items-center"
													>
														<label htmlFor={`update-purchases-${action}`}>
															{t(`dashboard:roles.modals.update.${action}`)}
														</label>
														<Switch
															id={`update-purchases-${action}`}
															checked={updateRoleState.permissions.includes(
																`purchases:${action}`,
															)}
															onChange={(e) => {
																setUpdateRoleState({
																	...updateRoleState,
																	permissions: e
																		? [
																				...updateRoleState.permissions,
																				`purchases:${action}`,
																			]
																		: updateRoleState.permissions.filter(
																				(perm) =>
																					perm !== `purchases:${action}`,
																			),
																});
															}}
														/>
													</div>
												),
											)}
										</div>
									),
								},
								{
									key: "3",
									label: (
										<div className="flex items-center gap-2">
											{t("dashboard:roles.modals.update.purchases")}
											<Tooltip
												title={t("dashboard:roles.modals.update.enableAll")}
												placement="right"
											>
												<Switch
													checked={
														updateRoleState.permissions.includes(
															"sales:create",
														) &&
														updateRoleState.permissions.includes(
															"sales:update",
														) &&
														updateRoleState.permissions.includes(
															"sales:refund",
														) &&
														updateRoleState.permissions.includes(
															"sales:delete",
														) &&
														updateRoleState.permissions.includes(
															"sales:discount",
														) &&
														updateRoleState.permissions.includes("sales:view")
													}
													onChange={(checked) => {
														setUpdateRoleState({
															...updateRoleState,
															permissions: checked
																? [
																		...new Set([
																			...updateRoleState.permissions,
																			"sales:create",
																			"sales:update",
																			"sales:refund",
																			"sales:view",
																			"sales:discount",
																			"sales:delete",
																		]),
																	]
																: updateRoleState.permissions.filter(
																		(p) =>
																			![
																				"sales:create",
																				"sales:update",
																				"sales:refund",
																				"sales:discount",
																				"sales:view",
																				"sales:delete",
																			].includes(p),
																	),
														});
													}}
												/>
											</Tooltip>
										</div>
									),
									children: (
										<div className="flex items-center flex-wrap gap-8">
											{[
												"create",
												"update",
												"delete",
												"refund",
												"discount",
												"view",
											].map((action) => (
												<div
													key={`sales-${action}`}
													className="flex gap-2 items-center"
												>
													<label htmlFor={`update-sales-${action}`}>
														{t(`dashboard:roles.modals.update.${action}`)}
													</label>
													<Switch
														id={`update-sales-${action}`}
														checked={updateRoleState.permissions.includes(
															`sales:${action}`,
														)}
														onChange={(e) => {
															setUpdateRoleState({
																...updateRoleState,
																permissions: e
																	? [
																			...updateRoleState.permissions,
																			`sales:${action}`,
																		]
																	: updateRoleState.permissions.filter(
																			(perm) => perm !== `sales:${action}`,
																		),
															});
														}}
													/>
												</div>
											))}
										</div>
									),
								},
								{
									key: "4",
									label: (
										<div className="flex items-center gap-2">
											{t("dashboard:roles.modals.update.warehouses")}
											<Tooltip
												title={t("dashboard:roles.modals.update.enableAll")}
												placement="right"
											>
												<Switch
													checked={
														updateRoleState.permissions.includes(
															"warehouses:create",
														) &&
														updateRoleState.permissions.includes(
															"warehouses:update",
														) &&
														updateRoleState.permissions.includes(
															"warehouses:delete",
														) &&
														updateRoleState.permissions.includes(
															"warehouses:view",
														)
													}
													onChange={(checked) => {
														setUpdateRoleState({
															...updateRoleState,
															permissions: checked
																? [
																		...new Set([
																			...updateRoleState.permissions,
																			"warehouses:create",
																			"warehouses:update",
																			"warehouses:view",
																			"warehouses:delete",
																		]),
																	]
																: updateRoleState.permissions.filter(
																		(p) =>
																			![
																				"warehouses:create",
																				"warehouses:view",
																				"warehouses:update",
																				"warehouses:delete",
																			].includes(p),
																	),
														});
													}}
												/>
											</Tooltip>
										</div>
									),
									children: (
										<div className="flex items-center flex-wrap gap-8">
											{["create", "update", "delete", "view"].map((action) => (
												<div
													key={`warehouses-${action}`}
													className="flex gap-2 items-center"
												>
													<label htmlFor={`update-warehouses-${action}`}>
														{t(`dashboard:roles.modals.update.${action}`)}
													</label>
													<Switch
														id={`update-warehouses-${action}`}
														checked={updateRoleState.permissions.includes(
															`warehouses:${action}`,
														)}
														onChange={(e) => {
															setUpdateRoleState({
																...updateRoleState,
																permissions: e
																	? [
																			...updateRoleState.permissions,
																			`warehouses:${action}`,
																		]
																	: updateRoleState.permissions.filter(
																			(perm) => perm !== `warehouses:${action}`,
																		),
															});
														}}
													/>
												</div>
											))}
										</div>
									),
								},
								{
									key: "5",
									label: (
										<div className="flex items-center gap-2">
											{t("dashboard:roles.modals.update.roles")}
											<Tooltip
												title={t("dashboard:roles.modals.update.enableAll")}
												placement="right"
											>
												<Switch
													checked={
														updateRoleState.permissions.includes(
															"roles:create",
														) &&
														updateRoleState.permissions.includes(
															"roles:update",
														) &&
														updateRoleState.permissions.includes(
															"roles:delete",
														) &&
														updateRoleState.permissions.includes("roles:view")
													}
													onChange={(checked) => {
														setUpdateRoleState({
															...updateRoleState,
															permissions: checked
																? [
																		...new Set([
																			...updateRoleState.permissions,
																			"roles:create",
																			"roles:update",
																			"roles:delete",
																			"roles:view",
																		]),
																	]
																: updateRoleState.permissions.filter(
																		(p) =>
																			![
																				"roles:create",
																				"roles:update",
																				"roles:view",
																				"roles:delete",
																			].includes(p),
																	),
														});
													}}
												/>
											</Tooltip>
										</div>
									),
									children: (
										<div className="flex items-center flex-wrap gap-8">
											{["create", "update", "delete", "view"].map((action) => (
												<div
													key={`roles-${action}`}
													className="flex gap-2 items-center"
												>
													<label htmlFor={`update-roles-${action}`}>
														{t(`dashboard:roles.modals.update.${action}`)}
													</label>
													<Switch
														id={`update-roles-${action}`}
														checked={updateRoleState.permissions.includes(
															`roles:${action}`,
														)}
														onChange={(e) => {
															setUpdateRoleState({
																...updateRoleState,
																permissions: e
																	? [
																			...updateRoleState.permissions,
																			`roles:${action}`,
																		]
																	: updateRoleState.permissions.filter(
																			(perm) => perm !== `roles:${action}`,
																		),
															});
														}}
													/>
												</div>
											))}
										</div>
									),
								},
								{
									key: "6",
									label: (
										<div className="flex items-center gap-2">
											{t("dashboard:roles.modals.update.accounts")}
											<Tooltip
												title={t("dashboard:roles.modals.update.enableAll")}
												placement="right"
											>
												<Switch
													checked={
														updateRoleState.permissions.includes(
															"accounts:create",
														) &&
														updateRoleState.permissions.includes(
															"accounts:update",
														) &&
														updateRoleState.permissions.includes(
															"accounts:delete",
														) &&
														updateRoleState.permissions.includes(
															"accounts:view",
														)
													}
													onChange={(checked) => {
														setUpdateRoleState({
															...updateRoleState,
															permissions: checked
																? [
																		...new Set([
																			...updateRoleState.permissions,
																			"accounts:create",
																			"accounts:update",
																			"accounts:view",
																			"accounts:delete",
																		]),
																	]
																: updateRoleState.permissions.filter(
																		(p) =>
																			![
																				"accounts:create",
																				"accounts:view",
																				"accounts:update",
																				"accounts:delete",
																			].includes(p),
																	),
														});
													}}
												/>
											</Tooltip>
										</div>
									),
									children: (
										<div className="flex items-center flex-wrap gap-8">
											{["create", "update", "delete", "view"].map((action) => (
												<div
													key={`accounts-${action}`}
													className="flex gap-2 items-center"
												>
													<label htmlFor={`update-accounts-${action}`}>
														{t(`dashboard:roles.modals.update.${action}`)}
													</label>
													<Switch
														id={`update-accounts-${action}`}
														checked={updateRoleState.permissions.includes(
															`accounts:${action}`,
														)}
														onChange={(e) => {
															setUpdateRoleState({
																...updateRoleState,
																permissions: e
																	? [
																			...updateRoleState.permissions,
																			`accounts:${action}`,
																		]
																	: updateRoleState.permissions.filter(
																			(perm) => perm !== `accounts:${action}`,
																		),
															});
														}}
													/>
												</div>
											))}
										</div>
									),
								},
								{
									key: "7",
									label: (
										<div className="flex items-center gap-2">
											{t("dashboard:roles.modals.update.settings")}
											<Tooltip
												title={t("dashboard:roles.modals.update.enableAll")}
												placement="right"
											>
												<Switch
													checked={
														updateRoleState.permissions.includes(
															"settings:view",
														) &&
														updateRoleState.permissions.includes(
															"settings:update",
														)
													}
													onChange={(checked) => {
														setUpdateRoleState({
															...updateRoleState,
															permissions: checked
																? [
																		...new Set([
																			...updateRoleState.permissions,
																			"settings:view",
																			"settings:update",
																		]),
																	]
																: updateRoleState.permissions.filter(
																		(p) =>
																			![
																				"settings:view",
																				"settings:update",
																			].includes(p),
																	),
														});
													}}
												/>
											</Tooltip>
										</div>
									),
									children: (
										<div className="flex items-center flex-wrap gap-8">
											{["view", "update"].map((action) => (
												<div
													key={`settings-${action}`}
													className="flex gap-2 items-center"
												>
													<label htmlFor={`update-settings-${action}`}>
														{t(`dashboard:roles.modals.update.${action}`)}
													</label>
													<Switch
														id={`update-settings-${action}`}
														checked={updateRoleState.permissions.includes(
															`settings:${action}`,
														)}
														onChange={(e) => {
															setUpdateRoleState({
																...updateRoleState,
																permissions: e
																	? [
																			...updateRoleState.permissions,
																			`settings:${action}`,
																		]
																	: updateRoleState.permissions.filter(
																			(perm) => perm !== `settings:${action}`,
																		),
															});
														}}
													/>
												</div>
											))}
										</div>
									),
								},
								{
									key: "8",
									label: (
										<div className="flex items-center gap-2">
											{t("dashboard:roles.modals.update.reports")}
											<Tooltip
												placement="right"
												title={t("dashboard:roles.modals.update.enableAll")}
											>
												<Switch
													checked={updateRoleState.permissions.includes(
														"reports:view",
													)}
													onChange={(checked) => {
														setUpdateRoleState({
															...updateRoleState,
															permissions: checked
																? [
																		...new Set([
																			...updateRoleState.permissions,
																			"reports:view",
																		]),
																	]
																: updateRoleState.permissions.filter(
																		(p) => !["reports:view"].includes(p),
																	),
														});
													}}
												/>
											</Tooltip>
										</div>
									),
									children: (
										<div className="flex items-center flex-wrap gap-8">
											{["view"].map((action) => (
												<div
													key={`reports-${action}`}
													className="flex gap-2 items-center"
												>
													<label htmlFor={`update-reports-${action}`}>
														{t(`dashboard:roles.modals.update.${action}`)}
													</label>
													<Switch
														id={`update-reports-${action}`}
														checked={updateRoleState.permissions.includes(
															`reports:${action}`,
														)}
														onChange={(e) => {
															setUpdateRoleState({
																...updateRoleState,
																permissions: e
																	? [
																			...updateRoleState.permissions,
																			`reports:${action}`,
																		]
																	: updateRoleState.permissions.filter(
																			(perm) => perm !== `reports:${action}`,
																		),
															});
														}}
													/>
												</div>
											))}
										</div>
									),
								},
								{
									key: "9",
									label: (
										<div className="flex items-center gap-2">
											{t("dashboard:roles.modals.update.categories")}
											<Tooltip
												title={t("dashboard:roles.modals.update.enableAll")}
												placement="right"
											>
												<Switch
													checked={
														updateRoleState.permissions.includes(
															"categories:view",
														) &&
														updateRoleState.permissions.includes(
															"categories:create",
														) &&
														updateRoleState.permissions.includes(
															"categories:update",
														) &&
														updateRoleState.permissions.includes(
															"categories:delete",
														)
													}
													onChange={(checked) => {
														setUpdateRoleState({
															...updateRoleState,
															permissions: checked
																? [
																		...new Set([
																			...updateRoleState.permissions,
																			"categories:view",
																			"categories:update",
																			"categories:delete",
																			"categories:create",
																		]),
																	]
																: updateRoleState.permissions.filter(
																		(p) =>
																			![
																				"categories:view",
																				"categories:update",
																				"categories:delete",
																				"categories:create",
																			].includes(p),
																	),
														});
													}}
												/>
											</Tooltip>
										</div>
									),

									children: (
										<div className="flex items-center flex-wrap gap-8">
											{["view", "create", "update", "delete"].map((action) => (
												<div
													key={`categories-${action}`}
													className="flex gap-2 items-center"
												>
													<label htmlFor={`update-categories-${action}`}>
														{t(`dashboard:roles.modals.update.${action}`)}
													</label>
													<Switch
														id={`update-categories-${action}`}
														checked={updateRoleState.permissions.includes(
															`categories:${action}`,
														)}
														onChange={(e) => {
															setUpdateRoleState({
																...updateRoleState,
																permissions: e
																	? [
																			...updateRoleState.permissions,
																			`categories:${action}`,
																		]
																	: updateRoleState.permissions.filter(
																			(perm) => perm !== `categories:${action}`,
																		),
															});
														}}
													/>
												</div>
											))}
										</div>
									),
								},
								{
									key: "10",
									label: (
										<div className="flex items-center gap-2">
											{t("dashboard:roles.modals.update.stores")}
											<Tooltip
												title={t("dashboard:roles.modals.update.enableAll")}
												placement="right"
											>
												<Switch
													checked={
														updateRoleState.permissions.includes(
															"stores:view",
														) &&
														updateRoleState.permissions.includes(
															"stores:create",
														) &&
														updateRoleState.permissions.includes(
															"stores:update",
														) &&
														updateRoleState.permissions.includes(
															"stores:delete",
														)
													}
													onChange={(checked) => {
														setUpdateRoleState({
															...updateRoleState,
															permissions: checked
																? [
																		...new Set([
																			...updateRoleState.permissions,
																			"stores:view",
																			"stores:update",
																			"stores:delete",
																			"stores:create",
																		]),
																	]
																: updateRoleState.permissions.filter(
																		(p) =>
																			![
																				"stores:view",
																				"stores:update",
																				"stores:delete",
																				"stores:create",
																			].includes(p),
																	),
														});
													}}
												/>
											</Tooltip>
										</div>
									),

									children: (
										<div className="flex items-center flex-wrap gap-8">
											{["view", "create", "update", "delete"].map((action) => (
												<div
													key={`stores-${action}`}
													className="flex gap-2 items-center"
												>
													<label htmlFor={`update-stores-${action}`}>
														{t(`dashboard:roles.modals.update.${action}`)}
													</label>
													<Switch
														id={`update-stores-${action}`}
														checked={updateRoleState.permissions.includes(
															`stores:${action}`,
														)}
														onChange={(e) => {
															setUpdateRoleState({
																...updateRoleState,
																permissions: e
																	? [
																			...updateRoleState.permissions,
																			`stores:${action}`,
																		]
																	: updateRoleState.permissions.filter(
																			(perm) => perm !== `stores:${action}`,
																		),
															});
														}}
													/>
												</div>
											))}
										</div>
									),
								},
								{
									key: "11",
									label: (
										<div className="flex items-center gap-2">
											{t("dashboard:roles.modals.update.suppliers")}
											<Tooltip
												title={t("dashboard:roles.modals.update.enableAll")}
												placement="right"
											>
												<Switch
													checked={
														updateRoleState.permissions.includes(
															"suppliers:view",
														) &&
														updateRoleState.permissions.includes(
															"suppliers:create",
														) &&
														updateRoleState.permissions.includes(
															"suppliers:update",
														) &&
														updateRoleState.permissions.includes(
															"suppliers:delete",
														)
													}
													onChange={(checked) => {
														setUpdateRoleState({
															...updateRoleState,
															permissions: checked
																? [
																		...new Set([
																			...updateRoleState.permissions,
																			"suppliers:view",
																			"suppliers:update",
																			"suppliers:delete",
																			"suppliers:create",
																		]),
																	]
																: updateRoleState.permissions.filter(
																		(p) =>
																			![
																				"suppliers:view",
																				"suppliers:update",
																				"suppliers:delete",
																				"suppliers:create",
																			].includes(p),
																	),
														});
													}}
												/>
											</Tooltip>
										</div>
									),
									children: (
										<div className="flex items-center flex-wrap gap-8">
											{["view", "create", "update", "delete"].map((action) => (
												<div
													key={`suppliers-${action}`}
													className="flex gap-2 items-center"
												>
													<label htmlFor={`update-suppliers-${action}`}>
														{t(`dashboard:roles.modals.update.${action}`)}
													</label>
													<Switch
														id={`update-suppliers-${action}`}
														checked={updateRoleState.permissions.includes(
															`suppliers:${action}`,
														)}
														onChange={(e) => {
															setUpdateRoleState({
																...updateRoleState,
																permissions: e
																	? [
																			...updateRoleState.permissions,
																			`suppliers:${action}`,
																		]
																	: updateRoleState.permissions.filter(
																			(perm) => perm !== `suppliers:${action}`,
																		),
															});
														}}
													/>
												</div>
											))}
										</div>
									),
								},
							]}
						/>
					</div>
				</div>
			</Drawer>

			{/* Create Role */}
			<Modal
				title={t("dashboard:roles.modals.create.title")}
				open={createRoleState.isOpen}
				onOk={createRole}
				okText={t("dashboard:common.create")}
				cancelText={t("dashboard:common.cancel")}
				onCancel={() =>
					setCreateRoleState({
						isOpen: false,
						name: "",
						level: 1,
					})
				}
			>
				<p>{t("dashboard:roles.modals.create.description")}</p>
				<div className="flex flex-col gap-4 mt-4">
					<div>
						<label htmlFor="create-name">
							{t("dashboard:roles.modals.create.name")}
						</label>
						<Input
							id="create-name"
							type="text"
							value={createRoleState.name}
							onChange={(e) => {
								setCreateRoleState({
									...createRoleState,
									name: e.target.value,
								});
							}}
							placeholder={t("dashboard:roles.modals.create.namePlaceholder")}
						/>
					</div>

					<div>
						<label htmlFor="create-level">
							{t("dashboard:roles.modals.create.level")}
						</label>
						<Input
							id="create-level"
							type="number"
							value={createRoleState.level}
							onChange={(e) => {
								setCreateRoleState({
									...createRoleState,
									level: parseInt(e.target.value),
								});
							}}
							placeholder={t("dashboard:roles.modals.create.levelPlaceholder")}
						/>
					</div>
				</div>
			</Modal>

			{/* Delete Role */}
			<Modal
				title={t("dashboard:roles.modals.delete.title")}
				open={deleteRoleState.roleId != null}
				onOk={deleteRole}
				okButtonProps={{ variant: "solid", color: "red" }}
				okText={t("dashboard:common.delete")}
				cancelText={t("dashboard:common.cancel")}
				onCancel={() =>
					setDeleteRoleState({
						roleId: undefined,
					})
				}
			>
				<p>{t("dashboard:roles.modals.delete.description")}</p>
			</Modal>

			<div className="mb-2">
				{t("dashboard:common.loggedInAs", {
					name: account?.profile.name,
					email: account?.email.value,
				})}
			</div>

			<Title className="flex items-center gap-2">
				<FaUsersCog />
				{t("dashboard:roles.page.title")}
			</Title>

			<Text>{t("dashboard:roles.page.description")}</Text>

			<div className="my-2 flex items-center gap-2">
				<Button
					variant="outlined"
					onClick={() => {
						navigate({
							to: "/dashboard/accounts",
						});
					}}
				>
					{t("dashboard:roles.page.returnToAccounts")}
				</Button>

				<Button
					variant="solid"
					type="primary"
					disabled={
						!account ||
						!(
							account?.data.role.permissions.includes("*") ||
							account?.data.role.permissions.includes("roles:update")
						)
					}
					onClick={() => {
						setCreateRoleState({
							...createRoleState,
							isOpen: true,
						});
					}}
				>
					{t("dashboard:roles.page.createRole")}
				</Button>
			</div>

			{/* Search */}
			<div className="flex gap-2 items-center">
				<Input.Search
					type="text"
					variant="outlined"
					onChange={(e) =>
						setSearchState({ ...searchState, query: e.target.value })
					}
					allowClear
					onSearch={searchRoles}
					loading={searchState.loading}
					enterButton={t("dashboard:common.search")}
					placeholder={t("dashboard:roles.page.searchPlaceholder")}
				/>
			</div>

			{/* Roles List */}

			{account && (
				<Table
					className="mt-4 overflow-x-scroll"
					dataSource={rolesListState.roles}
					loading={rolesListState.loading}
					pagination={{
						pageSize: rolesListState.count,
						total: rolesListState.totalRoles,
						showSizeChanger: true,
						onShowSizeChange: (current, size) => {
							setRolesListState({
								...rolesListState,
								count: size,
								page: current - 1,
								loading: true,
							});
							fetchRoles(size, current - 1);
						},
					}}
					rowKey={(record) => record._id.toString()}
					columns={[
						{
							title: t("dashboard:roles.table.name"),
							dataIndex: "name",
							key: "name",
						},
						{
							title: t("dashboard:roles.table.level"),
							dataIndex: "level",
							key: "level",
						},
						{
							title: t("dashboard:roles.table.totalPermissions"),
							dataIndex: "totalPermissions",
							key: "totalPermissions",
						},
						{
							title: t("dashboard:roles.table.actions"),
							key: "actions",
							render: (_, record: ListRole) => (
								<div className="flex items-center gap-2">
									<Tooltip
										placement="top"
										title={t("dashboard:roles.table.editTooltip")}
									>
										<Button
											variant="outlined"
											disabled={
												account!.data.role.level >= record.level ||
												!(
													account!.data.role.permissions.includes("*") ||
													account!.data.role.permissions.includes(
														"roles:update",
													)
												)
											}
											onClick={async () => {
												const result = await RolesFeature.rolesAPI.get({
													roleIds: [record._id.toString()],
												});
												if (result.status == "success") {
													const role = result.roles![0];
													setUpdateRoleState({
														...updateRoleState,
														roleId: role._id.toString(),
														name: role.name,
														level: role.level,
														permissions: role.permissions,
														requiresTwoFactor: role.requiresTwoFactor,
													});
												} else {
													message.error(t(`error-messages:${result.status}`));
												}
											}}
										>
											<FaPencilAlt />
										</Button>
									</Tooltip>

									<Tooltip
										placement="top"
										title={t("dashboard:roles.table.deleteTooltip")}
									>
										<Button
											variant="outlined"
											danger
											disabled={
												account!.data.role.level >= record.level ||
												!(
													account!.data.role.permissions.includes("*") ||
													account!.data.role.permissions.includes(
														"roles:delete",
													)
												)
											}
											onClick={() => {
												setDeleteRoleState({
													roleId: record._id.toString(),
												});
											}}
										>
											<FaTrash />
										</Button>
									</Tooltip>
								</div>
							),
						},
					]}
				/>
			)}
		</AdminPageLayout>
	);
}
