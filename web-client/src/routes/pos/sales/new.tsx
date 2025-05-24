import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

import POSPageLayout from "../../../layouts/POSLayout";
import {
	FaBarcode,
	FaExclamationTriangle,
	FaPercent,
	FaTrash,
} from "react-icons/fa";

import StoresFeature from "../../../features/stores";
import ProductsFeature from "../../../features/products";
import CategoriesFeature from "../../../features/categories";
import SalesFeature from "../../../features/sales";
import StockFeature from "../../../features/stock";
import WarehousesFeature from "../../../features/warehouses";

import {
	Input,
	Select,
	Image,
	Button,
	Tooltip,
	Table,
	Modal,
	Drawer,
	Typography,
	App,
	InputNumber,
	Switch,
	DatePicker,
} from "antd";
const { Text, Title } = Typography;

export const Route = createFileRoute("/pos/sales/new")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { account } = useSelector((state: RootState) => state.auth);
	const { POSSession } = useSelector((state: RootState) => state.POSSessions);
	const { config } = useSelector((state: RootState) => state.config);

	const { t } = useTranslation(["pos", "common"]);
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
			}
		}, 500);

		setProductListSearchState((prev) => ({
			...prev,
			timeout,
		}));
	};

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
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	interface ListCategory {
		name: string;
		_id: string;
	}
	const [categories, setCategories] = useState<ListCategory[] | null>(null);
	const fetchCategories = async () => {
		const result = await CategoriesFeature.categoriesAPI.list({
			count: 50,
			page: 0,
			fields: ["name", "_id"],
		});

		if (result.status == "success") {
			setCategories(
				result.categories!.map((category) => {
					return {
						name: category.name,
						_id: category._id.toString(),
					};
				}),
			);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	const [selectWarehouse, setSelectWarehouse] = useState<string | null>(null);
	const [paymentModalOpen, setPaymentModalOpen] = useState(false);
	const [discountModalState, setDiscountModalState] = useState<{
		productId: string | null;
		originalUnitPrice: number;
		type: "percentage" | "amount";
		totalDiscount: number;
	}>({
		productId: null,
		originalUnitPrice: 0,
		type: "percentage",
		totalDiscount: 0, // This, regardless of the type, is the fixed discount
	});

	// Important note: some of these values are not to be sent to the backend, their only purpose is to be shown in the UI
	const [currentSale, setCurrentSale] = useState<{
		store: {
			id: string;
			name: string;
		};
		date: Date;
		items: {
			productId: string;
			name: string;
			categoryName: string;
			barcode: string;
			imageUrl: string;
			quantity: number;
			stock: number;
			unitPrice: number;
			taxIncluded: boolean;
			discount: number;
		}[];
		customer: {
			name: string;
			RTN: string;
			phone: string;
			email: string;
		};
		needsReceipt: boolean;
		payment: {
			method:
				| "cash"
				| "credit_card"
				| "debit_card"
				| "online"
				| "gift_card"
				| "split_payment";
			subtotal: number;
			taxRate: number;
			taxes: number;
			totalDiscount: number;
			totalAmount: number;
			paidAmount: number;
			changeGiven: number;
		};
		processedBy: string;
	}>({
		store: {
			id: "",
			name: "",
		},
		date: new Date(Date.now()),
		items: [],
		customer: { name: "Consumidor Final", RTN: "", phone: "", email: "" },
		needsReceipt: true,
		payment: {
			method: "cash",
			subtotal: 0,
			taxRate: 0,
			taxes: 0,
			totalDiscount: 0,
			totalAmount: 0,
			paidAmount: 0,
			changeGiven: 0,
		},

		processedBy: "",
	});
	const createSaleSchema = z.object({
		date: z
			.string()
			.refine(
				(val) => {
					if (!val) return true;
					else {
						const date = new Date(val);
						return !isNaN(date.getTime());
					}
				},
				{
					message: "invalid-date",
				},
			)
			.optional(),
		store: z.string().min(1, { message: "invalid-store" }),
		needsReceipt: z.boolean(),
		customer: z.object({
			name: z.string().refine((name) => name.trim().length !== 0, {
				message: "invalid-name",
			}),
			email: z.string().email().optional(),
			RTN: z.string().optional(),
			phone: z.string().optional(),
		}),
		items: z
			.array(
				z.object({
					product: z.string(),
					quantity: z.number().positive({ message: "invalid-quantity" }),
					unitPrice: z.number().positive(),
					discountApplied: z.number().optional(),
				}),
			)
			.min(1, {
				message: "empty-sale",
			}),
		payment: z.object({
			method: z.enum([
				"cash",
				"credit_card",
				"debit_card",
				"online",
				"gift_card",
				"split_payment",
			]),
			taxName: z
				.string({ message: "invalid-tax" })
				.min(1, { message: "invalid-tax" }),
			paidAmount: z
				.number()
				.positive({ message: "invalid-payment" })
				.refine(
					(paymentAmount) => {
						if (paymentAmount < currentSale.payment.totalAmount) {
							return false;
						}
						return true;
					},
					{ message: "invalid-payment-amount" },
				),
		}),
		warehouseId: z
			.string({ message: "invalid-warehouse" })
			.min(1, { message: "invalid-warehouse" }),
	});
	const [confirmSaleModalState, setConfirmSaleModalState] = useState<{
		open: boolean;
		loading: boolean;
	}>({
		open: false,
		loading: false,
	});
	const createSale = async () => {
		const parsedData = createSaleSchema.safeParse({
			date: currentSale.date.toISOString(),
			store: currentSale.store.id,
			needsReceipt: currentSale.needsReceipt,
			customer: {
				name: currentSale.customer.name,
				email:
					currentSale.customer.email.trim() == ""
						? undefined
						: currentSale.customer.email,
				RTN:
					currentSale.customer.RTN.trim() == ""
						? undefined
						: currentSale.customer.RTN,
				phone:
					currentSale.customer.phone.trim() == ""
						? undefined
						: currentSale.customer.phone,
			},
			items: currentSale.items.map((item) => ({
				product: item.productId,
				quantity: item.quantity,
				unitPrice: item.unitPrice,
				discountApplied: item.discount,
			})),
			payment: {
				method: currentSale.payment.method,
				taxName:
					(config?.taxes.find((tax) => tax.rate == currentSale.payment.taxRate)
						?.name as string) ?? undefined,
				paidAmount: currentSale.payment.paidAmount,
			},
			warehouseId: selectWarehouse as string,
		});

		if (!parsedData.success) {
			parsedData.error.errors.forEach((error) => {
				message.warning(
					t(`pos:sales.new.modals.payment.messages.${error.message}`),
				);
			});
			return;
		}
		setConfirmSaleModalState({
			...confirmSaleModalState,
			loading: true,
		});

		const data = parsedData.data;
		const result = await SalesFeature.salesAPI.create({
			...data,
			processedBy: account!._id.toString(),
			POSSession: POSSession!._id.toString(),
		});

		if (result.status == "success") {
			message.success(t("pos:sales.new.modals.confirmSale.messages.success"));

			setConfirmSaleModalState({
				...confirmSaleModalState,
				loading: true,
			});

			setTimeout(() => {
				navigate({
					to: `/dashboard/sales`,
				});
			}, 1000);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}

		setConfirmSaleModalState({
			...confirmSaleModalState,
			loading: false,
		});
	};

	useEffect(() => {
		fetchCategories();
		fetchWarehouses();
	}, []);

	useEffect(() => {
		let total = 0;
		let taxes = 0;
		let discount = 0;
		let subtotal = 0;

		currentSale.items.forEach((item) => {
			const itemSubtotal = item.unitPrice * item.quantity;
			if (item.discount > 0) {
				if (item.discount > itemSubtotal) {
					message.warning(
						t("pos:sales.new.modals.discount.messages.invalidDiscount"),
					);
					return;
				}

				if (discountModalState.type === "percentage") {
					discount = (itemSubtotal * item.discount) / 100;
				} else {
					discount = item.discount;
				}
			}

			if (item.taxIncluded) {
				const priceWithoutIncludedTax =
					itemSubtotal - (itemSubtotal * currentSale.payment.taxRate) / 100;
				taxes += itemSubtotal - priceWithoutIncludedTax;
				subtotal += priceWithoutIncludedTax;
			} else {
				subtotal += itemSubtotal;
				taxes += (itemSubtotal * currentSale.payment.taxRate) / 100;
			}
		});
		total = subtotal + taxes - discount;

		if (currentSale)
			setCurrentSale((prev) => ({
				...prev,
				payment: {
					...prev.payment,
					taxes: taxes,
					subtotal: subtotal,
					totalAmount: total,
					totalDiscount: discount,
				},
			}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentSale.items, currentSale.payment.taxRate]);

	useEffect(() => {
		if (POSSession && account) {
			(async () => {
				const result = await StoresFeature.storesAPI.get({
					storeIds: [POSSession.store as unknown as string],
					fields: ["name", "_id"],
					relations: [],
				});

				if (result.status == "success" && result.stores) {
					setCurrentSale((prev) => ({
						...prev,
						store: {
							id: result.stores![0]._id.toString(),
							name: result.stores![0].name,
						},
						processedBy: account!._id.toString(),
					}));
				} else {
					message.error(t(`error-messages:${result.status}`));
				}
			})();
		}
	}, [POSSession, account]);

	return (
		<POSPageLayout>
			<Modal
				open={!!discountModalState.productId}
				onCancel={() =>
					setDiscountModalState((prev) => ({ ...prev, productId: null }))
				}
				title={t("pos:sales.new.modals.discount.title")}
				onOk={() => {
					setCurrentSale((prev) => ({
						...prev,
						items: prev.items.map((item) =>
							item.productId === discountModalState.productId
								? { ...item, discount: discountModalState.totalDiscount }
								: item,
						),
					}));
					setDiscountModalState((prev) => ({ ...prev, productId: null }));
				}}
				okText={t("dashboard:common.save")}
				cancelText={t("dashboard:common.cancel")}
			>
				<div className="flex flex-col gap-4">
					<Text>{t("pos:sales.new.modals.discount.description")}</Text>

					<Switch
						checkedChildren={t("pos:sales.new.modals.discount.percentage")}
						unCheckedChildren={t("pos:sales.new.modals.discount.amount")}
						checked={discountModalState.type === "percentage"}
						onChange={(checked) =>
							setDiscountModalState((prev) => ({
								...prev,
								type: checked ? "percentage" : "amount",
							}))
						}
					/>

					<InputNumber
						min={0}
						max={discountModalState.type === "percentage" ? 100 : undefined}
						value={discountModalState.totalDiscount}
						onChange={(value) =>
							setDiscountModalState((prev) => ({
								...prev,
								totalDiscount: value as number,
							}))
						}
						addonBefore={
							discountModalState.type === "percentage"
								? "%"
								: config?.currencySymbol || "$"
						}
						placeholder={
							discountModalState.type === "percentage"
								? t("pos:sales.new.modals.discount.percentagePlaceholder")
								: t("pos:sales.new.modals.discount.amountPlaceholder")
						}
						className="w-full"
					/>

					{(() => {
						const product = currentSale.items.find(
							(item) => item.productId === discountModalState.productId,
						);

						if (!product) return null;

						const originalPrice = product.unitPrice * product.quantity;
						const discount =
							discountModalState.type === "percentage"
								? (originalPrice * discountModalState.totalDiscount) / 100
								: discountModalState.totalDiscount;

						const discountedPrice = (originalPrice - discount).toFixed(2);

						return (
							<Text>
								{t("pos:sales.new.modals.discount.summary", {
									productName: product.name,
									originalPrice: product.unitPrice,
									discountedPrice,
								})}
							</Text>
						);
					})()}
				</div>
			</Modal>

			<Modal
				open={confirmSaleModalState.open}
				onCancel={() => {
					setConfirmSaleModalState({
						loading: false,
						open: false,
					});
				}}
				onClose={() => {
					setConfirmSaleModalState({
						loading: false,
						open: false,
					});
				}}
				title={t("pos:sales.new.modals.confirmSale.title")}
				onOk={() => {
					createSale();
				}}
				loading={confirmSaleModalState.loading}
				okText={t("pos:sales:new.modals.confirmSale.create")}
			>
				<p>{t("pos:sales.new.modals.confirmSale.description")}</p>
			</Modal>

			<Drawer
				open={paymentModalOpen}
				onClose={() => setPaymentModalOpen(false)}
				title={t("pos:sales.new.paymentDetails.title")}
				footer={null}
				width={1000}
				extra={
					<Button
						type="primary"
						onClick={async () => {
							setConfirmSaleModalState({
								loading: false,
								open: true,
							});
						}}
					>
						{t("pos:sales.new.modals.payment.completeSale")}
					</Button>
				}
			>
				<div>
					<div>
						<Title level={2}>
							{t("pos:sales.new.modals.payment.receipt.title")}
						</Title>
						<Text>{t("pos:sales.new.modals.payment.receipt.description")}</Text>

						<Select
							value={currentSale.needsReceipt}
							onChange={(value) =>
								setCurrentSale({
									...currentSale,
									needsReceipt: value,
								})
							}
							options={[
								{
									value: true,
									label: t("pos:sales.new.modals.payment.receipt.yes"),
								},
								{
									value: false,
									label: t("pos:sales.new.modals.payment.receipt.no"),
								},
							]}
							className="w-full"
							placeholder={t(
								"pos:sales.new.modals.payment.receipt.placeholder",
							)}
						/>
					</div>

					<div className="mt-4">
						<Title level={2}>
							{t("pos:sales:new.modals.payment.taxes.title")}
						</Title>

						<Text>{t("pos:sales:new.modals.payment.taxes.description")}</Text>

						<Select
							value={currentSale.payment.taxRate}
							allowClear
							onChange={(value) =>
								setCurrentSale({
									...currentSale,
									payment: {
										...currentSale.payment,
										taxRate: value,
										taxes: currentSale.payment.subtotal * value,
									},
								})
							}
							options={
								config
									? config?.taxes.map((tax) => ({
											value: tax.rate,
											label: `${tax.name} (${tax.rate}%)`,
										}))
									: []
							}
							className="w-full"
							placeholder={t("pos:sales:new.modals.payment.taxes.placeholder")}
						/>
					</div>

					<div className="mt-6">
						<Title level={2}>
							{t("pos:sales:new.modals.payment.totalAmount.title")}
						</Title>
						<table className="w-full border-collapse">
							<tbody>
								<tr className="border-b">
									<td className="py-2 font-medium">
										{t("pos:sales:new.modals.payment.totalAmount.subtotal")}
									</td>
									<td className="py-2">
										{config?.currency} {currentSale.payment.subtotal.toFixed(2)}
									</td>
								</tr>
								<tr className="border-b">
									<td className="py-2 font-medium">
										{t("pos:sales:new.modals.payment.totalAmount.tax")}
									</td>
									<td className="py-2">
										{config?.currency} {currentSale.payment.taxes.toFixed(2)}
									</td>
								</tr>
								<tr className="border-b">
									<td className="py-2 font-medium">
										{t("pos:sales:new.modals.payment.totalAmount.discount")}
									</td>
									<td className="py-2">
										{config?.currency} -
										{currentSale.payment.totalDiscount.toFixed(2)}
									</td>
								</tr>
								<tr className="border-b">
									<td className="py-2 font-medium">
										{t("pos:sales:new.modals.payment.totalAmount.title")}
									</td>
									<td className="py-2">
										{config?.currency}{" "}
										{currentSale.payment.totalAmount.toFixed(2)}
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="mt-6">
						<Title level={2}>
							{t("pos:sales:new.modals.payment.method.title")}
						</Title>
						<Select
							value={currentSale.payment.method}
							onChange={(value) =>
								setCurrentSale({
									...currentSale,
									payment: { ...currentSale.payment, method: value },
								})
							}
							options={[
								{
									value: "cash",
									label: t("pos:sales:new.modals.payment.method.cash"),
								},
								{
									value: "credit_card",
									label: t("pos:sales:new.modals.payment.method.card"),
								},
								{
									value: "bank",
									label: t("pos:sales:new.modals.payment.method.transfer"),
								},
							]}
							className="w-full"
						/>
					</div>
				</div>

				{/* Cash Payment Details */}
				{currentSale.payment.method === "cash" && (
					<div className="mt-4">
						<Text>
							{t(
								"pos:sales:new.modals.payment.method.cashMethod.amountPlaceholder",
							)}
						</Text>
						<InputNumber
							type="number"
							addonBefore={config ? config!.currencySymbol : ""}
							value={currentSale.payment.paidAmount}
							onChange={(e) => {
								const paidAmount = e || 0;
								setCurrentSale({
									...currentSale,
									payment: {
										...currentSale.payment,
										paidAmount,
										changeGiven: paidAmount - currentSale.payment.totalAmount,
									},
								});
							}}
							placeholder={t(
								"pos:sales:new.modals.payment.method.cashMethod.amountPlaceholder",
							)}
							className="w-full"
						/>

						<div className="mt-6">
							<Text>
								{t(
									"pos:sales:new.modals.payment.method.cashMethod.changePlaceholder",
								)}
							</Text>
							<Input
								type="number"
								disabled
								addonBefore={config ? config!.currencySymbol : ""}
								value={currentSale.payment.changeGiven}
								readOnly
							/>
						</div>
					</div>
				)}

				{/* Card Payment Details */}
				{currentSale.payment.method === "credit_card" && (
					<p>Method not implemented yet</p>
				)}

				{/* Bank Transfer Payment Details */}
				{currentSale.payment.method === "debit_card" && (
					<p>Method not implemented yet</p>
				)}
			</Drawer>

			<Title>{t("pos:sales:new.page.title")}</Title>

			<Text>{t("pos:sales.new.page.description")}</Text>

			{/* Sale Summary */}
			<div className="mt-4 text-2xl">
				<Title level={3}>{t("pos:sales:new.saleSummary.title")}</Title>
				<Text>
					{t("pos:sales:new.saleSummary.totalItems")}:{" "}
					{currentSale.items.length} items
				</Text>
			</div>

			{/* Sale Details */}
			<Title level={2} className="mt-8">
				{t("pos:sales:new.saleDetails.title")}
			</Title>
			<div className="overflow-x-auto">
				<table className="w-full border-collapse">
					<tbody>
						{/* Customer Details */}
						<tr className="border-b">
							<td className="py-2 text-gray-800 dark:text-gray-100 font-medium">
								{t("pos:sales:new.saleDetails.customerName")}
							</td>
							<td className="py-2">
								<Input
									value={currentSale.customer.name}
									onChange={(e) =>
										setCurrentSale({
											...currentSale,
											customer: {
												...currentSale.customer,
												name: e.target.value,
											},
										})
									}
									placeholder={t(
										"pos:sales:new.saleDetails.customerNamePlaceholder",
									)}
									className="w-full"
								/>
							</td>
						</tr>

						<tr className="border-b">
							<td className="py-2 text-gray-800 dark:text-gray-100 font-medium">
								{t("pos:sales:new.saleDetails.customerRTN")}
							</td>
							<td className="py-2">
								<Input
									value={currentSale.customer.RTN}
									onChange={(e) =>
										setCurrentSale({
											...currentSale,
											customer: {
												...currentSale.customer,
												RTN: e.target.value,
											},
										})
									}
									placeholder={t(
										"pos:sales:new.saleDetails.customerRTNPlaceholder",
									)}
									className="w-full"
								/>
							</td>
						</tr>

						<tr className="border-b">
							<td className="py-2 text-gray-800 dark:text-gray-100 font-medium">
								{t("pos:sales:new.saleDetails.customerPhone")}
							</td>
							<td className="py-2">
								<Input
									value={currentSale.customer.phone}
									onChange={(e) =>
										setCurrentSale({
											...currentSale,
											customer: {
												...currentSale.customer,
												phone: e.target.value,
											},
										})
									}
									placeholder={t(
										"pos:sales:new.saleDetails.customerPhonePlaceholder",
									)}
									className="w-full"
								/>
							</td>
						</tr>

						<tr className="border-b">
							<td className="py-2 text-gray-800 dark:text-gray-100 font-medium">
								{t("pos:sales:new.saleDetails.customerEmail")}
							</td>
							<td className="py-2">
								<Input
									value={currentSale.customer.email}
									onChange={(e) =>
										setCurrentSale({
											...currentSale,
											customer: {
												...currentSale.customer,
												email: e.target.value,
											},
										})
									}
									placeholder={t(
										"pos:sales:new.saleDetails.customerEmailPlaceholder",
									)}
									className="w-full"
								/>
							</td>
						</tr>

						{/* Date */}
						<tr className="border-b">
							<td className="py-2 text-gray-800 dark:text-gray-100 font-medium">
								{t("pos:sales:new.saleDetails.transactionDate")}
							</td>
							<td className="py-2">
								<DatePicker
									onChange={(date) =>
										setCurrentSale({
											...currentSale,
											date: date.toDate(),
										})
									}
									showTime
									className="w-full"
								/>
							</td>
						</tr>

						{/* Store */}
						<tr>
							<td className="py-2 text-gray-800 dark:text-gray-100 font-medium">
								{t("pos:sales:new.saleDetails.store")}
							</td>
							<td className="py-2">
								<Tooltip title={t("pos:sales:new.saleDetails.storeTooltip")}>
									<Input
										disabled
										value={currentSale.store.name}
										placeholder={t("pos:sales:new.storePlaceholder")}
										className="w-full"
									/>
								</Tooltip>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* Sale List */}
			<div className="mt-10">
				<Title level={2}>{t("pos:sales:new.productList.title")}</Title>

				<div className="flex items-center justify-center gap-2">
					<p>{t("pos:sales:new.productList.selectWarehouse")}</p>

					<Select
						labelInValue
						onChange={(value) => {
							if (!value) return;
							setSelectWarehouse(value.value);
						}}
						disabled={currentSale.items.length > 0}
						options={warehouses?.map((warehouse) => ({
							value: warehouse._id,
							label: warehouse.name,
						}))}
						placeholder={t("pos:sales:new.productList.selectWarehouse")}
						className="w-full"
						allowClear
					/>
				</div>

				<div className="flex items-center gap-16 mt-2">
					<div className="flex items-center justify-center gap-2 w-1/2">
						<p>{t("pos:sales:new.productList.addByBarcode")}</p>

						<Input
							type="text"
							placeholder={t(
								"pos:sales:new.productList.addByBarcodePlaceholder",
							)}
							className="w-full"
							disabled={selectWarehouse == null}
							allowClear
							onPressEnter={async (e) => {
								// Get the product
								const productResult = await ProductsFeature.productsAPI.search({
									query: e.currentTarget.value,
								});

								if (productResult.status == "success") {
									if (productResult.products!.length === 0) {
										message.info(
											t("pos:sales:new.productList.productNotFound"),
										);
										return;
									}

									// Check if the item is already in the sale list, if so add 1 to the quantity
									if (
										currentSale.items.find(
											(item) =>
												item.productId ===
												productResult.products![0]._id.toString(),
										)
									) {
										setCurrentSale((prev) => ({
											...prev,
											items: prev.items.map((item) =>
												item.productId ===
												productResult.products![0]._id.toString()
													? { ...item, quantity: item.quantity + 1 }
													: item,
											),
										}));
										return;
									}

									if (productResult.status == "success") {
										const product = productResult.products?.[0];
										if (!product) {
											message.info(
												t("pos:sales:new.productList.productNotFound"),
											);
										}

										const stockResult =
											await StockFeature.stockAPI.getStocksByProductIds({
												warehouseIds: [selectWarehouse!],
												productIds: [productResult.products![0]._id.toString()],
											});

										setCurrentSale({
											...currentSale,
											items: currentSale.items.concat({
												productId: product!._id.toString(),
												name: product!.name,
												barcode: product!.barcode,
												categoryName:
													(categories ?? []).find(
														(category) =>
															category._id.toString() ==
															(product!.category as unknown as string),
													)?.name ?? "",
												imageUrl: product!.imageUrls[0] ?? "",
												quantity: 1,
												stock: stockResult.stocks![0].stock,
												unitPrice: product!.sellingPrice,
												taxIncluded: product!.taxIncluded,
												discount: 0,
											}),
										});
									}
								} else {
									message.error(t("pos:sales:new.productList.productNotFound"));
								}
							}}
						/>
					</div>

					<div className="flex items-center justify-center gap-2 w-1/2">
						<p>{t("pos:sales:new.productList.searchProduct")}</p>

						<Select
							showSearch
							optionFilterProp="label"
							filterOption={true}
							disabled={selectWarehouse == null}
							onChange={async (value) => {
								if (!value) return;

								// Check if the item is already in the sale list, if so add 1 to the quantity
								if (
									currentSale.items.find((item) => item.productId === value)
								) {
									setCurrentSale((prev) => ({
										...prev,
										items: prev.items.map((item) =>
											item.productId === value
												? { ...item, quantity: item.quantity + 1 }
												: item,
										),
									}));
									return;
								}

								const productResult = await ProductsFeature.productsAPI.get({
									productIds: [value],
								});

								if (productResult.status == "success") {
									const product = productResult.products![0];

									const stockResult =
										await StockFeature.stockAPI.getStocksByProductIds({
											warehouseIds: [selectWarehouse!],
											productIds: [productResult.products![0]._id.toString()],
										});

									setProductListSearchState((prev) => ({
										...prev,
										loading: false,
										productsOptions: [],
									}));

									setCurrentSale({
										...currentSale,
										items: currentSale.items.concat({
											productId: product!._id.toString(),
											name: product!.name,
											barcode: product!.barcode,
											categoryName:
												(categories ?? []).find(
													(category) =>
														category._id.toString() ==
														(product!.category as unknown as string),
												)?.name ?? "",
											imageUrl: product!.imageUrls[0] ?? "",
											quantity: 1,
											stock: stockResult.stocks![0].stock,
											unitPrice: product!.sellingPrice,
											taxIncluded: product!.taxIncluded,
											discount: 0,
										}),
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
				</div>

				<Table
					className="mt-4"
					key={currentSale.items.length}
					dataSource={currentSale.items}
					columns={[
						{
							title: t("pos:sales.new.productList.table.name"),
							key: "_id",
							dataIndex: "name",
							render: (_, product) => {
								return (
									<span className="flex items-center gap-2">
										<Image
											width={50}
											height={50}
											src={product.imageUrl || "/item.png"}
											className="w-14 h-14 rounded-lg object-cover"
											alt="Product"
										/>
										<div className="flex flex-col">
											<p>{product.name}</p>
											<div className="flex gap-2 items-center text-gray-500">
												<FaBarcode />
												<p>{product.barcode}</p>
											</div>
										</div>
									</span>
								);
							},
						},

						{
							title: t("pos:sales.new.productList.table.unitPrice"),
							dataIndex: "unitPrice",
							render: (text) => `${config && config.currencySymbol} ${text}`,
						},
						{
							title: t("pos:sales.new.productList.table.quantity"),
							key: "_id",
							dataIndex: "quantity",
							render: (item, record) => {
								return (
									<div className="flex items-center justify-start gap-2">
										<Input
											type="number"
											value={
												currentSale.items.find(
													(item) => item.productId === record.productId,
												)?.quantity
											}
											min={1}
											className="w-20 px-2 py-1 border rounded-md"
											status={item.stock < 1 ? "error" : undefined}
											onChange={(e) => {
												const quantity = parseInt(e.target.value);

												setCurrentSale((prev) => ({
													...prev,
													items: prev.items.map((item) =>
														item.productId === record.productId
															? {
																	...item,
																	quantity,
																}
															: item,
													),
												}));
											}}
										/>

										<p>/ {record.stock}</p>

										{record.stock <
										currentSale.items.find(
											(item) => item.productId === record.productId,
										)!.quantity! ? (
											<Tooltip
												title={t(
													"pos:sales.new.productList.table.quantityError",
												)}
											>
												<FaExclamationTriangle className="text-red-500" />
											</Tooltip>
										) : null}
									</div>
								);
							},
						},
						{
							title: t("pos:sales.new.productList.table.discount"),
							dataIndex: "discount",
							key: "_id",
							render: (_, record) => (
								<span className="flex items-center gap-2">
									{config && config.currencySymbol} {record.discount}
								</span>
							),
						},
						{
							title: t("pos:sales.new.productList.table.totalPrice"),
							dataIndex: "total",
							key: "_id",
							render: (_, record) => (
								<span className="flex items-center gap-2">
									{config && config.currencySymbol}{" "}
									{record.quantity * record.unitPrice - record.discount}
								</span>
							),
						},
						{
							title: t("pos:sales.new.productList.table.actions"),
							key: "_id",
							render: (_, record) => (
								<div className="flex items-center justify-center gap-2">
									<Tooltip
										title={t("pos:sales.new.productList.tableActions.remove")}
										placement="top"
									>
										<Button
											onClick={() => {
												setCurrentSale((prev) => ({
													...prev,
													items: prev.items.filter(
														(item) => item.productId !== record.productId,
													),
												}));
											}}
											danger
											icon={<FaTrash />}
										/>
									</Tooltip>

									<Tooltip
										title={t("pos:sales.new.productList.tableActions.edit")}
										placement="top"
									>
										<Button
											onClick={() => {
												setDiscountModalState({
													productId: record.productId,
													originalUnitPrice: record.unitPrice,
													type: "amount",
													totalDiscount: record.discount,
												});
											}}
											variant="outlined"
											icon={<FaPercent />}
										/>
									</Tooltip>
								</div>
							),
						},
					]}
					rowKey="_id"
				/>
			</div>

			<Title className="mt-8" level={3}>
				{t("pos:sales:new.paymentDetails.title")}
			</Title>

			<Button
				onClick={() => {
					setPaymentModalOpen(true);
				}}
				className="mt-4"
				type="primary"
			>
				{t("pos:sales:new.paymentDetails.button")}
			</Button>
		</POSPageLayout>
	);
}
