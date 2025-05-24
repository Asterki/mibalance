import { z } from "zod";
import mongoose from "mongoose";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import type { RootState } from "../../store";

import {
	App,
	Button,
	Table,
	Drawer,
	Select,
	Input,
	Collapse,
	Typography,
	Tag,
	Upload,
	Tooltip,
	DatePicker,
	Image,
	Descriptions,
	Card,
	Modal,
} from "antd";

const { Text, Title } = Typography;

import AdminPageLayout from "../../layouts/AdminLayout";
import {
	FaEye,
	FaHandHoldingUsd,
	FaPencilAlt,
	FaPhotoVideo,
	FaPlus,
	FaTrash,
} from "react-icons/fa";

import PurchaseFeature, { IPurchase } from "../../features/purchases";
import SupplierFeature from "../../features/suppliers";
import StoreFeature from "../../features/stores";
import WarehouseFeature from "../../features/warehouses";
import ProductsFeature from "../../features/products";
import AccountsFeature from "../../features/accounts";

export const Route = createFileRoute("/dashboard/purchases")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { account } = useSelector((state: RootState) => state.auth);
	const { config } = useSelector((state: RootState) => state.config);

	const { t } = useTranslation(["main"]);
	const { message } = App.useApp();

	const [productListSearchState, setProductListSearchState] = useState<{
		loading: boolean;
		productsOptions: {
			value: string;
			label: string;
		}[];
		timeout: NodeJS.Timeout | null;
	}>({
		loading: false,
		productsOptions: [],
		timeout: null,
	});
	const searchProduct = async (query: string) => {
		setProductListSearchState((prev) => ({
			...prev,
			loading: true,
			products: [],
			query,
		}));

		if (productListSearchState.timeout) {
			clearTimeout(productListSearchState.timeout);
		}

		const timeout = setTimeout(async () => {
			const result = await ProductsFeature.productsAPI.search({
				query,
			});

			if (result.status == "success") {
				setProductListSearchState({
					...productListSearchState,
					loading: false,
					productsOptions: result.products!.map((product) => ({
						value: product._id.toString(),
						label: `${product.name} (${product.barcode})`,
					})),
				});
			} else {
				message.error(t(`error-messages:${result.status}`));
			}
		}, 500);

		setProductListSearchState((prev) => ({
			...prev,
			timeout,
		}));
	};

	const [newPurchase, setNewPurchase] = useState<{
		modalOpen: boolean;
		supplier: {
			name: string;
			id: string;
		};
		warehouse: {
			name: string;
			id: string;
		};
		store: {
			name: string;
			id: string;
		};

		orderDate: Date;
		expectedDeliveryDate: Date;
		actualDeliveryDate?: Date; // This will only be set if status is "received"

		products: {
			productId: string;
			productName: string;
			quantity: number;
			unitCost: number;
			totalCost: number;
		}[];

		attachments: {
			url: string;
			name: string;
		}[];

		payment: {
			method:
				| "cash"
				| "credit_card"
				| "debit_card"
				| "online"
				| "gift_card"
				| "split_payment";
			subtotal: number; // Subtotal before taxes and discounts
			shippingCost?: number; // Shipping cost if applicable
			taxes?: number; // Taxes applied to the purchase
			discount?: number; // Discount applied to the purchase
			totalPaid: number; // Total amount paid
		};

		// Status
		status: "pending" | "shipped" | "received";
		metadata?: Record<string, unknown>;

		// This is not to be send to the server
		paymentStatus: "paid" | "unpaid" | "partially-paid";
	}>({
		modalOpen: false,
		supplier: {
			name: "",
			id: "",
		},
		warehouse: {
			name: "",
			id: "",
		},
		store: {
			name: "",
			id: "",
		},
		orderDate: new Date(),
		expectedDeliveryDate: new Date(),
		actualDeliveryDate: undefined, // This will only be set if status is "received"

		products: [],

		attachments: [],

		payment: {
			method: "cash",
			subtotal: 0, // Subtotal before taxes and discounts
			shippingCost: 0, // Shipping cost if applicable
			taxes: 0, // Taxes applied to the purchase
			discount: 0, // Discount applied to the purchase
			totalPaid: 0, // Total amount paid
		},

		status: "pending",
		metadata: {},

		// This is not to be send to the server
		paymentStatus: "unpaid",
	});

	const [purchases, setPurchases] = useState<{
		loading: boolean;
		purchases: IPurchase[];
		totalPurchasesCount: number;
	}>({
		loading: true,
		purchases: [],
		totalPurchasesCount: 0,
	});
	const fetchPurchases = async () => {
		const result = await PurchaseFeature.purchasesAPI.list({
			count: 50,
			page: 0,
		});

		if (result.status == "success") {
			setPurchases({
				loading: false,
				purchases: result.purchases!,
				totalPurchasesCount: result.totalPurchasesCount!,
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	interface ListSuppliers {
		_id: string;
		name: string;
	}
	const [suppliers, setSuppliers] = useState<ListSuppliers[] | null>(null);
	const fetchSuppliers = async () => {
		const result = await SupplierFeature.suppliersAPI.list({
			count: 50,
			page: 0,
			fields: ["_id", "name"],
		});

		if (result.status == "success") {
			setSuppliers(
				result.suppliers!.map((supplier) => ({
					_id: supplier._id.toString(),
					name: supplier.name,
				})),
			);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	interface ListStores {
		_id: string;
		name: string;
	}
	const [stores, setStores] = useState<ListStores[] | null>(null);
	const fetchStores = async () => {
		const result = await StoreFeature.storesAPI.list({
			count: 50,
			page: 0,
			fields: ["_id", "name"],
		});

		if (result.status == "success") {
			setStores(
				result.stores!.map((store) => {
					return {
						_id: store._id.toString(),
						name: store.name,
					};
				}),
			);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	interface ListWarehouse {
		_id: string;
		name: string;
	}
	const [warehouses, setWarehouses] = useState<ListWarehouse[] | null>(null);
	const fetchWarehouses = async () => {
		const result = await WarehouseFeature.warehouseAPI.list({
			count: 50,
			page: 0,
			fields: ["_id", "name"],
		});

		if (result.status == "success") {
			setWarehouses(
				result.warehouses!.map((warehouse) => {
					return {
						_id: warehouse._id.toString(),
						name: warehouse.name,
					};
				}),
			);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	interface ListEmployee {
		_id: string;
		name: string;
	}
	const [employees, setEmployees] = useState<ListEmployee[] | null>(null);
	const fetchEmployees = async () => {
		const result = await AccountsFeature.accountsAPI.list({
			count: 50,
			page: 0,
			fields: ["_id", "profile"],
		});

		if (result.status == "success") {
			setEmployees(
				result.accounts!.map((acc) => {
					return {
						name: acc.profile.name,
						_id: acc._id.toString(),
					};
				}),
			);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	const [selectedPurchase, setSelectedPurchase] = useState<IPurchase | null>(
		null,
	);

	const [deletePurchaseId, setDeletePurchaseId] = useState<string | null>(null);
	const deletePurchase = async () => {
		if (!deletePurchaseId) return;

		const result = await PurchaseFeature.purchasesAPI.delete({
			purchaseId: deletePurchaseId,
		});

		if (result.status == "success") {
			message.success(t("dashboard:purchases.modals.delete.messages.success"));
			setDeletePurchaseId(null);
			fetchPurchases();
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	useEffect(() => {
		fetchSuppliers();
		fetchStores();
		fetchEmployees();
		fetchWarehouses();
		fetchPurchases();
	}, []);

	return (
		<AdminPageLayout selectedPage="purchases">
			<Drawer
				title={t("dashboard:purchases.modals.selected.title")}
				placement="right"
				closable={false}
				onClose={() => setSelectedPurchase(null)}
				open={selectedPurchase !== null}
				width={1600}
			>
				{selectedPurchase && (
					<div className="grid gap-4">
						<Card
							title={t("dashboard:purchases.modals.selected.generalInfo.title")}
						>
							<Descriptions column={1} size="small">
								<Descriptions.Item
									label={t(
										"dashboard:purchases.modals.selected.generalInfo.orderDate",
									)}
								>
									{new Date(selectedPurchase.orderDate).toLocaleString()}
								</Descriptions.Item>
								<Descriptions.Item
									label={t(
										"dashboard:purchases.modals.selected.generalInfo.expectedDelivery",
									)}
								>
									{selectedPurchase.expectedDeliveryDate
										? new Date(
												selectedPurchase.expectedDeliveryDate,
											).toLocaleString()
										: "N/A"}
								</Descriptions.Item>
								<Descriptions.Item
									label={t(
										"dashboard:purchases.modals.selected.generalInfo.actualDelivery",
									)}
								>
									{selectedPurchase.actualDeliveryDate
										? new Date(
												selectedPurchase.actualDeliveryDate,
											).toLocaleString()
										: "N/A"}
								</Descriptions.Item>
								<Descriptions.Item
									label={t(
										"dashboard:purchases.modals.selected.generalInfo.store",
									)}
								>
									{(stores ?? []).find(
										(store) => store._id == selectedPurchase.store.toString(),
									)?.name || "N/A"}
								</Descriptions.Item>
								<Descriptions.Item
									label={t(
										"dashboard:purchases.modals.selected.generalInfo.processedBy",
									)}
								>
									{(employees ?? []).find(
										(employee) =>
											employee._id == selectedPurchase.processedBy.toString(),
									)?.name || "N/A"}
								</Descriptions.Item>
							</Descriptions>
						</Card>

						<Card
							title={t(
								"dashboard:purchases.modals.selected.supplierInfo.title",
							)}
						>
							<Descriptions column={1} size="small">
								<Descriptions.Item
									label={t(
										"dashboard:purchases.modals.selected.supplierInfo.name",
									)}
								>
									{(suppliers ?? []).find(
										(s) => s._id == selectedPurchase.supplier.toString(),
									)?.name || "N/A"}
								</Descriptions.Item>
							</Descriptions>
						</Card>

						<Card
							title={t("dashboard:purchases.modals.selected.payment.title")}
						>
							<Descriptions column={1} size="small">
								<Descriptions.Item
									label={t(
										"dashboard:purchases.modals.selected.payment.method",
									)}
								>
									{selectedPurchase.payment.method.replace(/_/g, " ")}
								</Descriptions.Item>
								<Descriptions.Item
									label={t(
										"dashboard:purchases.modals.selected.payment.subtotal",
									)}
								>
									{config?.currency}{" "}
									{selectedPurchase.payment.subtotal.toFixed(2)}
								</Descriptions.Item>
								<Descriptions.Item
									label={t(
										"dashboard:purchases.modals.selected.payment.shippingCost",
									)}
								>
									{config?.currency}{" "}
									{(selectedPurchase.payment.shippingCost ?? 0).toFixed(2)}
								</Descriptions.Item>
								<Descriptions.Item
									label={t("dashboard:purchases.modals.selected.payment.taxes")}
								>
									{config?.currency}{" "}
									{(selectedPurchase.payment.taxes ?? 0).toFixed(2)}
								</Descriptions.Item>
								<Descriptions.Item
									label={t(
										"dashboard:purchases.modals.selected.payment.discount",
									)}
								>
									{config?.currency}{" "}
									{(selectedPurchase.payment.discount ?? 0).toFixed(2)}
								</Descriptions.Item>
								<Descriptions.Item
									label={t(
										"dashboard:purchases.modals.selected.payment.totalAmount",
									)}
								>
									{config?.currency}{" "}
									{selectedPurchase.payment.totalAmount.toFixed(2)}
								</Descriptions.Item>
								<Descriptions.Item
									label={t(
										"dashboard:purchases.modals.selected.payment.totalPaid",
									)}
								>
									{config?.currency}{" "}
									{selectedPurchase.payment.totalPaid.toFixed(2)}
								</Descriptions.Item>
								<Descriptions.Item
									label={t(
										"dashboard:purchases.modals.selected.payment.status",
									)}
								>
									<Tag
										color={
											selectedPurchase.payment.status === "paid"
												? "green"
												: selectedPurchase.payment.status === "unpaid"
													? "red"
													: "orange"
										}
									>
										{t(
											`dashboard:purchases.modals.selected.payment.statuses.${selectedPurchase.payment.status}`,
										)}
									</Tag>
								</Descriptions.Item>
							</Descriptions>
						</Card>

						<Card
							title={t("dashboard:purchases.modals.selected.products.title")}
						>
							<Table
								dataSource={selectedPurchase.products.map((item, index) => ({
									...item,
									key: index,
									product: item.product,
								}))}
								size="small"
								pagination={false}
							>
								<Table.Column
									title={t(
										"dashboard:purchases.modals.selected.products.product",
									)}
									dataIndex="product"
								/>
								<Table.Column
									title={t(
										"dashboard:purchases.modals.selected.products.quantity",
									)}
									dataIndex="quantity"
								/>
								<Table.Column
									title={t(
										"dashboard:purchases.modals.selected.products.unitCost",
									)}
									dataIndex="unitCost"
									render={(v) => `${config?.currency} ${v.toFixed(2)}`}
								/>
								<Table.Column
									title={t(
										"dashboard:purchases.modals.selected.products.totalCost",
									)}
									dataIndex="totalCost"
									render={(v) => `${config?.currency} ${v.toFixed(2)}`}
								/>
							</Table>
						</Card>

						{(selectedPurchase.attachments ?? [])?.length > 0 && (
							<Card
								title={t(
									"dashboard:purchases.modals.selected.attachments.title",
								)}
							>
								<ul className="list-disc list-inside">
									{selectedPurchase.attachments!.map((attachment, index) => (
										<div>
											<Image
												key={index}
												src={`${import.meta.env.VITE_SERVER_URL}${attachment.url}`}
												alt={attachment.name}
												width="100%"
												style={{ maxHeight: 200, objectFit: "cover" }}
												preview={{ mask: <span>{attachment.name}</span> }}
											/>
										</div>
									))}
								</ul>
							</Card>
						)}

						<Card title={t("dashboard:purchases.modals.selected.status.title")}>
							<Descriptions column={1} size="small">
								<Descriptions.Item
									label={t("dashboard:purchases.modals.selected.status.status")}
								>
									<Tag
										color={
											selectedPurchase.status === "received"
												? "green"
												: selectedPurchase.status === "pending"
													? "orange"
													: selectedPurchase.status === "canceled"
														? "red"
														: "blue"
										}
									>
										{t(
											`dashboard:purchases.modals.selected.status.${selectedPurchase.status}`,
										)}
									</Tag>
								</Descriptions.Item>
								{selectedPurchase.statusReason && (
									<Descriptions.Item
										label={t(
											"dashboard:purchases.modals.selected.status.status",
										)}
									>
										{selectedPurchase.statusReason}
									</Descriptions.Item>
								)}
							</Descriptions>
						</Card>
					</div>
				)}
			</Drawer>

			<Modal
				title={t("dashboard:purchases.modals.delete.title")}
				open={deletePurchaseId !== null}
				onOk={deletePurchase}
				onCancel={() => setDeletePurchaseId(null)}
				okButtonProps={{
					variant: "solid",
					color: "red",
				}}
				okText={t("dashboard:common.delete")}
				cancelText={t("dashboard:common.cancel")}
			>
				<p>{t("dashboard:purchases.modals.delete.description")}</p>
			</Modal>

			<Drawer
				open={newPurchase.modalOpen}
				onClose={() => {
					setNewPurchase({
						modalOpen: false,
						supplier: {
							name: "",
							id: "",
						},
						warehouse: {
							name: "",
							id: "",
						},
						store: {
							name: "",
							id: "",
						},
						orderDate: new Date(),
						expectedDeliveryDate: new Date(),
						actualDeliveryDate: undefined,
						products: [],
						attachments: [],
						payment: {
							method: "cash",
							subtotal: 0,
							shippingCost: 0,
							taxes: 0,
							discount: 0,
							totalPaid: 0,
						},
						status: "pending",
						metadata: {},
						paymentStatus: "unpaid",
					});
				}}
				title={t("dashboard:purchases.modals.create.title")}
				extra={
					<Button
						type="primary"
						variant="solid"
						icon={<FaPlus />}
						onClick={async () => {
							const createSchema = z.object({
								supplierId: z.string().refine(mongoose.Types.ObjectId.isValid, {
									message: "invalid-supplier-id",
								}),
								warehouseId: z
									.string()
									.refine(mongoose.Types.ObjectId.isValid, {
										message: "invalid-warehouse-id",
									}),
								storeId: z.string().refine(mongoose.Types.ObjectId.isValid, {
									message: "invalid-store-id",
								}),

								orderDate: z.string().refine(
									(date) => {
										const parsedDate = new Date(date);
										return !isNaN(parsedDate.getTime());
									},
									{
										message: "invalid-order-date",
									},
								),

								expectedDeliveryDate: z
									.string()
									.transform((date) => new Date(date))
									.optional(),

								actualDeliveryDate: z
									.string()
									.transform((date) => new Date(date))
									.optional(),

								products: z
									.array(
										z.object({
											productId: z
												.string()
												.refine(mongoose.Types.ObjectId.isValid, {
													message: "invalid-product-id",
												}),
											quantity: z.number().min(1, {
												message: "quantity-must-be-at-least-one",
											}),
											unitCost: z.number().min(0, {
												message: "unit-cost-cannot-be-negative",
											}),
										}),
									)
									.min(1, {
										message: "no-items",
									}),

								attachments: z
									.array(
										z.object({
											name: z.string({
												required_error: "attachment-name-required",
											}),
											url: z.string({
												required_error: "attachment-url-required",
											}),
										}),
									)
									.optional(),

								payment: z.object({
									method: z.enum(
										[
											"cash",
											"credit_card",
											"debit_card",
											"online",
											"gift_card",
											"split_payment",
										],
										{
											errorMap: () => ({ message: "invalid-payment-method" }),
										},
									),
									subtotal: z.number().min(0, {
										message: "subtotal-cannot-be-negative",
									}),
									shippingCost: z
										.number()
										.min(0, {
											message: "shipping-cost-cannot-be-negative",
										})
										.optional(),
									taxes: z
										.number()
										.min(0, {
											message: "taxes-cannot-be-negative",
										})
										.optional(),
									discount: z
										.number()
										.min(0, {
											message: "discount-cannot-be-negative",
										})
										.optional(),
									totalPaid: z.number({
										required_error: "total-paid-required",
									}),
								}),

								status: z
									.enum(["pending", "shipped", "received"], {
										errorMap: () => ({ message: "invalid-status" }),
									})
									.optional(),

								metadata: z.record(z.unknown()).optional(),
							});

							const parsedData = createSchema.safeParse({
								supplierId: newPurchase.supplier.id,
								warehouseId: newPurchase.warehouse.id,
								storeId: newPurchase.store.id,
								orderDate: newPurchase.orderDate.toISOString(),
								expectedDeliveryDate:
									newPurchase.expectedDeliveryDate.toISOString(),
								actualDeliveryDate:
									newPurchase.actualDeliveryDate?.toISOString(),
								products: newPurchase.products.map((product) => ({
									productId: product.productId,
									quantity: product.quantity,
									unitCost: product.unitCost,
								})),
								attachments: newPurchase.attachments.map((attachment) => ({
									name: attachment.name,
									url: attachment.url,
								})),
								payment: {
									method: newPurchase.payment.method,
									subtotal: newPurchase.products.reduce(
										(acc, product) => acc + product.totalCost,
										0,
									),
									shippingCost: newPurchase.payment.shippingCost,
									taxes: newPurchase.payment.taxes,
									discount: newPurchase.payment.discount,
									totalPaid: newPurchase.payment.totalPaid,
								},
								status: newPurchase.status,
								metadata: newPurchase.metadata,
							});

							if (!parsedData.success) {
								for (const error of parsedData.error.errors) {
									message.warning(
										t(
											`dashboard:purchases.modals.create.messages.${error.message}`,
										),
									);
									return;
								}
							}

							const result = await PurchaseFeature.purchasesAPI.create({
								supplierId: newPurchase.supplier.id,
								warehouseId: newPurchase.warehouse.id,
								storeId: newPurchase.store.id,
								orderDate: newPurchase.orderDate.toISOString(),
								expectedDeliveryDate:
									newPurchase.expectedDeliveryDate.toISOString(),
								actualDeliveryDate:
									newPurchase.actualDeliveryDate?.toISOString(),
								products: newPurchase.products.map((product) => ({
									productId: product.productId,
									quantity: product.quantity,
									unitCost: product.unitCost,
								})),
								attachments: newPurchase.attachments.map((attachment) => ({
									name: attachment.name,
									url: attachment.url,
								})),
								payment: {
									method: newPurchase.payment.method,
									subtotal: newPurchase.products.reduce(
										(acc, product) => acc + product.totalCost,
										0,
									),
									shippingCost: newPurchase.payment.shippingCost,
									taxes: newPurchase.payment.taxes,
									discount: newPurchase.payment.discount,
									totalPaid: newPurchase.payment.totalPaid,
								},
								status: newPurchase.status,
								metadata: newPurchase.metadata,
							});

							if (result.status == "success") {
								message.success(
									t("dashboard:purchases.modals.create.messages.success"),
								);

								setNewPurchase({
									modalOpen: false,
									supplier: {
										name: "",
										id: "",
									},
									warehouse: {
										name: "",
										id: "",
									},
									store: {
										name: "",
										id: "",
									},
									orderDate: new Date(),
									expectedDeliveryDate: new Date(),
									actualDeliveryDate: undefined,
									products: [],
									attachments: [],
									payment: {
										method: "cash",
										subtotal: 0,
										shippingCost: 0,
										taxes: 0,
										discount: 0,
										totalPaid: 0,
									},
									status: "pending",
									metadata: {},
									paymentStatus: "unpaid",
								});

								fetchPurchases();
							} else {
								message.error(t(`error-messages:${result.status}`));
							}
						}}
					>
						{t("dashboard:common.create")}
					</Button>
				}
				width={1200}
			>
				<Text>{t("dashboard:purchases.modals.create.description")}</Text>

				{/* We do this so that all the fields are reset once the modal is closed, and we don't have to manually reset them */}
				{newPurchase.modalOpen && (
					<Collapse
						defaultActiveKey={["1"]}
						className="mt-4 w-full"
						items={[
							{
								key: 1,
								label: t("dashboard:purchases.modals.create.general.title"),
								children: (
									<div className="w-full">
										<div className="w-full">
											<Text>
												{t("dashboard:purchases.modals.create.general.status")}
											</Text>
											<Select
												placeholder={t(
													"dashboard:purchases.modals.create.general.selectStatus",
												)}
												className="w-full"
												onChange={(value) => {
													setNewPurchase({
														...newPurchase,
														status: value,
														actualDeliveryDate:
															value == "received" ? new Date() : undefined,
													});
												}}
												options={[
													{
														label: t(
															"dashboard:purchases.modals.create.general.received",
														),
														value: "received",
													},
													{
														label: t(
															"dashboard:purchases.modals.create.general.pending",
														),
														value: "pending",
													},
													{
														label: t(
															"dashboard:purchases.modals.create.general.shipped",
														),
														value: "shipped",
													},
												]}
											/>
										</div>

										<div className="mt-2">
											<Text>
												{t(
													"dashboard:purchases.modals.create.general.supplier",
												)}
											</Text>
											<Select
												placeholder={t(
													"dashboard:purchases.modals.create.general.selectSupplier",
												)}
												value={newPurchase.supplier.id}
												className="w-full"
												onChange={(value) => {
													setNewPurchase({
														...newPurchase,
														supplier: {
															...newPurchase.supplier,
															id: value,
														},
													});
												}}
												options={
													suppliers
														? suppliers.map((supplier) => ({
																label: supplier.name,
																value: supplier._id,
															}))
														: []
												}
											/>
										</div>

										<div className="mt-2">
											<Text>
												{t(
													"dashboard:purchases.modals.create.general.warehouse",
												)}
											</Text>
											<Select
												placeholder={t(
													"dashboard:purchases.modals.create.general.selectWarehouse",
												)}
												className="w-full"
												onChange={(value) => {
													setNewPurchase({
														...newPurchase,
														warehouse: {
															...newPurchase.warehouse,
															id: value,
														},
													});
												}}
												options={
													warehouses
														? warehouses.map((warehouse) => ({
																label: warehouse.name,
																value: warehouse._id,
															}))
														: []
												}
											/>
										</div>

										<div className="mt-2">
											<Text>
												{t("dashboard:purchases.modals.create.general.store")}
											</Text>
											<Select
												placeholder={t(
													"dashboard:purchases.modals.create.general.selectStore",
												)}
												value={newPurchase.store.id}
												className="w-full"
												onChange={(value) => {
													setNewPurchase({
														...newPurchase,
														store: {
															...newPurchase.store,
															id: value,
														},
													});
												}}
												options={
													stores
														? stores.map((store) => ({
																label: store.name,
																value: store._id,
															}))
														: []
												}
											/>
										</div>
									</div>
								),
							},
							{
								key: 2,
								label: t("dashboard:purchases.modals.create.dates.title"),
								children: (
									<div>
										<div>
											<Text>
												{t("dashboard:purchases.modals.create.dates.orderDate")}
											</Text>
											<DatePicker
												className="w-full"
												onChange={(e) => {
													setNewPurchase({
														...newPurchase,
														orderDate: e.toDate(),
													});
												}}
											/>
										</div>

										<div className="mt-2">
											<Text>
												{t(
													"dashboard:purchases.modals.create.dates.expectedDeliveryDate",
												)}
											</Text>
											<DatePicker
												className="w-full"
												onChange={(e) => {
													setNewPurchase({
														...newPurchase,
														expectedDeliveryDate: e.toDate(),
													});
												}}
											/>
										</div>

										{newPurchase.status == "received" && (
											<div className="mt-2">
												<Text>
													{t(
														"dashboard:purchases.modals.create.dates.actualDeliveryDate",
													)}
												</Text>
												<DatePicker
													className="w-full"
													onChange={(e) => {
														setNewPurchase({
															...newPurchase,
															actualDeliveryDate: e.toDate(),
														});
													}}
												/>
											</div>
										)}
									</div>
								),
							},
							{
								key: 3,
								label: t("dashboard:purchases.modals.create.products.title"),
								children: (
									<div>
										<div>
											<Text>
												{t(
													"dashboard:purchases.modals.create.products.product",
												)}
											</Text>

											<Select
												showSearch
												optionFilterProp="label"
												filterOption={true}
												onChange={async (value) => {
													if (!value) return;
													const productResult =
														await ProductsFeature.productsAPI.get({
															productIds: [value],
														});

													if (productResult.status == "success") {
														const product = productResult.products![0];

														setProductListSearchState((prev) => ({
															...prev,
															loading: false,
															productsOptions: [],
														}));

														setNewPurchase({
															...newPurchase,
															products: [
																...newPurchase.products,
																{
																	productId: product._id.toString(),
																	productName: product.name,
																	quantity: 1,
																	unitCost: 0,
																	totalCost: 0,
																},
															],
														});
													}
												}}
												onSearch={async (e) => {
													if (e.length > 2) {
														searchProduct(e);
													}
												}}
												loading={productListSearchState.loading}
												allowClear
												className="w-full"
												options={productListSearchState.productsOptions}
												placeholder={t(
													"pos:sales:new.productList.searchProductPlaceholder",
												)}
											/>
										</div>

										<div className="mt-4">
											<Text>
												{t(
													"dashboard:purchases.modals.create.products.quantity",
												)}
											</Text>

											<Table
												className="max-w-full w-full overflow-x-scroll"
												columns={[
													{
														title: t(
															"dashboard:purchases.modals.create.products.table.product",
														),
														dataIndex: "productName",
														key: "productName",
													},
													{
														title: t(
															"dashboard:purchases.modals.create.products.table.quantity",
														),
														dataIndex: "quantity",
														key: "quantity",
														render: (_, record) => (
															<Input
																type="number"
																className="w-full"
																value={record.quantity}
																onChange={(e) => {
																	const newProducts = newPurchase.products.map(
																		(product) => {
																			if (
																				product.productId === record.productId
																			) {
																				return {
																					...product,
																					quantity: parseInt(e.target.value),
																					totalCost:
																						parseInt(e.target.value) *
																						record.unitCost,
																				};
																			}
																			return product;
																		},
																	);
																	setNewPurchase({
																		...newPurchase,
																		products: newProducts,
																		payment: {
																			...newPurchase.payment,
																			subtotal: newProducts.reduce(
																				(acc, product) =>
																					acc + product.totalCost,
																				0,
																			),
																		},
																	});
																}}
															/>
														),
													},
													{
														title: t(
															"dashboard:purchases.modals.create.products.table.unitCost",
														),
														dataIndex: "unitCost",
														key: "unitCost",
														render: (_, record) => (
															<Input
																type="number"
																className="w-full"
																addonBefore={config?.currencySymbol}
																value={record.unitCost}
																onChange={(e) => {
																	const newProducts = newPurchase.products.map(
																		(product) => {
																			if (
																				product.productId === record.productId
																			) {
																				return {
																					...product,
																					unitCost: parseFloat(e.target.value),
																					totalCost:
																						parseFloat(e.target.value) *
																						record.quantity,
																				};
																			}
																			return product;
																		},
																	);
																	setNewPurchase({
																		...newPurchase,
																		products: newProducts,
																		payment: {
																			...newPurchase.payment,
																			subtotal: newProducts.reduce(
																				(acc, product) =>
																					acc + product.totalCost,
																				0,
																			),
																		},
																	});
																}}
															/>
														),
													},
													{
														title: t(
															"dashboard:purchases.modals.create.products.table.totalCost",
														),
														dataIndex: "totalCost",
														key: "totalCost",
														render: (text) => (
															<span>
																{config?.currencySymbol} {text.toFixed(2)}
															</span>
														),
													},
													{
														title: t(
															"dashboard:purchases.modals.create.products.table.actions",
														),
														key: "actions",
														render: (_, record) => (
															<Tooltip
																title={t(
																	"dashboard:purchases.modals.create.products.table.deleteTooltip",
																)}
															>
																<Button
																	type="primary"
																	danger
																	icon={<FaTrash />}
																	onClick={() => {
																		setNewPurchase({
																			...newPurchase,
																			products: newPurchase.products.filter(
																				(product) =>
																					product.productId !==
																					record.productId,
																			),
																		});
																	}}
																/>
															</Tooltip>
														),
													},
												]}
												dataSource={newPurchase.products}
												pagination={false}
												loading={productListSearchState.loading}
											/>
										</div>
									</div>
								),
							},
							{
								key: 4,
								label: t("dashboard:purchases.modals.create.attachments.title"),
								children: (
									<div>
										<Text className="">
											{t(
												"dashboard:purchases.modals.create.attachments.description",
											)}
										</Text>

										<br />

										<Upload
											listType="picture"
											accept="image/*"
											multiple
											maxCount={5}
											withCredentials={true}
											data={{
												folder: "purchases-attachments",
												tags: ["product-image"],
											}}
											action={`${import.meta.env.VITE_SERVER_URL}/api/admin/files/upload`}
											onChange={(info) => {
												if (info.file.status == "done") {
													message.success(
														t(
															"dashboard:purchases.modals.create.messages.attachment-upload-success",
														),
													);

													setNewPurchase({
														...newPurchase,
														attachments: [
															...newPurchase.attachments,
															{
																url: info.file.response.fileUrl,
																name: info.file.name,
															},
														],
													});
												}
											}}
										>
											<Button icon={<FaPhotoVideo />}>
												{t(
													"dashboard:purchases.modals.create.attachments.upload",
												)}
											</Button>
										</Upload>
									</div>
								),
							},
							{
								key: 5,
								label: t("dashboard:purchases.modals.create.payment.title"),
								children: (
									<div>
										<div>
											<Text className="">
												{t("dashboard:purchases.modals.create.payment.method")}
											</Text>
											<Select
												placeholder={t(
													"dashboard:purchases.modals.create.payment.selectMethod",
												)}
												value={newPurchase.payment.method}
												className="w-full"
												onChange={(value) => {
													setNewPurchase({
														...newPurchase,
														payment: {
															...newPurchase.payment,
															method: value,
														},
													});
												}}
												options={[
													{
														label: t(
															"dashboard:purchases.modals.create.payment.cash",
														),
														value: "cash",
													},
													{
														label: t(
															"dashboard:purchases.modals.create.payment.credit_card",
														),
														value: "credit_card",
													},
													{
														label: t(
															"dashboard:purchases.modals.create.payment.debit_card",
														),
														value: "debit_card",
													},
													{
														label: t(
															"dashboard:purchases.modals.create.payment.online",
														),
														value: "online",
													},
													{
														label: t(
															"dashboard:purchases.modals.create.payment.gift_card",
														),
														value: "gift_card",
													},
													{
														label: t(
															"dashboard:purchases.modals.create.payment.split_payment",
														),
														value: "split_payment",
													},
												]}
											/>
										</div>

										<div className="mt-4">
											<Text className="">
												{t(
													"dashboard:purchases.modals.create.payment.subtotal",
												)}
											</Text>
											<Input
												type="number"
												className="w-full"
												addonBefore={config?.currencySymbol}
												readOnly
												value={newPurchase.products.reduce(
													(acc, product) => acc + product.totalCost,
													0,
												)}
												placeholder={t(
													"dashboard:purchases.modals.create.payment.subtotal",
												)}
											/>
										</div>

										<div className="mt-4">
											<Text className="">
												{t(
													"dashboard:purchases.modals.create.payment.shippingCost",
												)}
											</Text>
											<Input
												type="number"
												addonBefore={config?.currencySymbol}
												className="w-full"
												placeholder={t(
													"dashboard:purchases.modals.create.payment.shippingCost",
												)}
												onChange={(e) => {
													setNewPurchase({
														...newPurchase,
														payment: {
															...newPurchase.payment,
															shippingCost: parseFloat(e.target.value),
														},
													});
												}}
												defaultValue={0}
											/>
										</div>

										<div className="mt-4">
											<Text className="">
												{t("dashboard:purchases.modals.create.payment.taxes")}
											</Text>
											<Input
												type="number"
												addonBefore={config?.currencySymbol}
												className="w-full"
												placeholder={t(
													"dashboard:purchases.modals.create.payment.taxes",
												)}
												onChange={(e) => {
													setNewPurchase({
														...newPurchase,
														payment: {
															...newPurchase.payment,
															taxes: parseFloat(e.target.value),
														},
													});
												}}
												defaultValue={0}
											/>
										</div>

										<div className="mt-4">
											<Text className="">
												{t(
													"dashboard:purchases.modals.create.payment.discount",
												)}
											</Text>
											<Input
												type="number"
												addonBefore={config?.currencySymbol}
												className="w-full"
												placeholder={t(
													"dashboard:purchases.modals.create.payment.discount",
												)}
												onChange={(e) => {
													setNewPurchase({
														...newPurchase,
														payment: {
															...newPurchase.payment,
															discount: parseFloat(e.target.value),
														},
													});
												}}
												defaultValue={0}
											/>
										</div>

										<div className="mt-4">
											<Text className="">
												{t(
													"dashboard:purchases.modals.create.payment.paymentStatus",
												)}
											</Text>

											<Select
												placeholder={t(
													"dashboard:purchases.modals.create.payment.selectPaymentStatus",
												)}
												value={newPurchase.paymentStatus}
												className="w-full"
												onChange={(value) => {
													let totalPaid = newPurchase.payment.totalPaid;
													if (value == "unpaid") {
														totalPaid = 0;
													} else if (value == "paid") {
														totalPaid =
															newPurchase.payment.subtotal +
															(newPurchase.payment.shippingCost ?? 0) +
															(newPurchase.payment.taxes ?? 0) -
															(newPurchase.payment.discount ?? 0);
													} else if (value == "partially-paid") {
														totalPaid = newPurchase.payment.totalPaid;
													}

													setNewPurchase({
														...newPurchase,
														paymentStatus: value,
														payment: {
															...newPurchase.payment,
															totalPaid,
														},
													});
												}}
												options={[
													{
														label: t(
															"dashboard:purchases.modals.create.payment.paid",
														),
														value: "paid",
													},
													{
														label: t(
															"dashboard:purchases.modals.create.payment.unpaid",
														),
														value: "unpaid",
													},
													{
														label: t(
															"dashboard:purchases.modals.create.payment.partially-paid",
														),
														value: "partially-paid",
													},
												]}
											/>

											{/* This is not to be send to the server and it's only purpose is to make it easier for the user to manage */}
											{newPurchase.paymentStatus == "partially-paid" && (
												<div className="mt-4">
													<Text className="">
														{t(
															"dashboard:purchases.modals.create.payment.partialPayment",
														)}
													</Text>

													<Input
														type="number"
														className="w-full"
														placeholder={t(
															"dashboard:purchases.modals.create.payment.partialPayment",
														)}
														onChange={(e) => {
															setNewPurchase({
																...newPurchase,
																payment: {
																	...newPurchase.payment,
																	totalPaid: parseFloat(e.target.value),
																},
															});
														}}
														defaultValue={0}
													/>
												</div>
											)}
										</div>
									</div>
								),
							},
						]}
					/>
				)}
			</Drawer>

			<div className="mb-2">
				{t("dashboard:common.loggedInAs", {
					name: account?.profile.name,
					email: account?.email.value,
				})}
			</div>

			<Title level={1} className="flex items-center gap-2">
				<FaHandHoldingUsd />
				{t("dashboard:purchases.page.title")}
			</Title>

			<Text>{t("dashboard:purchases.page.description")}</Text>

			<div className="my-2 flex items-center gap-2">
				<Button
					variant="solid"
					type="primary"
					onClick={() => {
						setNewPurchase({ ...newPurchase, modalOpen: true });
					}}
					disabled={
						!account ||
						!(
							account?.data.role.permissions.includes("*") ||
							account?.data.role.permissions.includes("purchases:create")
						)
					}
				>
					{t("dashboard:purchases.page.createPurchase")}
				</Button>
			</div>

			<Table
				className="w-full mt-4 overflow-x-scroll"
				dataSource={purchases.purchases}
				loading={purchases.loading}
				pagination={{
					total: purchases.totalPurchasesCount,
					pageSize: 50,
					showTotal: (total) => t("dashboard:purchases.table.total", { total }),
				}}
				key={"_id"}
				rowKey={(record) => record._id.toString()}
				columns={[
					{
						title: t("dashboard:purchases.table.date"),
						dataIndex: "orderDate",
						key: "orderDate",
						render: (_, record) => new Date(record.createdAt).toLocaleString(),
					},
					{
						title: t("dashboard:purchases.table.supplier"),
						dataIndex: "supplier",
						key: "supplier",
						render: (_, record) => {
							return (suppliers ?? []).find(
								(supplier) =>
									supplier._id.toString() == record.supplier.toString(),
							)?.name;
						},
					},
					{
						title: t("dashboard:purchases.table.warehouse"),
						dataIndex: "warehouse",
						key: "warehouse",
						render: (_, record) => {
							return (warehouses ?? []).find(
								(warehouse) =>
									warehouse._id.toString() == record.warehouse.toString(),
							)?.name;
						},
					},
					{
						title: t("dashboard:purchases.table.store"),
						dataIndex: "store",
						key: "store",
						render: (_, record) => {
							return (stores ?? []).find(
								(store) => store._id.toString() == record.store.toString(),
							)?.name;
						},
					},
					{
						title: t("dashboard:purchases.table.status"),
						dataIndex: "status",
						render: (text) => {
							let textType = "success";
							if (text == "pending") {
								textType = "warning";
							} else if (text == "shipped") {
								textType = "default";
							}
							return (
								 
								<Text type={textType as any} keyboard>
									{t(`dashboard:purchases.table.${text}`)}
								</Text>
							);
						},
					},
					{
						title: t("dashboard:purchases.table.totalAmount"),
						render: (_, record) => {
							const totalAmount =
								(record.payment.taxes || 0) +
								(record.payment.shippingCost || 0) +
								(record.payment.subtotal || 0) -
								(record.payment.discount || 0);
							return (
								<Text>
									{totalAmount.toLocaleString(undefined, {
										style: "currency",
										currency: "HNL",
									})}
								</Text>
							);
						},
					},
					{
						title: t("dashboard:purchases.table.paymentStatus"),
						render: (_, record) => {
							let textType = "success";
							if (record.payment.status == "unpaid") {
								textType = "danger";
							} else if (record.payment.status == "partially_paid") {
								textType = "warning";
							}

							return (
								 
								<Text type={textType as any} keyboard>
									{t(
										`dashboard:purchases.modals.create.payment.${record.payment.status}`,
									)}
								</Text>
							);
						},
					},

					{
						title: t("dashboard:purchases.table.actions"),
						key: "actions",
						render: (_, record) => (
							<div className="flex items-center gap-2">
								<Tooltip title={t("dashboard:purchases.table.viewTooltip")}>
									<Button
										variant="outlined"
										icon={<FaEye />}
										onClick={async () => {
											const result = await PurchaseFeature.purchasesAPI.get({
												purchaseIds: [record._id.toString()],
											});

											if (result.status == "success") {
												setSelectedPurchase(result.purchases![0]!);
											}
										}}
									/>
								</Tooltip>

								<Tooltip title={t("dashboard:purchases.table.editTooltip")}>
									<Button
										variant="outlined"
										icon={<FaPencilAlt />}
										onClick={() => {
											navigate({
												to: `/dashboard/purchases/${record._id}/edit`,
											});
										}}
										disabled={
											!account ||
											!(
												account?.data.role.permissions.includes("*") ||
												account?.data.role.permissions.includes(
													"purchases:update",
												)
											)
										}
									/>
								</Tooltip>

								<Tooltip title={t("dashboard:purchases.table.deleteTooltip")}>
									<Button
										variant="outlined"
										danger
										icon={<FaTrash />}
										onClick={() => {
											setDeletePurchaseId(record._id.toString());
										}}
										disabled={
											!account ||
											!(
												account?.data.role.permissions.includes("*") ||
												account?.data.role.permissions.includes(
													"purchases:delete",
												)
											)
										}
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
