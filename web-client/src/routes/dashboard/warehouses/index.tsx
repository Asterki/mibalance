import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { useTranslation } from "react-i18next";

import { IWarehouse } from "../../../../../server/src/models/Warehouse";

import WarehouseFeature from "../../../features/warehouses";

import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

import {
	Button,
	Input,
	Modal,
	Drawer,
	Select,
	Tooltip,
	Table,
	Tag,
	App,
	Typography,
} from "antd";
const { Text, Title } = Typography;

import AdminPageLayout from "../../../layouts/AdminLayout";

import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { BsPinMap } from "react-icons/bs";

export const Route = createFileRoute("/dashboard/warehouses/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { account } = useSelector((state: RootState) => state.auth);

	const { message } = App.useApp();
	const navigate = useNavigate();
	const { t } = useTranslation(["main", "dashboard"]);

	interface ListWarehouse {
		_id: string;
		name: string;
		description: string;
		address: string;
		tags: string[];
	}
	const [warehousesListState, setWarehousesListState] = useState<{
		loading: boolean;
		warehouses: ListWarehouse[];
		totalWarehouses: number;
		page: number;
		count: number;
	}>({
		loading: true,
		warehouses: [],
		totalWarehouses: 0,
		page: 0,
		count: 10,
	});

	const fetchWarehouses = async (count: number, page: number) => {
		const result = await WarehouseFeature.warehouseAPI.list({
			count,
			page,
			fields: ["name", "description", "address", "tags"],
		});

		if (result.status == "success") {
			setWarehousesListState({
				warehouses: result.warehouses!.map((warehouse: IWarehouse) => ({
					_id: warehouse._id.toString(),
					name: warehouse.name,
					description: warehouse.description,
					address: warehouse.address ?? "",
					tags: warehouse.tags,
				})),
				totalWarehouses: result.totalWarehouses!,
				loading: false,
				page,
				count,
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
			setWarehousesListState({
				...warehousesListState,
				loading: false,
			});
		}
	};

	const [createWarehouseState, setCreateWarehouseState] = useState<{
		isOpen: boolean;
		name: string;
		description: string;
		address: string;
		tags: string[];
	}>({
		isOpen: false,
		name: "",
		description: "",
		address: "",
		tags: [],
	});
	const createWarehouseSchema = z.object({
		name: z
			.string()
			.trim()
			.min(1, { message: "invalid-name-length" })
			.max(100, { message: "invalid-name-length" }),

		description: z
			.string()
			.trim()
			.min(1, { message: "invalid-description-length" })
			.max(500, { message: "invalid-description-length" }),

		address: z
			.string()
			.trim()
			.max(300, { message: "invalid-address-length" })
			.optional(),

		tags: z
			.array(
				z
					.string()
					.trim()
					.min(1, { message: "invalid-tag" })
					.max(50, { message: "invalid-tag" }),
			)
			.max(10, { message: "too-many-tags" }),
	});
	const createWarehouse = async () => {
		const parsedData = createWarehouseSchema.safeParse({
			name: createWarehouseState.name,
			description: createWarehouseState.description,
			address: createWarehouseState.address,
			tags: createWarehouseState.tags,
		});
		if (!parsedData.success) {
			parsedData.error.errors.forEach((error) => {
				message.warning(
					t(`dashboard:warehouses.modals.create.messages.${error.message}`),
				);
			});
			return;
		}

		const result = await WarehouseFeature.warehouseAPI.create(parsedData.data);

		if (result.status == "success") {
			message.success(t("dashboard:warehouses.modals.create.messages.success"));
			fetchWarehouses(warehousesListState.count, 0);

			setCreateWarehouseState({
				isOpen: false,
				name: "",
				description: "",
				address: "",
				tags: [],
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	const [deleteWarehouseState, setDeleteWarehouseState] = useState<{
		warehouseId?: string;
	}>({
		warehouseId: undefined,
	});
	const deleteWarehouse = async () => {
		if (!deleteWarehouseState.warehouseId) return;
		const result = await WarehouseFeature.warehouseAPI.delete({
			warehouseId: deleteWarehouseState.warehouseId!,
		});

		if (result.status == "success") {
			message.success(t("dashboard:warehouses.modals.delete.messages.success"));
			fetchWarehouses(warehousesListState.count, 0);
			setDeleteWarehouseState({
				warehouseId: "",
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}

		setDeleteWarehouseState({
			warehouseId: "",
		});
	};

	const [updateWarehouseState, setUpdateWarehouseState] = useState<{
		selectedWarehouse?: string;
		name: string;
		description: string;
		address: string;
		tags: string[];
	}>({
		selectedWarehouse: undefined,
		name: "",
		description: "",
		address: "",
		tags: [],
	});
	const updateWarehouseSchema = z.object({
		name: z
			.string()
			.min(1, { message: "invalid-name-length" })
			.max(100, { message: "invalid-name-length" }),
		description: z
			.string()
			.min(1, { message: "invalid-description-length" })
			.max(500, { message: "invalid-description-length" }),
		address: z
			.string()
			.max(300, { message: "invalid-address-length" })
			.transform((val) => (val.trim() === "" ? undefined : val))
			.optional(),
		tags: z
			.array(
				z
					.string()
					.min(1, { message: "invalid-tag" })
					.max(50, { message: "invalid-tag" }),
			)
			.max(10, { message: "too-many-tags" }),
	});
	const updateWarehouse = async () => {
		if (!updateWarehouseState.selectedWarehouse) return;
		const parsedData = updateWarehouseSchema.safeParse({
			name: updateWarehouseState.name,
			description: updateWarehouseState.description,
			address: updateWarehouseState.address,
			tags: updateWarehouseState.tags,
		});
		if (!parsedData.success) {
			parsedData.error.errors.forEach((error) => {
				message.warning(
					t(`dashboard:warehouses.modals.update.messages.${error.message}`),
				);
			});
			return;
		}

		const result = await WarehouseFeature.warehouseAPI.update({
			warehouseId: updateWarehouseState.selectedWarehouse,
			...parsedData.data,
		});

		if (result.status == "success") {
			message.success(t("dashboard:warehouses.modals.update.messages.success"));
			fetchWarehouses(warehousesListState.count, 0);

			setUpdateWarehouseState({
				selectedWarehouse: undefined,
				name: "",
				description: "",
				address: "",
				tags: [],
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	const [searchState, setSearchState] = useState<{
		query: string;
		loading: boolean;
	}>({
		query: "",
		loading: false,
	});
	const searchWarehouses = async () => {
		setSearchState({
			...searchState,
			loading: true,
		});

		const result = await WarehouseFeature.warehouseAPI.list({
			count: 10,
			page: 0,
			query: searchState.query,
			fields: ["name", "description", "address", "tags"],
		});

		if (result.status == "success" && result.warehouses) {
			setWarehousesListState({
				...warehousesListState,
				warehouses: result.warehouses!.map((warehouse: IWarehouse) => ({
					_id: warehouse._id.toString(),
					name: warehouse.name,
					description: warehouse.description,
					address: warehouse.address ?? "",
					tags: warehouse.tags,
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

	useEffect(() => {
		fetchWarehouses(10, 0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AdminPageLayout selectedPage="warehouses">
			{/* Create Warehouse Drawer */}
			<Modal
				title={t("dashboard:warehouses.modals.create.title")}
				closable={true}
				onClose={() => {
					setCreateWarehouseState({
						...createWarehouseState,
						isOpen: false,
					});
				}}
				onCancel={() => {
					setCreateWarehouseState({
						...createWarehouseState,
						isOpen: false,
					});
				}}
				width={600}
				open={createWarehouseState.isOpen}
				okText={t("dashboard:common.create")}
				onOk={() => {
					createWarehouse();
				}}
			>
				<p className="mb-2">
					{t("dashboard:warehouses.modals.create.modalDescription")}
				</p>

				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<label
							htmlFor="create-warehouse-name"
							className="text-sm font-medium"
						>
							{t("dashboard:warehouses.modals.create.name")}
						</label>
						<Input
							id="create-warehouse-name"
							type="text"
							variant="outlined"
							value={createWarehouseState.name}
							onChange={(e) =>
								setCreateWarehouseState({
									...createWarehouseState,
									name: e.target.value,
								})
							}
							placeholder={t(
								"dashboard:warehouses.modals.create.namePlaceholder",
							)}
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label
							htmlFor="create-warehouse-description"
							className="text-sm font-medium"
						>
							{t("dashboard:warehouses.modals.create.description")}
						</label>
						<Input
							id="create-warehouse-description"
							type="text"
							variant="outlined"
							value={createWarehouseState.description}
							onChange={(e) =>
								setCreateWarehouseState({
									...createWarehouseState,
									description: e.target.value,
								})
							}
							placeholder={t(
								"dashboard:warehouses.modals.create.descriptionPlaceholder",
							)}
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label
							htmlFor="create-warehouse-address"
							className="text-sm font-medium"
						>
							{t("dashboard:warehouses.modals.create.address")}{" "}
							<span className="text-xs">
								({t("dashboard:common.optional")})
							</span>
						</label>
						<Input
							id="create-warehouse-address"
							type="text"
							variant="outlined"
							value={createWarehouseState.address}
							onChange={(e) =>
								setCreateWarehouseState({
									...createWarehouseState,
									address: e.target.value,
								})
							}
							placeholder={t(
								"dashboard:warehouses.modals.create.addressPlaceholder",
							)}
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label
							htmlFor="create-warehouse-tags"
							className="text-sm font-medium"
						>
							{t("dashboard:warehouses.modals.create.tags")}{" "}
							<span className="text-xs">
								({t("dashboard:common.optional")})
							</span>
						</label>
						<Select
							id="create-warehouse-tags"
							mode="tags"
							variant="outlined"
							value={createWarehouseState.tags}
							onChange={(tags) =>
								setCreateWarehouseState({ ...createWarehouseState, tags })
							}
							placeholder={t(
								"dashboard:warehouses.modals.create.tagsPlaceholder",
							)}
						/>
					</div>
				</div>
			</Modal>

			{/* Delete Warehouse Modal */}
			<Modal
				title={t("dashboard:warehouses.modals.delete.title")}
				open={!!deleteWarehouseState.warehouseId}
				onOk={deleteWarehouse}
				okText={t("dashboard:common.delete")}
				okButtonProps={{
					danger: true,
					color: "red",
				}}
				onCancel={() => {
					setDeleteWarehouseState({
						warehouseId: "",
					});
				}}
				cancelText={t("dashboard:common.cancel")}
			>
				<p>{t("dashboard:warehouses.modals.delete.description")}</p>
			</Modal>

			{/* Edit Warehouse Drawer */}
			<Drawer
				title={t("dashboard:warehouses.modals.update.title")}
				placement="right"
				closable={true}
				onClose={() => {
					setUpdateWarehouseState({
						...updateWarehouseState,
						selectedWarehouse: undefined,
					});
				}}
				width={1200}
				open={!!updateWarehouseState.selectedWarehouse}
				extra={
					<Button variant="solid" type="primary" onClick={updateWarehouse}>
						{t("dashboard:common.save")}
					</Button>
				}
			>
				<Text>{t("dashboard:warehouses.modals.update.modalDescription")}</Text>

				<div className="flex flex-col gap-4 mt-6">
					<div className="flex flex-col gap-1">
						<label
							htmlFor="update-warehouse-name"
							className="text-sm font-medium"
						>
							{t("dashboard:warehouses.modals.update.name")}
						</label>
						<Input
							id="create-warehouse-name"
							type="text"
							variant="outlined"
							value={updateWarehouseState.name}
							onChange={(e) =>
								setUpdateWarehouseState({
									...updateWarehouseState,
									name: e.target.value,
								})
							}
							placeholder={t(
								"dashboard:warehouses.modals.update.namePlaceholder",
							)}
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label
							htmlFor="update-warehouse-description"
							className="text-sm font-medium"
						>
							{t("dashboard:warehouses.modals.update.description")}
						</label>
						<Input
							id="create-warehouse-description"
							type="text"
							variant="outlined"
							value={updateWarehouseState.description}
							onChange={(e) =>
								setUpdateWarehouseState({
									...updateWarehouseState,
									description: e.target.value,
								})
							}
							placeholder={t(
								"dashboard:warehouses.modals.update.descriptionPlaceholder",
							)}
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label
							htmlFor="update-warehouse-address"
							className="text-sm font-medium"
						>
							{t("dashboard:warehouses.modals.update.address")}{" "}
							<span className="text-xs">
								({t("dashboard:common.optional")})
							</span>
						</label>

						<Input
							id="update-warehouse-address"
							type="text"
							variant="outlined"
							value={updateWarehouseState.address}
							onChange={(e) => {
								setUpdateWarehouseState({
									...updateWarehouseState,
									address: e.target.value,
								});
							}}
							placeholder={t(
								"dashboard:warehouses.modals.update.addressPlaceholder",
							)}
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label
							htmlFor="update-warehouse-tags"
							className="text-sm font-medium"
						>
							{t("dashboard:warehouses.modals.create.tags")}{" "}
							<span className="text-xs">
								({t("dashboard:common.optional")})
							</span>
						</label>
						<Select
							id="update-warehouse-tags"
							mode="tags"
							variant="outlined"
							value={updateWarehouseState.tags}
							onChange={(tags) =>
								setUpdateWarehouseState({ ...updateWarehouseState, tags })
							}
							placeholder={t(
								"dashboard:warehouses.modals.update.tagsPlaceholder",
							)}
						/>
					</div>
				</div>
			</Drawer>

			<div className="mb-2">
				{t("dashboard:common.loggedInAs", {
					name: account?.profile.name,
					email: account?.email.value,
				})}
			</div>

			<Title className="flex items-center gap-2">
				<BsPinMap />
				{t("dashboard:warehouses.page.title")}
			</Title>

			<Text>{t("dashboard:warehouses.page.description")}</Text>

			<div className="my-2 flex items-center gap-2">
				<Button
					variant="solid"
					type="primary"
					onClick={() => {
						setCreateWarehouseState({
							...createWarehouseState,
							isOpen: true,
						});
					}}
					disabled={
						!account ||
						!(
							account?.data.role.permissions.includes("*") ||
							account?.data.role.permissions.includes("warehouses:create")
						)
					}
				>
					{t("dashboard:warehouses.page.createWarehouse")}
				</Button>

				<Button
					variant="outlined"
					onClick={() => {
						navigate({
							to: "/dashboard/warehouses/stock",
						});
					}}
				>
					{t("dashboard:warehouses.page.manageStock")}
				</Button>
			</div>

			{/* Search */}
			<section>
				<Input.Search
					type="text"
					variant="outlined"
					onChange={(e) => {
						setSearchState({
							...searchState,
							query: e.target.value,
						});
					}}
					allowClear
					onClear={async () => {
						await fetchWarehouses(warehousesListState.count, 0);
					}}
					loading={searchState.loading}
					onSearch={() => {
						searchWarehouses();
					}}
					enterButton={t("dashboard:common.search")}
					placeholder={t("dashboard:warehouses.page.searchPlaceholder")}
				/>
			</section>

			{/* Warehouses List */}
			<Table
				className="mt-4 overflow-x-scroll"
				dataSource={warehousesListState.warehouses}
				loading={warehousesListState.loading}
				pagination={{
					pageSize: warehousesListState.count,
					total: warehousesListState.totalWarehouses,
					onChange: (page, pageSize) => {
						fetchWarehouses(pageSize, page);
					},
				}}
				rowKey="_id"
				columns={[
					{
						title: t("dashboard:warehouses.table.name"),
						dataIndex: "name",
						key: "name",
					},
					{
						title: t("dashboard:warehouses.table.description"),
						dataIndex: "description",
						key: "description",
					},
					{
						title: t("dashboard:warehouses.table.address"),
						dataIndex: "address",
						key: "address",
						render: (address: string) => {
							if (address.length === 0) return "-";
							return <Tooltip title={address}>{address}</Tooltip>;
						},
					},
					{
						title: t("dashboard:warehouses.table.tags"),
						dataIndex: "tags",
						key: "tags",
						render: (tags: string[]) => {
							if (tags.length === 0) return "-";
							return tags.map((tag, index) => <Tag key={index}>{tag}</Tag>);
						},
					},
					{
						title: t("dashboard:common.actions"),
						key: "actions",
						render: (_text, record) => (
							<div className="flex items-center gap-2">
								<Tooltip
									placement="top"
									title={t("dashboard:warehouses.table.editTooltip")}
								>
									<Button
										variant="outlined"
										onClick={() => {
											setUpdateWarehouseState({
												selectedWarehouse: record._id.toString(),
												name: record.name,
												description: record.description,
												address: record.address ?? "",
												tags: record.tags,
											});
										}}
										disabled={
											!account ||
											!(
												account?.data.role.permissions.includes("*") ||
												account?.data.role.permissions.includes(
													"warehouses:update",
												)
											)
										}
									>
										<FaPencilAlt />
									</Button>
								</Tooltip>

								<Tooltip
									placement="top"
									title={t("dashboard:warehouses.table.deleteTooltip")}
								>
									<Button
										color="red"
										danger
										onClick={() => {
											setDeleteWarehouseState({
												warehouseId: record._id.toString(),
											});
										}}
										disabled={
											!account ||
											!(
												account?.data.role.permissions.includes("*") ||
												account?.data.role.permissions.includes(
													"warehouses:delete",
												)
											)
										}
									>
										<FaTrash />
									</Button>
								</Tooltip>
							</div>
						),
					},
				]}
			/>
		</AdminPageLayout>
	);
}
