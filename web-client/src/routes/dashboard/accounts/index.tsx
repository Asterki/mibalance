import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { useTranslation } from "react-i18next";

import { FaPencilAlt, FaUser, FaTrashAlt } from "react-icons/fa";

import AccountsFeature from "../../../features/accounts";
import RolesFeature from "../../../features/roles";

import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

import {
	Image,
	notification,
	Button,
	Input,
	Modal,
	Drawer,
	Select,
	Table,
	Tooltip,
	Typography,
	Switch,
} from "antd";
const { Text, Title } = Typography;

import AdminPageLayout from "../../../layouts/AdminLayout";
import { IAccountRole } from "../../../../../server/src/models/AccountRole";

export const Route = createFileRoute("/dashboard/accounts/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { account } = useSelector((state: RootState) => state.auth);

	const navigate = useNavigate();
	const [api, contextHolder] = notification.useNotification();
	const { t } = useTranslation(["dashboard", "common"]);

	interface ListAccount {
		_id: string;
		name: string;
		avatarUrl: string;
		email: string;
		role: {
			_id: string;
			name: string;
			level: number;
		};
	}
	const [uniqueRoles, setUniqueRoles] = useState<
		{
			name: string;
			_id: string;
		}[]
	>([]);
	const [accountsListState, setAccountsListState] = useState<{
		loading: boolean;
		accounts: ListAccount[];
		totalAccounts: number;
		count: number;
		page: number;
	}>({
		loading: true,
		accounts: [],
		totalAccounts: 0,
		count: 10,
		page: 0,
	});
	const fetchAccounts = async (count: number, page: number) => {
		setAccountsListState({
			...accountsListState,
			loading: true,
		});

		const result = await AccountsFeature.accountsAPI.list({
			count,
			page,
			fields: ["profile", "email", "data"],
			populate: ["data.role"],
		});

		if (result.status == "success") {
			setAccountsListState({
				loading: false,
				accounts: result.accounts!.map((acc) => {
					return {
						_id: acc._id.toString(),
						name: acc.profile.name,
						avatarUrl: acc.profile.avatarUrl,
						email: acc.email.value,
						role: {
							_id: (acc.data.role as IAccountRole)._id.toString(),
							name: (acc.data.role as IAccountRole).name,
							level: (acc.data.role as IAccountRole).level,
						},
					};
				}),
				totalAccounts: result.totalAccounts ?? 0,
				page,
				count,
			});

			// Get unique roles
			const uniqueRoles = result
				.accounts!.map((account) => account.data.role)
				.filter(
					(role, index, self) =>
						index ===
						self.findIndex(
							(r) =>
								(r as IAccountRole)._id.toString() ===
								(role as IAccountRole)._id.toString(),
						),
				);
			setUniqueRoles(
				uniqueRoles.map((role) => ({
					name: (role as IAccountRole).name,
					_id: (role as IAccountRole)._id.toString(),
				})),
			);
		} else {
			api.error({
				message: t(`admin:accounts.errors.${result.status}`),
			});
			setAccountsListState({
				...accountsListState,
				loading: false,
			});
		}
	};

	interface ListRole {
		_id: string;
		name: string;
		level: number;
	}
	const [rolesListState, setRolesListState] = useState<{
		loading: boolean;
		roles: ListRole[];
	}>({
		loading: true,
		roles: [],
	});
	const fetchRoles = async () => {
		setRolesListState({
			...rolesListState,
			loading: true,
		});

		const result = await RolesFeature.rolesAPI.list({
			page: 0,
			count: 50,
			fields: ["_id", "name", "level"],
		});

		if (result.status == "success") {
			setRolesListState({
				loading: false,
				roles: result.roles!.map((role) => {
					return {
						_id: role._id.toString(),
						name: role.name,
						level: role.level,
					};
				}),
			});
		} else {
			api.error({
				message: t(`admin:accounts.errors.${result.status}`),
			});
			setRolesListState({
				...rolesListState,
				loading: false,
			});
		}
	};

	const [createAccountState, setCreateAccountState] = useState<{
		modalOpen: boolean;
		name: string;
		email: string;
		password: string;
		roleId: string;
	}>({
		modalOpen: false,
		name: "",
		email: "",
		password: "",
		roleId: "",
	});
	const createAccountSchema = z.object({
		name: z.string(),
		email: z.string().email({
			message: "invalid-email",
		}),
		password: z.string().min(8, {
			message: "password-too-short",
		}),
		roleId: z.string().min(1, {
			message: "role-required",
		}),
	});
	const createAccount = async () => {
		const parsedData = createAccountSchema.safeParse({
			name: createAccountState.name,
			email: createAccountState.email,
			password: createAccountState.password,
			roleId: createAccountState.roleId,
		});

		if (!parsedData.success) {
			api.error({
				message: t(
					`dashboard:accounts.modals.create.messages.${parsedData.error.errors[0].message}`,
				),
			});
			return;
		}
		const result = await AccountsFeature.accountsAPI.create(parsedData.data!);

		if (result.status == "success") {
			api.success({
				message: t("dashboard:accounts.modals.create.messages.success"),
			});
			setCreateAccountState({ ...createAccountState, modalOpen: false });

			// Fetch the account list again
			await fetchAccounts(accountsListState.count, accountsListState.page);
		} else {
			api.error({
				message: t(
					`dashboard:accounts.modals.create.messages.${result.status}`,
				),
			});
		}
	};

	const [searchAccountsState, setSearchAccountsState] = useState<{
		query: string;
		loading: boolean;
	}>({
		query: "",
		loading: false,
	});
	const searchAccounts = async () => {
		setSearchAccountsState({
			...searchAccountsState,
			loading: true,
		});

		setAccountsListState({
			...accountsListState,
			loading: true,
		});

		const result = await AccountsFeature.accountsAPI.list({
			filters: {
				name: searchAccountsState.query,
			},
			fields: ["profile", "email", "data"],
			populate: ["data.role"],
			count: 50,
			page: 0,
		});

		setAccountsListState({
			loading: false,
			accounts: result.accounts!.map((acc) => {
				return {
					_id: acc._id.toString(),
					name: acc.profile.name,
					avatarUrl: acc.profile.avatarUrl,
					email: acc.email.value,
					role: {
						_id: (acc.data.role as IAccountRole)._id.toString(),
						name: (acc.data.role as IAccountRole).name,
						level: (acc.data.role as IAccountRole).level,
					},
				};
			}),
			totalAccounts: result.totalAccounts!,
			page: 0,
			count: 10,
		});

		setSearchAccountsState({
			...searchAccountsState,
			loading: false,
		});
	};

	const [deleteAccountState, setDeleteAccountState] = useState<{
		accountId: string | null;
	}>({
		accountId: null,
	});

	const [updateAccountState, setUpdateAccountState] = useState<{
		accountId: string | null;
		name: string;
		avatarUrl: string;
		email: string;
		password: string;
		roleId: string;
		disableTwoFactor: boolean;
	}>({
		accountId: null,
		name: "",
		avatarUrl: "",
		email: "",
		password: "",
		roleId: "",
		disableTwoFactor: false,
	});
	const updateAccountSchema = z.object({
		accountId: z.string(),
		name: z.string(),
		email: z.string().email({
			message: "invalid-email",
		}),
		password: z.string().optional(),
		roleId: z.string().min(1, {
			message: "role-required",
		}),
	});
	const updateAccount = async () => {
		const parsedData = updateAccountSchema.safeParse({
			accountId: updateAccountState.accountId,
			name: updateAccountState.name,
			email: updateAccountState.email,
			password:
				updateAccountState.password == ""
					? undefined
					: updateAccountState.password,
			roleId: updateAccountState.roleId,
		});
		console.log(parsedData);

		if (!parsedData.success) {
			api.error({
				message: t(
					`dashboard:accounts.modals.update.messages.${parsedData.error.errors[0].message}`,
				),
			});
			return;
		}
		const result = await AccountsFeature.accountsAPI.update(parsedData.data!);

		if (result.status == "success") {
			api.success({
				message: t("dashboard:accounts.modals.update.messages.success"),
			});
			setUpdateAccountState({ ...updateAccountState, accountId: null });

			// Fetch the account list again
			await fetchAccounts(accountsListState.count, accountsListState.page);
		} else {
			api.error({
				message: t(
					`dashboard:accounts.modals.update.messages.${result.status}`,
				),
			});
		}
	};

	useEffect(() => {
		(async () => {
			await fetchAccounts(50, 0);
			await fetchRoles();
		})();
	}, []);

	return (
		<AdminPageLayout selectedPage="accounts">
			{contextHolder}

			<Modal
				title={t("dashboard:accounts.modals.create.title")}
				open={createAccountState.modalOpen}
				onClose={() =>
					setCreateAccountState({
						password: "",
						name: "",
						email: "",
						roleId: "",
						modalOpen: false,
					})
				}
				onCancel={() => {
					setCreateAccountState({
						password: "",
						name: "",
						email: "",
						roleId: "",
						modalOpen: false,
					});
				}}
				cancelText={t("common.cancel")}
				onOk={() => {
					createAccount();
				}}
				okText={t("dashboard:accounts.modals.create.title")}
			>
				<p>{t("accounts.modals.create.description")}</p>

				<div className="mt-4">
					<label htmlFor="create-name">
						{t("dashboard:accounts.modals.create.name")}
					</label>
					<Input
						id="create-name"
						type="text"
						placeholder={t("dashboard:accounts.modals.create.namePlaceholder")}
						value={createAccountState.name}
						onChange={(e) =>
							setCreateAccountState({
								...createAccountState,
								name: e.target.value,
							})
						}
					/>
				</div>
				<div className="mt-4">
					<label htmlFor="create-email">
						{t("dashboard:accounts.modals.create.email")}
					</label>
					<Input
						id="create-email"
						type="text"
						value={createAccountState.email}
						placeholder={t("dashboard:accounts.modals.create.emailPlaceholder")}
						onChange={(e) =>
							setCreateAccountState({
								...createAccountState,
								email: e.target.value,
							})
						}
					/>
				</div>
				<div className="mt-4">
					<label htmlFor="create-password">
						{t("dashboard:accounts.modals.create.password")}
					</label>
					<Input
						id="create-password"
						type="text"
						value={createAccountState.password}
						placeholder={t(
							"dashboard:accounts.modals.create.passwordPlaceholder",
						)}
						onChange={(e) =>
							setCreateAccountState({
								...createAccountState,
								password: e.target.value,
							})
						}
					/>
				</div>
				<div className="mt-4">
					<label htmlFor="create-role">
						{t("dashboard:accounts.modals.create.role")}
					</label>
					<Select
						className="w-full"
						id="create-role"
						value={createAccountState.roleId}
						placeholder={t("dashboard:accounts.modals.create.rolePlaceholder")}
						onChange={(val) =>
							setCreateAccountState({
								...createAccountState,
								roleId: val,
							})
						}
						options={rolesListState.roles.map((role) => {
							return {
								value: role._id,
								label: `${role.name} (${role.level})`,
							};
						})}
					/>
				</div>
			</Modal>

			{/* This window manages the account editing */}
			<Drawer
				title={t("dashboard:accounts.modals.update.title")}
				open={updateAccountState.accountId !== null}
				onClose={() =>
					setUpdateAccountState({
						...updateAccountState,
						accountId: null,
					})
				}
				width={1000}
				extra={
					<div className="flex justify-end gap-2">
						<Button
							variant="solid"
							type="primary"
							onClick={() => {
								updateAccount();
							}}
						>
							{t("dashboard:accounts.modals.update.title")}
						</Button>
					</div>
				}
			>
				<p>{t("dashboard:accounts.modals.update.description")}</p>

				<div className="mt-4">
					<label htmlFor="update-name">
						{t("dashboard:accounts.modals.update.name")}
					</label>
					<Input
						id="update-name"
						type="text"
						placeholder={t("dashboard:accounts.modals.update.namePlaceholder")}
						value={updateAccountState.name}
						onChange={(e) =>
							setUpdateAccountState({
								...updateAccountState,
								name: e.target.value,
							})
						}
					/>
				</div>
				<div className="mt-4">
					<label htmlFor="update-email">
						{t("dashboard:accounts.modals.update.email")}
					</label>
					<Input
						id="update-email"
						type="text"
						value={updateAccountState.email}
						placeholder={t("dashboard:accounts.modals.update.emailPlaceholder")}
						onChange={(e) =>
							setUpdateAccountState({
								...updateAccountState,
								email: e.target.value,
							})
						}
					/>
				</div>
				<div className="mt-4">
					<label htmlFor="update-password">
						{t("dashboard:accounts.modals.update.password")}
					</label>
					<Input
						id="update-password"
						type="text"
						value={updateAccountState.password}
						placeholder={t(
							"dashboard:accounts.modals.update.passwordPlaceholder",
						)}
						onChange={(e) =>
							setUpdateAccountState({
								...updateAccountState,
								password: e.target.value,
							})
						}
					/>
				</div>
				<div className="mt-4">
					<label htmlFor="update-role">
						{t("dashboard:accounts.modals.update.role")}
					</label>
					<Select
						className="w-full"
						id="update-role"
						value={updateAccountState.roleId}
						placeholder={t("dashboard:accounts.modals.update.rolePlaceholder")}
						onChange={(val) =>
							setUpdateAccountState({
								...updateAccountState,
								roleId: val,
							})
						}
						options={rolesListState.roles.map((role) => {
							return {
								value: role._id,
								label: `${role.name} (${role.level})`,
							};
						})}
					/>
				</div>
				<div className="mt-4 flex items-center gap-2">
					<label htmlFor="update-disable-two-factor">
						{t("dashboard:accounts.modals.update.disableTwoFactor")}
					</label>
					<Tooltip
						title={t(
							"dashboard:accounts.modals.update.disableTwoFactorTooltip",
						)}
					>
						<Switch
							id="update-disable-two-factor"
							checked={updateAccountState.disableTwoFactor}
							onChange={(e) =>
								setUpdateAccountState({
									...updateAccountState,
									disableTwoFactor: e,
								})
							}
						/>
					</Tooltip>
				</div>
			</Drawer>

			{/* This window manages the account deletion */}
			<Modal
				open={deleteAccountState.accountId !== null}
				onClose={() => setDeleteAccountState({ accountId: null })}
				onCancel={() => {
					setDeleteAccountState({ accountId: null });
				}}
				cancelText={t("dashboard:common.cancel")}
				okButtonProps={{ variant: "solid", color: "red" }}
				okText={t("dashboard:accounts.modals.delete.title")}
				onOk={async () => {
					const result = await AccountsFeature.accountsAPI.delete({
						accountId: deleteAccountState.accountId!,
					});

					if (result.status == "success") {
						setDeleteAccountState({
							accountId: null,
						});

						await fetchAccounts(10, 0);

						api.success({
							message: t("dashboard:accounts.modals.delete.messages.success"),
						});
					} else {
						api.error({
							message: t(`dashboard:accounts.modals.delete.messages.error`),
						});
					}
				}}
				title={t("dashboard:accounts.modals.delete.title")}
			>
				<div>
					<p>{t("dashboard:accounts.modals.delete.description")}</p>
				</div>
			</Modal>

			<div className="mb-2">
				{t("dashboard:common.loggedInAs", {
					name: account?.profile.name,
					email: account?.email.value,
				})}
			</div>

			<Title className="flex items-center gap-2">
				<FaUser />
				{t("dashboard:accounts.page.title")}
			</Title>

			<Text>{t("dashboard:accounts.page.description")}</Text>

			<div className="my-2 flex gap-2">
				<Button
					variant="outlined"
					onClick={() => navigate({ to: "/dashboard/accounts/roles" })}
				>
					{t("dashboard:accounts.page.manageRoles")}
				</Button>

				<Button
					variant="solid"
					type="primary"
					className="bg-blue-500 text-white px-4 py-2 rounded-md"
					onClick={() =>
						setCreateAccountState({ ...createAccountState, modalOpen: true })
					}
					disabled={
						!account ||
						!(
							account?.data.role.permissions.includes("*") ||
							account?.data.role.permissions.includes("accounts:create")
						)
					}
				>
					{t("dashboard:accounts.page.createAccount")}
				</Button>
			</div>

			{/* Search */}
			<section>
				<Input.Search
					type="text"
					variant="outlined"
					allowClear
					onClear={async () => {
						await fetchAccounts(50, 0);
					}}
					loading={searchAccountsState.loading}
					onSearch={() => {
						searchAccounts();
					}}
					enterButton={t("dashboard:common.search")}
					placeholder={t("dashboard:accounts.page.searchPlaceholder")}
					onChange={(e) => {
						setSearchAccountsState({
							...searchAccountsState,
							query: e.target.value,
						});
					}}
				/>
			</section>

			<div className="mt-4">
				<Table
					className="w-full overflow-x-scroll"
					dataSource={accountsListState.accounts}
					columns={[
						{
							title: t("dashboard:accounts.table.name"),
							render: (_, record) => (
								<div className="flex items-center gap-2">
									<Image
										src={`${import.meta.env.VITE_SERVER_URL}${record.avatarUrl}`}
										className="rounded-full w-10 h-10"
										height={40}
										width={40}
										fallback="/avatar.png"
									/>
									<p>{record.name}</p>
								</div>
							),
						},
						{
							title: t("dashboard:accounts.table.email"),
							render: (_, record) => <p>{record.email}</p>,
						},
						{
							filterSearch: true,
							filters: uniqueRoles.map((role) => {
								return {
									text: role.name,
									value: role._id,
								};
							}),
							onFilter: (value, record) => {
								return record.role._id == value;
							},
							title: t("dashboard:accounts.table.role"),
							render: (_, record) => (
								<p>
									{record.role.name} ({record.role.level})
								</p>
							),
						},
						{
							title: t("dashboard:accounts.table.actions"),
							key: "actions",
							render: (_, record) => (
								<div className="flex gap-2 items-center justify-center">
									<Tooltip title={t("dashboard:accounts.table.editTooltip")}>
										<Button
											variant="outlined"
											disabled={
												record._id.toString() == account?._id.toString() ||
												account!.data.role.level >= record.role.level
											}
											onClick={async () => {
												const result = await AccountsFeature.accountsAPI.get({
													accountIds: [record._id.toString()],
													fields: ["profile", "email", "data", "_id"],
												});
												if (result.status == "success") {
													setUpdateAccountState({
														...updateAccountState,
														accountId: record._id.toString(),
														name: result.accounts![0].profile.name,
														email: result.accounts![0].email.value,
														avatarUrl: result.accounts![0].profile.avatarUrl,
														roleId: result.accounts![0].data.role.toString(),
														disableTwoFactor: false,
													});
												}
											}}
											icon={<FaPencilAlt />}
										/>
									</Tooltip>

									<Tooltip title={t("dashboard:accounts.table.deleteTooltip")}>
										<Button
											variant="outlined"
											danger
											disabled={
												record._id.toString() == account?._id.toString() ||
												account!.data.role.level >= record.role.level
											}
											onClick={() => {
												setDeleteAccountState({
													accountId: record._id.toString(),
												});
											}}
											icon={<FaTrashAlt />}
										/>
									</Tooltip>
								</div>
							),
						},
					]}
					pagination={{
						pageSize: accountsListState.count,
						total: accountsListState.totalAccounts,
						showSizeChanger: true,
						onShowSizeChange: (current, size) => {
							setAccountsListState({
								...accountsListState,
								count: size,
								page: current - 1,
								loading: true,
							});
							fetchAccounts(size, current - 1);
						},
					}}
					rowKey="_id"
					loading={accountsListState.loading}
				/>
			</div>
		</AdminPageLayout>
	);
}
