import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import type { RootState } from "../../store";

import {
	App,
	Button,
	Input,
	Modal,
	Drawer,
	Tooltip,
	Table,
	Typography,
} from "antd";
const { Text, Title } = Typography;

import AdminPageLayout from "../../layouts/AdminLayout";
import { FaLayerGroup, FaPencilAlt, FaTrash } from "react-icons/fa";

import SuppliersFeature, { ISupplier } from "../../features/suppliers";

export const Route = createFileRoute("/dashboard/suppliers")({
	component: RouteComponent,
});

function RouteComponent() {
	const { account } = useSelector((state: RootState) => state.auth);

	const { message } = App.useApp();
	const { t } = useTranslation(["main", "dashboard"]);

	// #region Categories
	const [suppliersListState, setSuppliersListState] = useState<{
		loading: boolean;
		suppliers: ISupplier[];
		totalSuppliers: number;
		page: number;
		count: number;
	}>({
		loading: true,
		suppliers: [],
		totalSuppliers: 0,
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
	const searchSuppliers = async () => {
		setSearchState({
			...searchState,
			loading: true,
		});

		const result = await SuppliersFeature.suppliersAPI.list({
			count: 50,
			page: 0,
			query: searchState.query,
		});

		if (result.status == "success" && result.suppliers !== undefined) {
			setSuppliersListState({
				...suppliersListState,
				suppliers: result.suppliers,
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}

		setSearchState({
			...searchState,
			loading: false,
		});
	};

	// Fetch categories
	const fetchSuppliers = async (count: number, page: number) => {
		const result = await SuppliersFeature.suppliersAPI.list({
			count,
			page,
		});

		if (result.status == "success") {
			setSuppliersListState({
				count: count,
				page: page,
				suppliers: result.suppliers!,
				totalSuppliers: result.totalSuppliers!,
				loading: false,
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	// Create Supplier
	const [createSupplierState, setCreateSupplierState] = useState<{
		isOpen: boolean;
		name: string;
		description: string;
		address: string;
		email: string;
		phone: string;
		website: string;
	}>({
		isOpen: false,
		name: "",
		description: "",
		address: "",
		email: "",
		phone: "",
		website: "",
	});
	const createSupplierSchema = z.object({
		name: z
			.string()
			.min(1, "invalid-name-length")
			.max(100, "invalid-name-length"),
		description: z
			.string()
			.min(1, "invalid-description-length")
			.max(200, "invalid-description-length")
			.optional(),
		phone: z
			.string()
			.min(7, "invalid-phone-length")
			.max(20, "invalid-phone-length")
			.optional(),
		email: z.string().email("invalid-email-format").optional(),
		website: z.string().url("invalid-website-format").optional(),
		address: z
			.string()
			.min(5, "invalid-address-length")
			.max(200, "invalid-address-length")
			.optional(),
	});

	const createSupplier = async () => {
		const parsedData = createSupplierSchema.safeParse({
			name: createSupplierState.name,
			description:
				createSupplierState.description == ""
					? undefined
					: createSupplierState.description,
			address:
				createSupplierState.address == ""
					? undefined
					: createSupplierState.address,
			email:
				createSupplierState.email == "" ? undefined : createSupplierState.email,
			phone:
				createSupplierState.phone == "" ? undefined : createSupplierState.phone,
			website:
				createSupplierState.website == ""
					? undefined
					: createSupplierState.website,
		});

		if (!parsedData.success) {
			for (const issue of parsedData.error.issues) {
				message.warning(
					t(`dashboard:suppliers.modals.create.messages.${issue.message}`),
				);
			}
			return;
		}

		const result = await SuppliersFeature.suppliersAPI.create(parsedData.data);
		if (result.status == "success") {
			message.success(t("dashboard:suppliers.modals.create.messages.success"));

			setCreateSupplierState({
				isOpen: false,
				name: "",
				description: "",
				address: "",
				email: "",
				phone: "",
				website: "",
			});

			await fetchSuppliers(suppliersListState.count, suppliersListState.page);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	// Delete Supplier
	const [deleteSupplierState, setDeleteSupplierState] = useState<{
		supplierId?: string;
	}>({
		supplierId: undefined,
	});
	const deleteSupplier = async () => {
		if (deleteSupplierState.supplierId == null) return;

		const result = await SuppliersFeature.suppliersAPI.delete({
			supplierId: deleteSupplierState.supplierId,
		});

		if (result.status == "success") {
			message.success(t("dashboard:suppliers.modals.delete.messages.success"));

			setDeleteSupplierState({
				supplierId: undefined,
			});

			await fetchSuppliers(suppliersListState.count, suppliersListState.page);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	// Edit Supplier
	const [editSupplierState, setEditSupplierState] = useState<{
		categoryId?: string;
		name: string;
		description: string;
		address: string;
		email: string;
		phone: string;
		website: string;
	}>({
		categoryId: undefined,
		name: "",
		description: "",
		address: "",
		email: "",
		phone: "",
		website: "",
	});
	const updateSupplierSchema = z.object({
		name: z
			.string()
			.min(1, "invalid-name-length")
			.max(100, "invalid-name-length"),
		description: z
			.string()
			.min(1, "invalid-description-length")
			.max(200, "invalid-description-length")
			.nullable(),
		phone: z
			.string()
			.min(7, "invalid-phone-length")
			.max(20, "invalid-phone-length")
			.nullable(),
		email: z.string().email("invalid-email-format").nullable(),
		website: z.string().url("invalid-website-format").nullable(),
		address: z
			.string()
			.min(5, "invalid-address-length")
			.max(200, "invalid-address-length")
			.nullable(),
	});
	const updateSupplier = async () => {
		const parsedData = updateSupplierSchema.safeParse({
			name: editSupplierState.name,
			description:
				editSupplierState.description.trim() == ""
					? null
					: editSupplierState.description,
			address:
				editSupplierState.address.trim() == ""
					? null
					: editSupplierState.address,
			email:
				editSupplierState.email.trim() == "" ? null : editSupplierState.email,
			phone:
				editSupplierState.phone.trim() == "" ? null : editSupplierState.phone,
			website:
				editSupplierState.website.trim() == ""
					? null
					: editSupplierState.website,
		});

		if (!parsedData.success) {
			for (const issue of parsedData.error.issues) {
				message.warning(
					t(`dashboard:suppliers.modals.update.messages.${issue.message}`),
				);
			}
			return;
		}
		const result = await SuppliersFeature.suppliersAPI.update({
			...parsedData.data,
			supplierId: editSupplierState.categoryId!,
		});

		if (result.status == "success") {
			message.success(t("dashboard:suppliers.modals.update.messages.success"));
			setEditSupplierState({
				...editSupplierState,
				categoryId: undefined,
			});

			await fetchSuppliers(suppliersListState.count, suppliersListState.page);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};
	// #endregion

	useEffect(() => {
		// Fetch products and categories
		(async () => {
			await fetchSuppliers(suppliersListState.count, suppliersListState.page);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AdminPageLayout selectedPage="suppliers">
			{/* Edit Supplier */}
			<Drawer
				onClose={() =>
					setEditSupplierState({ ...editSupplierState, categoryId: undefined })
				}
				open={editSupplierState.categoryId !== undefined}
				title={t("dashboard:suppliers.modals.update.title")}
				width={800}
				extra={
					<Button variant="solid" type="primary" onClick={updateSupplier}>
						{t("dashboard:common.save")}
					</Button>
				}
			>
				<div className="flex flex-col gap-4">
					<section>
						<h2 className="text-xl font-semibold mb-2">
							{t("dashboard:suppliers.modals.update.general")}
						</h2>
						<div className="flex flex-col gap-2">
							<div>
								<p>{t("dashboard:suppliers.modals.update.name")}</p>
								<Input
									type="text"
									value={editSupplierState.name}
									onChange={(e) =>
										setEditSupplierState({
											...editSupplierState,
											name: e.target.value,
										})
									}
									placeholder={t("dashboard:suppliers.modals.update.name")}
								/>
							</div>

							<div>
								<p>{t("dashboard:suppliers.modals.update.descriptionLabel")}</p>
								<Input
									type="text"
									value={editSupplierState.description}
									onChange={(e) =>
										setEditSupplierState({
											...editSupplierState,
											description: e.target.value,
										})
									}
									placeholder={t(
										"dashboard:suppliers.modals.update.description",
									)}
								/>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-xl font-semibold mb-2">
							{t("dashboard:suppliers.modals.update.contact.title")}
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p>{t("dashboard:suppliers.modals.update.contact.address")}</p>
								<Input
									type="text"
									value={editSupplierState.address}
									onChange={(e) =>
										setEditSupplierState({
											...editSupplierState,
											address: e.target.value,
										})
									}
									placeholder={t(
										"dashboard:suppliers.modals.update.contact.address",
									)}
								/>
							</div>

							<div>
								<p>{t("dashboard:suppliers.modals.update.contact.email")}</p>
								<Input
									type="text"
									value={editSupplierState.email}
									onChange={(e) =>
										setEditSupplierState({
											...editSupplierState,
											email: e.target.value,
										})
									}
									placeholder={t(
										"dashboard:suppliers.modals.update.contact.email",
									)}
								/>
							</div>

							<div>
								<p>{t("dashboard:suppliers.modals.update.contact.phone")}</p>
								<Input
									type="text"
									value={editSupplierState.phone}
									onChange={(e) =>
										setEditSupplierState({
											...editSupplierState,
											phone: e.target.value,
										})
									}
									placeholder={t(
										"dashboard:suppliers.modals.update.contact.phone",
									)}
								/>
							</div>

							<div>
								<p>{t("dashboard:suppliers.modals.update.contact.website")}</p>
								<Input
									type="text"
									value={editSupplierState.website}
									onChange={(e) =>
										setEditSupplierState({
											...editSupplierState,
											website: e.target.value,
										})
									}
									placeholder={t(
										"dashboard:suppliers.modals.update.contact.website",
									)}
								/>
							</div>
						</div>
					</section>
				</div>
			</Drawer>

			{/* Create Supplier */}
			<Modal
				title={t("dashboard:suppliers.modals.create.title")}
				open={createSupplierState.isOpen}
				onOk={createSupplier}
				okText={t("dashboard:common.create")}
				cancelText={t("dashboard:common.cancel")}
				onCancel={() =>
					setCreateSupplierState({
						isOpen: false,
						name: "",
						description: "",
						address: "",
						email: "",
						phone: "",
						website: "",
					})
				}
			>
				<Text>{t("dashboard:suppliers.modals.create.modalDescription")}</Text>

				<div className="flex flex-col gap-2 mt-4">
					<div>
						<p>{t("dashboard:suppliers.modals.create.name")}</p>
						<Input
							type="text"
							value={createSupplierState.name}
							onChange={(e) => {
								setCreateSupplierState({
									...createSupplierState,
									name: e.target.value,
								});
							}}
							placeholder={t(
								"dashboard:suppliers.modals.create.namePlaceholder",
							)}
						/>
					</div>

					<div>
						<p>{t("dashboard:suppliers.modals.create.description")}</p>
						<Input
							type="text"
							value={createSupplierState.description}
							onChange={(e) => {
								setCreateSupplierState({
									...createSupplierState,
									description: e.target.value,
								});
							}}
							placeholder={t(
								"dashboard:suppliers.modals.create.descriptionPlaceholder",
							)}
						/>
					</div>

					<div>
						<p>{t("dashboard:suppliers.modals.create.address")}</p>
						<Input
							type="text"
							value={createSupplierState.address}
							onChange={(e) => {
								setCreateSupplierState({
									...createSupplierState,
									address: e.target.value,
								});
							}}
							placeholder={t(
								"dashboard:suppliers.modals.create.addressPlaceholder",
							)}
						/>
					</div>

					<div>
						<p>{t("dashboard:suppliers.modals.create.email")}</p>
						<Input
							type="text"
							value={createSupplierState.email}
							onChange={(e) => {
								setCreateSupplierState({
									...createSupplierState,
									email: e.target.value,
								});
							}}
							placeholder={t(
								"dashboard:suppliers.modals.create.emailPlaceholder",
							)}
						/>
					</div>

					<div>
						<p>{t("dashboard:suppliers.modals.create.phone")}</p>
						<Input
							type="text"
							value={createSupplierState.phone}
							onChange={(e) => {
								setCreateSupplierState({
									...createSupplierState,
									phone: e.target.value,
								});
							}}
							placeholder={t(
								"dashboard:suppliers.modals.create.phonePlaceholder",
							)}
						/>
					</div>

					<div>
						<p>{t("dashboard:suppliers.modals.create.website")}</p>
						<Input
							type="text"
							value={createSupplierState.website}
							onChange={(e) => {
								setCreateSupplierState({
									...createSupplierState,
									website: e.target.value,
								});
							}}
							placeholder={t(
								"dashboard:suppliers.modals.create.websitePlaceholder",
							)}
						/>
					</div>
				</div>
			</Modal>

			{/* Delete Supplier */}
			<Modal
				title={t("dashboard:suppliers.modals.delete.title")}
				open={deleteSupplierState.supplierId != null}
				onOk={deleteSupplier}
				okButtonProps={{ variant: "solid", color: "red" }}
				okText={t("dashboard:common.delete")}
				cancelText={t("dashboard:common.cancel")}
				onCancel={() =>
					setDeleteSupplierState({
						supplierId: undefined,
					})
				}
			>
				<p>{t("dashboard:suppliers.modals.delete.description")}</p>
			</Modal>

			<div className="mb-2">
				{t("dashboard:common.loggedInAs", {
					name: account?.profile.name,
					email: account?.email.value,
				})}
			</div>

			<Title className="flex items-center gap-2">
				<FaLayerGroup />
				{t("dashboard:suppliers.page.title")}
			</Title>

			<Text>{t("dashboard:suppliers.page.description")}</Text>

			<div className="my-2 flex items-center gap-2">
				<Button
					variant="solid"
					type="primary"
					onClick={() => {
						setCreateSupplierState({
							...createSupplierState,
							isOpen: true,
						});
					}}
					disabled={
						!account ||
						!(
							account?.data.role.permissions.includes("*") ||
							account?.data.role.permissions.includes("suppliers:create")
						)
					}
				>
					{t("dashboard:suppliers.page.createSupplier")}
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
					onSearch={searchSuppliers}
					loading={searchState.loading}
					enterButton={t("dashboard:common.search")}
					placeholder={t("dashboard:suppliers.page.searchPlaceholder")}
				/>
			</div>

			{/* Categories List */}
			<Table
				className="mt-4 overflow-x-scroll"
				dataSource={suppliersListState.suppliers ?? []}
				loading={suppliersListState.loading}
				pagination={{
					pageSize: suppliersListState.count,
					total: suppliersListState.totalSuppliers,
					showSizeChanger: true,
					onShowSizeChange: (current, size) => {
						setSuppliersListState({
							...suppliersListState,
							count: size,
							page: current - 1,
							loading: true,
						});
						fetchSuppliers(size, current - 1);
					},
				}}
				rowKey={(record) => record._id.toString()}
				columns={[
					{
						title: t("dashboard:suppliers.table.name"),
						dataIndex: "name",
						key: "name",
					},
					{
						title: t("dashboard:suppliers.table.description"),
						dataIndex: "description",
						key: "description",
						render: (text: string) => {
							if (text === "" || text === null) return "-";
							return text;
						},
					},
					{
						title: t("dashboard:suppliers.table.address"),
						dataIndex: "address",
						key: "address",
						render: (text: string) => {
							if (text === "" || text === null) return "-";
							return text;
						},
					},
					{
						title: t("dashboard:suppliers.table.email"),
						dataIndex: "email",
						key: "email",
						render: (text: string) => {
							if (text === "" || text === null) return "-";
							return text;
						},
					},
					{
						title: t("dashboard:suppliers.table.phone"),
						dataIndex: "phone",
						key: "phone",
						render: (text: string) => {
							if (text === "" || text === null) return "-";
							return text;
						},
					},
					{
						title: t("dashboard:suppliers.table.website"),
						dataIndex: "website",
						key: "website",
						render: (text: string) => {
							if (text === "" || text === null) return "-";
							return text;
						},
					},
					{
						title: t("dashboard:suppliers.table.actions"),
						key: "actions",
						render: (_, record: ISupplier) => (
							<div className="flex items-center gap-2">
								<Tooltip
									placement="top"
									title={t("dashboard:suppliers.table.editTooltip")}
								>
									<Button
										variant="outlined"
										onClick={() => {
											setEditSupplierState({
												categoryId: record._id.toString(),
												//tags: record.tags ?? [],
												description: record.description ?? "",
												name: record.name,
												address: record.address ?? "",
												email: record.email ?? "",
												phone: record.phone ?? "",
												website: record.website ?? "",
											});
										}}
										disabled={
											!account ||
											!(
												account?.data.role.permissions.includes("*") ||
												account?.data.role.permissions.includes(
													"suppliers:update",
												)
											)
										}
									>
										<FaPencilAlt />
									</Button>
								</Tooltip>

								<Tooltip
									placement="top"
									title={t("dashboard:suppliers.table.deleteTooltip")}
								>
									<Button
										variant="outlined"
										danger
										onClick={() => {
											setDeleteSupplierState({
												supplierId: record._id.toString(),
											});
										}}
										disabled={
											!account ||
											!(
												account?.data.role.permissions.includes("*") ||
												account?.data.role.permissions.includes(
													"suppliers:delete",
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
