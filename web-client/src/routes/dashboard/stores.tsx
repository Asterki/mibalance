import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { useTranslation } from "react-i18next";

import { FaLandmark, FaPencilAlt, FaTrash } from "react-icons/fa";

import StoreFeature from "../../features/stores";
import AccountsFeature from "../../features/accounts";

import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { IAccount } from "../../../../server/src/models/Account";

import AdminPageLayout from "../../layouts/AdminLayout";
import {
	Button,
	Drawer,
	Input,
	Image,
	Modal,
	Select,
	Table,
	Tooltip,
	Typography,
	App,
} from "antd";
const { Text, Title } = Typography;

export const Route = createFileRoute("/dashboard/stores")({
	component: RouteComponent,
});

function RouteComponent() {
	const { account } = useSelector((state: RootState) => state.auth);

	const { message } = App.useApp();
	const { t } = useTranslation(["dashboard", "common"]);

	interface SearchAccount {
		_id: string;
		name: string;
		imageUrl: string;
	}
	const [accountSearchState, setAccountSearchState] = useState<{
		accounts: SearchAccount[];
		timeout: NodeJS.Timeout | null;
	}>({
		accounts: [],
		timeout: null,
	});
	const searchAccounts = async (query: string) => {
		if (accountSearchState.timeout) {
			clearTimeout(accountSearchState.timeout);
		}
		const timeout = setTimeout(async () => {
			const result = await AccountsFeature.accountsAPI.list({
				filters: {
					name: query,
				},
				fields: ["profile", "data", "_id"],
				count: 10,
				page: 0,
			});

			if (result.status == "success") {
				setAccountSearchState({
					accounts: result.accounts!.map((acc) => {
						return {
							_id: acc._id.toString(),
							name: acc.profile.name,
							imageUrl: `${import.meta.env.VITE_SERVER_URL}/${acc.profile.avatarUrl}`,
						};
					}),
					timeout: null,
				});
			} else {
				message.error(t(`error-messages:${result.status}`));
			}
		}, 500);

		setAccountSearchState({
			accounts: [],
			timeout,
		});
	};

	// Fetch
	interface ListStore {
		_id: string;
		name: string;
		phone: string;
		email: string;
		location: string;
		manager: {
			_id: string;
			name: string;
			avatarUrl: string;
		};
		employees: {
			_id: string;
			name: string;
		}[];
		totalEmployees: number;
	}
	const [storesListState, setStoresListState] = useState<{
		loading: boolean;
		stores: ListStore[];
		totalStoreCount: number;
		page: number;
		count: number;
	}>({
		loading: true,
		stores: [],
		totalStoreCount: 0,
		page: 0,
		count: 10,
	});
	const fetchStores = async (count: number, page: number) => {
		const result = await StoreFeature.storesAPI.list({
			count,
			page,
			fields: ["name", "_id", "location", "manager", "employees"],
			relations: {
				manager: true,
				employees: true,
			},
		});

		if (result.status == "success") {
			setStoresListState({
				loading: false,
				stores: result.stores!.map((store) => {
					return {
						_id: store._id.toString(),
						name: store.name,
						location: store.location,
						phone: store.phone ?? "",
						email: store.email ?? "",
						manager: {
							_id: store.manager._id.toString(),
							name: store.manager.profile.name,
							avatarUrl: `${import.meta.env.VITE_SERVER_URL}/${store.manager.profile.avatarUrl}`,
						},
						employees: store.employees.map((employee) => {
							return {
								_id: employee._id.toString(),
								name: employee.profile.name,
							};
						}),
						totalEmployees: store.employees.length,
					};
				}),
				totalStoreCount: result.totalStores!,
				page,
				count,
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
			setStoresListState({
				...storesListState,
				loading: false,
			});
		}
	};

	// Search
	const [searchStoreState, setSearchStoreState] = useState<{
		query: string;
		loading: boolean;
	}>({
		query: "",
		loading: false,
	});
	const searchStoreClickHandler = async () => {
		setSearchStoreState({
			...searchStoreState,
			loading: true,
		});

		const result = await StoreFeature.storesAPI.list({
			count: 50,
			page: 0,
			filters: {
				name: searchStoreState.query,
			},
			fields: ["name", "location", "manager"],
			relations: {
				manager: true,
				employees: true,
			},
		});

		if (result.status == "success") {
			setStoresListState({
				...storesListState,
				loading: false,
				stores: result.stores!.map((store) => {
					return {
						_id: store._id.toString(),
						name: store.name,
						location: store.location,
						phone: store.phone ?? "",
						email: store.email ?? "",
						manager: {
							_id: store.manager._id.toString(),
							name: store.manager.profile.name,
							avatarUrl: `${import.meta.env.VITE_SERVER_URL}/${store.manager.profile.avatarUrl}`,
						},
						employees: store.employees.map((employee) => {
							return {
								_id: employee._id.toString(),
								name: employee.profile.name,
							};
						}),
						totalEmployees: store.employees.length,
					};
				}),
				totalStoreCount: result.totalStores!,
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
		setSearchStoreState({
			...searchStoreState,
			loading: false,
		});
	};

	// Create Store
	const [createModalState, setCreateModalState] = useState<{
		isOpen: boolean;
		name: string;
		email: string;
		phone: string;
		location: string;
		manager: string;
	}>({
		isOpen: false,
		name: "",
		location: "",
		manager: "",
		phone: "",
		email: "",
	});
	const createStore = async () => {
		const parsedData = z
			.object({
				name: z
					.string()
					.min(3, {
						message: "invalid-name",
					})
					.max(100, {
						message: "invalid-name",
					}),
				location: z
					.string()
					.min(3, {
						message: "invalid-location",
					})
					.max(100, {
						message: "invalid-location",
					}),
				manager: z.string().min(24, {
					message: "invalid-manager",
				}),
				phone: z
					.string()
					.min(7, { message: "invalid-phone" })
					.max(24, { message: "invalid-phone" }),
				email: z.string().email({ message: "invalid-email" }),
			})
			.safeParse(createModalState);

		if (!parsedData.success) {
			for (const issue of parsedData.error.issues) {
				message.warning(
					t(`dashboard:stores.modals.create.messages.${issue.message}`),
				);
			}
			return;
		}

		const result = await StoreFeature.storesAPI.create({
			location: createModalState.location,
			name: createModalState.name,
			manager: createModalState.manager,
			email: createModalState.email,
			phone: createModalState.phone,
		});

		if (result.status == "success" && result.storeId) {
			message.success(t("dashboard:stores.modals.create.messages.success"));
			setCreateModalState({
				isOpen: false,
				name: "",
				location: "",
				manager: "",
				email: "",
				phone: "",
			});

			// Refresh the store list
			await fetchStores(storesListState.count, storesListState.page);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	// Edit Store
	const [updateStoreState, setUpdateStoreState] = useState<{
		storeId: string | null;
		name: string;
		location: string;
		phone: string;
		email: string;
		manager: {
			_id: string;
			name: string;
			imageUrl: string;
		};
		employees: {
			_id: string;
			name: string;
			imageUrl: string;
		}[];
	}>({
		storeId: null,
		name: "",
		location: "",
		phone: "",
		email: "",
		manager: {
			_id: "",
			name: "",
			imageUrl: "",
		},
		employees: [],
	});
	const updateStoreSchema = z.object({
		name: z
			.string()
			.min(3, {
				message: "invalid-name",
			})
			.max(100, {
				message: "invalid-name",
			}),
		location: z
			.string()
			.min(3, {
				message: "invalid-location",
			})
			.max(100, {
				message: "invalid-location",
			}),
		manager: z.string().min(24, {
			message: "invalid-manager",
		}),
		employees: z.array(
			z.string().min(24, {
				message: "invalid-employee",
			}),
		),
		phone: z
			.string()
			.min(7, { message: "invalid-phone" })
			.max(24, { message: "invalid-phone" })
			.nullable(),
		email: z.string().email({ message: "invalid-email" }).nullable(),
	});

	const updateStore = async () => {
		const parsedData = updateStoreSchema.safeParse({
			name: updateStoreState.name,
			location: updateStoreState.location,
			phone:
				updateStoreState.phone.trim() == "" ? null : updateStoreState.phone,
			email:
				updateStoreState.email.trim() == "" ? null : updateStoreState.email,
			manager: updateStoreState.manager!._id,
			employees: updateStoreState.employees?.map((employee) => employee._id),
		});

		if (!parsedData.success) {
			for (const issue of parsedData.error.issues) {
				message.warning(
					t(`dashboard:stores.modals.update.messages.${issue.message}`),
				);
			}

			return;
		}

		const result = await StoreFeature.storesAPI.update({
			storeId: updateStoreState.storeId!,
			location: parsedData.data.location,
			email:
				updateStoreState.email == ""
					? null
					: (updateStoreState.email as string),
			phone:
				updateStoreState.phone == ""
					? null
					: (updateStoreState.phone as string),
			name: parsedData.data.name,
			manager: parsedData.data.manager,
			employees: parsedData.data.employees,
		});

		if (result.status == "success") {
			message.success(t("dashboard:stores.modals.update.messages.success"));
			await fetchStores(storesListState.count, storesListState.page);
			setUpdateStoreState({
				storeId: null,
				name: "",
				location: "",
				phone: "",
				email: "",
				manager: {
					_id: "",
					name: "",
					imageUrl: "",
				},
				employees: [],
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	// Delete Store
	const [deleteStoreModalState, setDeleteStoreModalState] = useState<{
		storeId: string | null;
	}>({
		storeId: null,
	});
	const deleteStore = async (storeId: string) => {
		const result = await StoreFeature.storesAPI.deleteStore({ storeId });
		if (result.status == "success") {
			message.success(t("dashboard:stores.modals.delete.messages.success"));
			setDeleteStoreModalState({
				storeId: null,
			});
			setUpdateStoreState({
				storeId: null,
				name: "",
				location: "",
				phone: "",
				email: "",
				manager: {
					_id: "",
					name: "",
					imageUrl: "",
				},
				employees: [],
			});

			// Fetch the list of stores again
			await fetchStores(storesListState.count, storesListState.page);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	useEffect(() => {
		(async () => {
			await fetchStores(10, 0);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AdminPageLayout selectedPage="stores">
			{/* Edit Store */}
			<Drawer
				onClose={() =>
					setUpdateStoreState({
						storeId: null,
						name: "",
						location: "",
						phone: "",
						email: "",
						manager: {
							name: "",
							_id: "",
							imageUrl: "",
						},
						employees: [],
					})
				}
				open={updateStoreState.storeId !== null}
				title={t("dashboard:stores.modals.update.title")}
				width={1000}
				extra={
					<div className="flex gap-2 items-center mt-4">
						<Button type="primary" variant="solid" onClick={updateStore}>
							{t("dashboard:common.save")}
						</Button>
						<Button
							type="primary"
							color="red"
							variant="solid"
							onClick={() => {
								setDeleteStoreModalState({
									storeId: updateStoreState.storeId,
								});
							}}
						>
							{t("dashboard:common.delete")}
						</Button>
					</div>
				}
			>
				<div>
					<h1 className="text-xl">
						{t("dashboard:stores.modals.update.general.title")}
					</h1>
					<div className="flex gap-2 items-center">
						<div className="flex-1">
							<p>{t("dashboard:stores.modals.update.general.name")}</p>
							<Input
								onChange={(e) => {
									setUpdateStoreState({
										...updateStoreState,
										name: e.target.value,
									});
								}}
								placeholder={t(
									"dashboard:stores.modals.update.general.namePlaceholder",
								)}
								defaultValue={updateStoreState.name!}
							/>
						</div>
						<div className="flex-1">
							<p>{t("dashboard:stores.modals.update.general.location")}</p>
							<Input
								onChange={(e) => {
									setUpdateStoreState({
										...updateStoreState,
										location: e.target.value,
									});
								}}
								placeholder={t(
									"dashboard:stores.modals.update.general.locationPlaceholder",
								)}
								defaultValue={updateStoreState.location!}
							/>
						</div>
						<div className="flex-1">
							<p>{t("dashboard:stores.modals.update.general.manager")}</p>
							{updateStoreState.manager && (
								<Select
									className="w-full"
									showSearch
									value={updateStoreState.manager!._id}
									placeholder={t(
										"dashboard:stores.modals.update.general.managerPlaceholder",
									)}
									defaultActiveFirstOption={false}
									suffixIcon={null}
									filterOption={false}
									onSearch={(query: string) => {
										searchAccounts(query);
									}}
									options={accountSearchState.accounts.map((account) => {
										return {
											value: account._id.toString(),
											label: account.name,
										};
									})}
									onChange={(value) => {
										const account = accountSearchState.accounts.find(
											(account) => account._id.toString() === value.toString(),
										);
										setUpdateStoreState({
											...updateStoreState,
											manager: account!,
										});
									}}
									notFoundContent={null}
								/>
							)}
						</div>
					</div>

					<h1 className="text-xl mt-4">
						{t("dashboard:stores.modals.update.contact.title")}
					</h1>
					<div className="flex items-center justify-center gap-2">
						<div className="flex-1">
							<p>{t("dashboard:stores.modals.update.contact.phone")}</p>
							<Input
								onChange={(e) => {
									setUpdateStoreState({
										...updateStoreState,
										phone: e.target.value,
									});
								}}
								placeholder={t(
									"dashboard:stores.modals.update.contact.phonePlaceholder",
								)}
								defaultValue={updateStoreState.phone!}
							/>
						</div>
						<div className="flex-1">
							<p>{t("dashboard:stores.modals.update.contact.email")}</p>
							<Input
								onChange={(e) => {
									setUpdateStoreState({
										...updateStoreState,
										email: e.target.value,
									});
								}}
								placeholder={t(
									"dashboard:stores.modals.update.contact.emailPlaceholder",
								)}
								defaultValue={updateStoreState.email!}
							/>
						</div>
					</div>

					<h1 className="text-xl mt-8">
						{t("dashboard:stores.modals.update.employees.title")}
					</h1>
					<div>
						<div className="flex items-center justify-center gap-2">
							{updateStoreState.employees && (
								<Select
									className="w-full"
									showSearch
									placeholder={t(
										"dashboard:stores.modals.update.employees.searchEmployee",
									)}
									defaultActiveFirstOption={false}
									suffixIcon={null}
									filterOption={false}
									onSearch={(query: string) => {
										searchAccounts(query);
									}}
									options={accountSearchState.accounts.map((account) => {
										return {
											value: account._id,
											label: account.name,
										};
									})}
									allowClear
									onChange={async (value) => {
										if (!value) return;
										if (
											updateStoreState.employees!.find(
												(employee) => employee._id == value,
											)
										) {
											message.warning(
												t(
													"dashboard:stores.modals.update.employees.alreadyAdded",
												),
											);
											return;
										}

										const account = accountSearchState.accounts.find(
											(account) => account._id == value,
										);
										if (!account) return;
										setUpdateStoreState({
											...updateStoreState,
											employees: [
												...(updateStoreState.employees ?? []),
												{
													_id: account._id,
													name: account.name,
													imageUrl: account.imageUrl,
												},
											],
										});
									}}
								/>
							)}
						</div>

						<p>{t("dashboard:stores.modals.update.employees.notice")}</p>

						{/* Employees List */}
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 w-full">
							{updateStoreState.employees?.map((employee) => (
								<div
									key={employee._id}
									className="flex items-center justify-between border p-2 rounded-md w-full gap-4"
								>
									<div className="flex items-center gap-3">
										<Image
											alt={`${employee.name}'s avatar`}
											fallback="/avatar.png"
											src={employee.imageUrl ?? ""}
											className="w-10 h-10 rounded-full object-cover border"
											width={40}
											height={40}
										/>
										<span className="text-sm font-medium truncate">
											{employee.name}{" "}
											{employee._id == account?._id ? "(You)" : ""}{" "}
											{employee._id == updateStoreState.manager?._id
												? "(Manager)"
												: ""}
										</span>
									</div>
									<Button
										onClick={() =>
											setUpdateStoreState({
												...updateStoreState,
												employees: updateStoreState.employees!.filter(
													(emp) => emp._id !== employee._id,
												),
											})
										}
										danger
										aria-label={`Remove ${employee.name}`}
										icon={<FaTrash />}
									></Button>
								</div>
							))}
						</div>
					</div>
				</div>
			</Drawer>

			<Modal
				onOk={() => {
					createStore();
				}}
				okText={t("dashboard:common.create")}
				cancelText={t("dashboard:common.cancel")}
				onCancel={() => {
					setCreateModalState({
						...createModalState,
						isOpen: false,
					});
				}}
				title={t("stores.modals.create.title")}
				open={createModalState.isOpen}
				onClose={() => {
					setCreateModalState({
						...createModalState,
						isOpen: false,
					});
				}}
			>
				<div className="flex gap-2 items-center flex-col">
					<div className="w-full">
						<label>{t("stores.modals.create.name")}</label>
						<Input
							type="text"
							value={createModalState.name}
							placeholder={t("stores.modals.create.namePlaceholder")}
							onChange={(e) => {
								setCreateModalState({
									...createModalState,
									name: e.target.value,
								});
							}}
						/>
					</div>
					<div className="w-full">
						<label>{t("stores.modals.create.location")}</label>
						<Input
							value={createModalState.location}
							type="text"
							placeholder={t("stores.modals.create.locationPlaceholder")}
							onChange={(e) => {
								setCreateModalState({
									...createModalState,
									location: e.target.value,
								});
							}}
						/>
					</div>
					<div className="w-full">
						<label>{t("stores.modals.create.manager")}</label>
						<Select
							showSearch
							className="w-full"
							value={createModalState.manager}
							placeholder={t("stores.modals.create.managerPlaceholder")}
							defaultActiveFirstOption={false}
							suffixIcon={null}
							filterOption={false}
							onSearch={(query: string) => {
								searchAccounts(query);
							}}
							onChange={(value) => {
								setCreateModalState({
									...createModalState,
									manager: value as string,
								});
							}}
							notFoundContent={null}
							options={accountSearchState.accounts.map((account) => {
								return {
									value: account._id,
									label: account.name,
								};
							})}
						/>
					</div>

					<div className="w-full">
						<label>{t("stores.modals.create.phone")}</label>
						<Input
							value={createModalState.phone}
							type="text"
							placeholder={t("stores.modals.create.phonePlaceholder")}
							onChange={(e) => {
								setCreateModalState({
									...createModalState,
									phone: e.target.value,
								});
							}}
						/>
					</div>

					<div className="w-full">
						<label>{t("stores.modals.create.email")}</label>
						<Input
							value={createModalState.email}
							placeholder={t("stores.modals.create.emailPlaceholder")}
							onChange={(e) => {
								setCreateModalState({
									...createModalState,
									email: e.target.value,
								});
							}}
						/>
					</div>
				</div>
			</Modal>

			<Modal
				title={t("stores.modals.delete.title")}
				open={deleteStoreModalState.storeId !== null}
				onOk={() => {
					deleteStore(deleteStoreModalState.storeId!);
				}}
				okText={t("common.delete")}
				cancelText={t("common.cancel")}
				okButtonProps={{
					color: "red",
					variant: "solid",
				}}
				onCancel={() => {
					setDeleteStoreModalState({
						storeId: null,
					});
				}}
			>
				{t("stores.modals.delete.description")}
			</Modal>

			<div className="mb-2">
				{t("dashboard:common.loggedInAs", {
					name: account?.profile.name,
					email: account?.email.value,
				})}
			</div>

			<Title className="flex items-center gap-2">
				<FaLandmark />
				{t("dashboard:stores.page.title")}
			</Title>

			<Text>{t("dashboard:stores.page.description")}</Text>

			{/* Store Actions */}
			<div className="flex gap-2 items-center my-2">
				<Button
					variant="solid"
					type="primary"
					onClick={() =>
						setCreateModalState({
							isOpen: true,
							manager: "",
							location: "",
							name: "",
              phone: "",
              email: ""
						})
					}
					disabled={
						!account ||
						!(
							account?.data.role.permissions.includes("*") ||
							account?.data.role.permissions.includes("stores:create")
						)
					}
				>
					{t("dashboard:stores.page.createStore")}
				</Button>
			</div>

			<div className="flex gap-2 items-center justify-center">
				<Input.Search
					placeholder={t("dashboard:stores.page.searchPlaceholder")}
					allowClear
					onClear={async () => {
						await fetchStores(10, 0);
					}}
					loading={searchStoreState.loading}
					onSearch={() => {
						searchStoreClickHandler();
					}}
					enterButton={t("dashboard:common.search")}
					onChange={(e) => {
						setSearchStoreState({
							...searchStoreState,
							query: e.target.value,
						});
					}}
				/>
			</div>

			{/* Store List */}
			<Table
				className="mt-4"
				dataSource={storesListState.stores}
				loading={storesListState.loading}
				rowKey="_id"
				pagination={{
					showSizeChanger: true,
					total: storesListState.totalStoreCount,
					pageSize: storesListState.count,
					current: storesListState.page + 1,
					onChange: async (page, pageSize) => {
						await fetchStores(pageSize, page - 1);
					},
				}}
				columns={[
					{
						title: t("dashboard:stores.table.name"),
						dataIndex: "name",
						key: "name",
					},
					{
						title: t("dashboard:stores.table.location"),
						dataIndex: "location",
						key: "location",
					},
					{
						title: t("dashboard:stores.table.manager"),
						dataIndex: "manager",
						render: (_, record) => (
							<div className="flex items-center gap-2">
								<Image
									alt="avatar"
									fallback="/avatar.png"
									src={record.manager.avatarUrl}
									className="w-8 h-8 rounded-full"
									width={32}
									height={32}
								/>

								<div>
									{record.manager.name}{" "}
									{record.manager._id.toString() == account?._id.toString()
										? "(You)"
										: ""}
								</div>
							</div>
						),
					},
					{
						title: t("dashboard:stores.table.actions"),
						key: "actions",
						render: (_text, record) => (
							<div className="flex items-center justify-center gap-2">
								<Tooltip title={t("dashboard:stores.table.editTooltip")}>
									<Button
										variant="outlined"
										onClick={async () => {
											// Get the manager and employees of the store
											const storeEmployeesResult =
												await AccountsFeature.accountsAPI.get({
													accountIds: [
														record.manager._id.toString(),
														...record.employees.map((employee) =>
															employee._id.toString(),
														),
													],
													fields: ["_id", "profile"],
												});

											if (storeEmployeesResult.status !== "success") {
												message.error(
													t(`error-messages:${storeEmployeesResult.status}`),
												);
												return;
											}

											const manager = storeEmployeesResult.accounts!.find(
												(acc) =>
													acc._id.toString() == record.manager._id.toString(),
											) as IAccount;

											const employees = storeEmployeesResult.accounts!.filter(
												(acc) =>
													record.employees
														.map((employee) => employee._id.toString())
														.includes(acc._id.toString()),
											);

											setAccountSearchState({
												accounts: storeEmployeesResult.accounts!.map((acc) => {
													return {
														_id: acc._id.toString(),
														name: acc.profile.name,
														imageUrl: `${import.meta.env.VITE_SERVER_URL}/${acc.profile.avatarUrl}`,
													};
												}),
												timeout: null,
											});

											setUpdateStoreState({
												storeId: record._id.toString(),
												name: record.name,
												location: record.location,
												phone: record.phone ?? "",
												email: record.email ?? "",
												manager: {
													_id: manager._id.toString(),
													name: manager.profile.name,
													imageUrl: `${import.meta.env.VITE_SERVER_URL}/${manager.profile.avatarUrl}`,
												},
												employees: employees.map((employee) => {
													return {
														_id: employee._id.toString(),
														name: employee.profile.name,
														imageUrl: `${import.meta.env.VITE_SERVER_URL}/${employee.profile.avatarUrl}`,
													};
												}),
											});
										}}
										disabled={
											!account ||
											!(
												account?.data.role.permissions.includes("*") ||
												account?.data.role.permissions.includes("stores:update")
											)
										}
										icon={<FaPencilAlt />}
									/>
								</Tooltip>

								<Tooltip title={t("dashboard:stores.table.deleteTooltip")}>
									<Button
										variant="outlined"
										color="red"
										onClick={() => {
											setDeleteStoreModalState({
												storeId: record._id.toString(),
											});
										}}
										disabled={
											!account ||
											!(
												account?.data.role.permissions.includes("*") ||
												account?.data.role.permissions.includes("stores:delete")
											)
										}
										icon={<FaTrash />}
									/>
								</Tooltip>
							</div>
						),
					},
				]}
			/>
		</AdminPageLayout>
	);
}
