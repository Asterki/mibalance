import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

import POSPageLayout from "../../../layouts/POSLayout";
import { FaBarcode, FaChevronCircleLeft, FaTrash } from "react-icons/fa";

import { IProduct } from "../../../features/products";
import SalesFeature, { ISale } from "../../../features/sales";
import WarehousesFeature from "../../../features/warehouses";

import {
	Input,
	Image,
	Button,
	Form,
	Table,
	notification,
	Typography,
	DatePicker,
} from "antd";
const { Text, Title } = Typography;

interface SaleItem {
	product: IProduct;
	quantity: number;
	unitPrice: number;
	subtotal: number;
	tax: number;
	discount: number;
	total: number;
}

export const Route = createFileRoute("/pos/sales/refund")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			saleId: typeof search.saleId === "string" ? search.saleId : undefined,
		};
	},
});

function RouteComponent() {
	const navigate = useNavigate();
	const { account } = useSelector((state: RootState) => state.auth);
	const { POSSession } = useSelector((state: RootState) => state.POSSessions);
	const { config } = useSelector((state: RootState) => state.config);

	const { saleId } = Route.useSearch();

	const { t } = useTranslation(["pos", "common"]);
	const [api, contextHolder] = notification.useNotification();

	interface ListWarehouse {
		name: string;
		_id: string;
	}
	const [warehouses, setWarehouses] = useState<ListWarehouse[] | null>(null);
	const fetchWarehouses = async () => {
		const result = await WarehousesFeature.warehouseAPI.list({
			count: 50,
			page: 0,
			fields: ["name", "_id"],
		});

		if (result.status == "success") {
			setWarehouses(
				result.warehouses!.map((warehouse) => {
					return {
						name: warehouse.name,
						_id: warehouse._id.toString(),
					};
				}),
			);
		}
	};

	const [currentSale, setCurrentSale] = useState<ISale | null>(null);

	const [currentRefund, setCurrentRefund] = useState<{
		saleId: string;
		storeId: string;
		POSSessionId: string;
		warehouseId: string;
		items: {
			product: string;
			quantity: number;
			amount: number;
		}[];
		date: string;
		reason: string;
		notes: string;
	}>({
		saleId: "",
		storeId: "",
		POSSessionId: "",
		warehouseId: "",

		items: [],
		date: new Date().toISOString(),

		reason: "",
		notes: "",
	});
	const refundSchema = z.object({
		saleId: z.string().min(1, { message: "saleId-required" }),
		storeId: z.string().min(1, { message: "storeId-required" }),
		POSSessionId: z.string().min(1, { message: "posSessionId-required" }),
		warehouseId: z.string().min(1, { message: "warehouseId-required" }),

		items: z
			.array(
				z.object({
					product: z.string().min(1, { message: "item-product-required" }),
					quantity: z
						.number()
						.int({ message: "item-quantity-integer" })
						.nonnegative({ message: "item-quantity-nonnegative" }),
					amount: z
						.number()
						.nonnegative({ message: "item-amount-nonnegative" }),
				}),
			)
			.min(1, { message: "items-min" }),

		date: z.string().refine((isoDate) => {
			const date = new Date(isoDate);
			return !isNaN(date.getTime());
		}),

		reason: z.string().min(1, { message: "reason-required" }),
		notes: z.string(),
	});

	const handleRefundSubmit = async () => {
		const validation = refundSchema.safeParse(currentRefund);

		if (!validation.success) {
			validation.error.errors.forEach((err) => {
				api.error({
					message: t(`pos:sales.refund.messages.${err.message}`),
				});
			});
			return;
		}

		const result = await SalesFeature.salesAPI.refund({
			saleId: currentRefund.saleId,
			storeId: currentRefund.storeId,
			POSSessionId: currentRefund.POSSessionId,
			warehouseId: currentRefund.warehouseId,
			items: currentRefund.items.map((item) => ({
				productId: item.product,
				quantity: item.quantity,
				amount: item.amount,
			})),
			date: currentRefund.date,
			reason: currentRefund.reason,
			notes: currentRefund.notes,
		});
		if (result.status == "success") {
			api.success({
				message: t("pos:sales.refund.success"),
			});
			navigate({
				to: "/dashboard/sales",
			});
		} else {
			api.error({
				message: t("pos:sales.refund.error"),
			});
		}
	};

	const fetchSale = async () => {
		if (!saleId) {
			return navigate({
				to: "/dashboard/sales",
			});
		}

		if (!POSSession || !account) return;

		const result = await SalesFeature.salesAPI.get({
			saleIds: [saleId],
			relations: ["items"],
		});
		if (result.status == "success") {
			if (result.sales!.length == 0) {
				return navigate({
					to: "/dashboard/sales",
				});
			}

			const sale = result.sales![0]!;
			setCurrentSale(sale);

			setCurrentRefund((prev) => ({
				...prev,
				saleId: sale._id.toString(),
				storeId: sale.store.toString(),
				POSSessionId: POSSession!._id.toString(),
				warehouseId: sale.warehouse.toString(),
				items: sale.items.map((item) => ({
					product: (item.product as IProduct)._id.toString(),
					quantity: item.quantity,
					amount: item.total,
				})),
			}));
		} else {
			setCurrentSale(result.sales![0]);
			api.error({
				message: t("dashboard:purchases.errors.fetch"),
			});
		}
	};

	useEffect(() => {
		fetchWarehouses();
		fetchSale();
	}, [POSSession, account, saleId]);

	return (
		<POSPageLayout>
			{contextHolder}
			{currentSale && (
				<>
					<div className="mb-2">
						{t("dashboard:common.loggedInAs", {
							name: account?.profile.name,
							email: account?.email.value,
						})}
					</div>

					<Title className="flex items-center gap-2">
						<FaChevronCircleLeft />
						{t("pos:sales.refund.page.title")}
					</Title>

					<Text>
						{t("pos:sales.refund.page.description", {
							sale: currentSale.receiptNumber || currentSale._id,
						})}
					</Text>

					<Table
						dataSource={(currentSale.items as SaleItem[]).map(
							(item, idx: number) => ({
								...item,
								key: (item.product as IProduct)._id.toString(),
								index: idx + 1,
							}),
						)}
						pagination={false}
						columns={[
							{
								title: "#",
								dataIndex: "index",
							},
							{
								title: t("pos:sales.refund.table.product"),
								dataIndex: "product",
								render: (product: IProduct | string) =>
									typeof product === "string" ? (
										product
									) : (
										<div className="flex items-center gap-2">
											<Image
												src={`${import.meta.env.VITE_SERVER_URL}${product.imageUrls[0]}`}
												fallback="/item.png"
												width={50}
												style={{ maxHeight: 200, objectFit: "cover" }}
											/>

											<div className="flex flex-col">
												<Text>{product.name}</Text>
												<Text type="secondary">{product.sku}</Text>
												{product.barcode && (
													<Text
														className="gap-2 items-center flex"
														type="secondary"
													>
														<FaBarcode /> {product.barcode}
													</Text>
												)}
											</div>
										</div>
									),
							},
							{
								title: t("pos:sales.refund.table.originalQuantity"),
								dataIndex: "quantity",
								render: (text: string, item: SaleItem) => {
									return `${text} ${item.product.unit}`;
								},
							},
							{
								title: t("pos:sales.refund.table.quantityToRefund"),
								render: (_, item: SaleItem) => (
									<Input
										type="number"
										min={0}
										addonAfter={item.product.unit}
										max={item.quantity}
										onChange={(e) => {
											setCurrentRefund((prev) => {
												const newItems = [...prev.items];
												const itemIndex = newItems.findIndex(
													(i) => i.product === item.product._id.toString(),
												);
												if (itemIndex !== -1) {
													newItems[itemIndex].quantity = parseFloat(
														e.target.value,
													);
												}
												return { ...prev, items: newItems };
											});
										}}
									/>
								),
							},
							{
								title: t("pos:sales.refund.table.amount"),
								render: (_, item: SaleItem) => (
									<Input
										addonBefore={config?.currencySymbol}
										type="number"
										min={0}
										max={item.total}
										onChange={(e) => {
											setCurrentRefund((prev) => {
												const newItems = [...prev.items];
												const itemIndex = newItems.findIndex(
													(i) => i.product === item.product._id.toString(),
												);
												if (itemIndex !== -1) {
													newItems[itemIndex].amount = parseFloat(
														e.target.value,
													);
												}
												return { ...prev, items: newItems };
											});
										}}
									/>
								),
							},
						]}
					/>
					<p>
						{t("pos:sales.refund.table.notice", {
							warehouseName: warehouses?.find(
								(warehouse) =>
									warehouse._id === currentSale.warehouse.toString(),
							)?.name,
						})}
					</p>

					<div className="flex flex-col gap-2 mt-16">
						<Title level={2}>{t("pos:sales.refund.details.title")}</Title>

						<Form layout="vertical">
							<Form.Item
								className="w-full"
								label={t("pos:sales.refund.details.date")}
								name="date"
							>
								<DatePicker
									className="w-full"
									placeholder={t("pos:sales.refund.details.datePlaceholder")}
									onChange={(e) => {
										setCurrentRefund((prev) => ({
											...prev,
											reason: e.toString(),
										}));
									}}
								/>
							</Form.Item>

							<Form.Item
								label={t("pos:sales.refund.details.reason")}
								name="reason"
							>
								<Input.TextArea
									rows={3}
									placeholder={t("pos:sales.refund.details.reasonPlaceholder")}
									onChange={(e) => {
										setCurrentRefund((prev) => ({
											...prev,
											reason: e.target.value,
										}));
									}}
								/>
							</Form.Item>

							<Form.Item
								label={t("pos:sales.refund.details.notes")}
								name="notes"
							>
								<Input.TextArea
									rows={2}
									placeholder={t("pos:sales.refund.details.notesPlaceholder")}
									onChange={(e) => {
										setCurrentRefund((prev) => ({
											...prev,
											notes: e.target.value,
										}));
									}}
								/>
							</Form.Item>

							<Form.Item>
								<Button
									type="primary"
									size="large"
									block
									icon={<FaTrash />}
									onClick={handleRefundSubmit}
								>
									{t("pos:sales.refund.submit")}
								</Button>
							</Form.Item>
						</Form>
					</div>
				</>
			)}
		</POSPageLayout>
	);
}
