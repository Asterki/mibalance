import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import type { RootState } from "../../store";

import {
	App,
	Button,
	Table,
	Typography,
	Drawer,
	Input,
	Modal,
	Tooltip,
	Descriptions,
	Tag,
	Card,
	DatePicker,
} from "antd";
const { Title, Text } = Typography;

import AdminPageLayout from "../../layouts/AdminLayout";
import {
	FaEye,
	FaMoneyBillWave,
	FaReceipt,
	FaSearch,
	FaTrash,
} from "react-icons/fa";

import SalesFeature, { ISale } from "../../features/sales";
import AccountsFeature from "../../features/accounts";
import StoresFeature from "../../features/stores";
import ProductsFeature from "../../features/products";

import { generateSaleReceiptPDF } from "../../utils/receipts";

export const Route = createFileRoute("/dashboard/sales")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { account } = useSelector((state: RootState) => state.auth);
	const { config } = useSelector((state: RootState) => state.config);

	const { message } = App.useApp();
	const { t } = useTranslation(["main"]);

	interface ListSale {
		_id: string;
		date: string;
		receiptNumber: string;
		storeId: string;
		employeeId: string;
		customer: string;
		total: number;
		refund?: "total" | "partial";
		paymentMethod: string;
		status: string;
	}
	const [sales, setSales] = useState<{
		filters: {
			receiptNumber: boolean;
			customer: boolean;
			store: boolean;
			employee: boolean;
			date: boolean;
		};
		loading: boolean;
		sales: ListSale[];
		totalSalesCount: number;
		page: number;
		count: number;
	}>({
		filters: {
			receiptNumber: false,
			customer: false,
			store: false,
			employee: false,
			date: false,
		},
		loading: true,
		sales: [],
		totalSalesCount: 0,
		page: 0,
		count: 0,
	});
	const fetchSales = async (
		count: number,
		page: number,
		query: {
			customer?: string;
			receiptNumber?: string;
			storeId?: string;
			employeeId?: string;
			startDate?: string;
			endDate?: string;
		},
	) => {
		setSales({
			...sales,
			loading: true,
		});

		const result = await SalesFeature.salesAPI.list({
			count: count,
			page: page,
			query: {
				receiptNumber: query.receiptNumber ?? undefined,
				customer: query.customer ?? undefined,
				storeId: query.storeId ?? undefined,
				processedBy: query.employeeId ?? undefined,
				dateStart: query.startDate ?? undefined,
				dateEnd: query.endDate ?? undefined,
			},
			fields: [
				"_id",
				"date",
				"customer",
				"payment",
				"receiptNumber",
				"store",
				"processedBy",
				"refund",
			],
		});

		if (result.status == "success") {
			setSales({
				filters: {
					receiptNumber: !!query.receiptNumber,
					customer: !!query.customer,
					store: !!query.storeId,
					employee: !!query.employeeId,
					date: !!query.startDate || !!query.endDate,
				},
				loading: false,
				sales: result.sales!.map((sale) => {
					return {
						_id: sale._id.toString(),
						storeId: sale.store.toString(),
						employeeId: sale.processedBy.toString(),
						date: new Date(sale.date).toLocaleString(),
						receiptNumber: sale.receiptNumber ?? "-",
						customer: sale.customer.name,
						refund:
							sale.refund !== null && sale.refund !== undefined
								? sale.refund!.type
								: undefined,
						status: sale.payment.paymentStatus,
						paymentMethod: sale.payment.method,
						total: sale.payment.totalAmount,
					};
				}),
				totalSalesCount: result.totalSalesCount!,
				page: 0,
				count: 50,
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	interface ListEmployee {
		name: string;
		_id: string;
	}
	const [employees, setEmployees] = useState<ListEmployee[]>([]);
	const fetchEmployees = async () => {
		const result = await AccountsFeature.accountsAPI.list({
			count: 50,
			page: 0,
			fields: ["_id", "profile"],
		});

		if (result.status == "success") {
			setEmployees(
				result.accounts!.map((employee) => {
					return {
						_id: employee._id.toString(),
						name: employee.profile.name,
					};
				}),
			);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	interface ListStore {
		name: string;
		_id: string;
	}
	const [stores, setStores] = useState<ListStore[]>([]);
	const fetchStores = async () => {
		const result = await StoresFeature.storesAPI.list({
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

	const [selectedSale, setSelectedSale] = useState<ISale | null>(null);

	const [deleteSaleId, setDeleteSaleId] = useState<string | null>(null);
	const deleteSale = async () => {
		if (deleteSaleId) {
			const result = await SalesFeature.salesAPI.delete({
				saleId: deleteSaleId,
			});

			if (result.status == "success") {
				setDeleteSaleId(null);
				fetchSales(50, 0, {});
				message.success(t("dashboard:sales.modals.delete.messages.success"));
			} else {
				message.error(t(`error-messages:${result.status}`));
			}
		}
	};

	useEffect(() => {
		fetchStores();
		fetchEmployees();
		fetchSales(50, 0, {});
	}, []);

	return (
		<AdminPageLayout selectedPage="sales">
			<Drawer
				title={t("dashboard:sales.modals.selected.title")}
				placement="right"
				closable={false}
				onClose={() => setSelectedSale(null)}
				open={selectedSale !== null}
				width={1200}
				extra={
					<div>
						<Button
							danger
							disabled={
								selectedSale !== null
									? !(
											selectedSale.refund == undefined &&
											selectedSale.refund == null
										)
									: true
							}
							onClick={() => {
								navigate({
									to: "/pos/sales/refund",
									search: {
										saleId: selectedSale!._id.toString(),
									},
								});
							}}
						>
							{t("dashboard:sales.modals.selected.refund")}
						</Button>
					</div>
				}
			>
				{selectedSale && (
					<div className="grid gap-4">
						<Card
							title={t("dashboard:sales.modals.selected.generalInfo.title")}
						>
							<Descriptions column={1} size="small">
								<Descriptions.Item
									label={t(
										"dashboard:sales.modals.selected.generalInfo.receipt",
									)}
								>
									{selectedSale.receiptNumber || "N/A"}
								</Descriptions.Item>
								<Descriptions.Item
									label={t("dashboard:sales.modals.selected.generalInfo.date")}
								>
									{new Date(selectedSale.date).toLocaleString()}
								</Descriptions.Item>
								<Descriptions.Item
									label={t("dashboard:sales.modals.selected.generalInfo.store")}
								>
									{typeof selectedSale.store === "object"
										? selectedSale.store.name
										: stores.find((store) => {
												return store._id == selectedSale.store.toString();
											})?.name}
								</Descriptions.Item>
								<Descriptions.Item
									label={t(
										"dashboard:sales.modals.selected.generalInfo.processedBy",
									)}
								>
									{
										employees.find((employee) => {
											return (
												employee._id == selectedSale.processedBy.toString()
											);
										})?.name
									}
								</Descriptions.Item>
							</Descriptions>
						</Card>

						<Card
							title={t("dashboard:sales.modals.selected.customerInfo.title")}
						>
							<Descriptions column={1} size="small">
								<Descriptions.Item
									label={t("dashboard:sales.modals.selected.customerInfo.name")}
								>
									{selectedSale.customer.name}
								</Descriptions.Item>
								<Descriptions.Item
									label={t(
										"dashboard:sales.modals.selected.customerInfo.email",
									)}
								>
									{selectedSale.customer.email || "N/A"}
								</Descriptions.Item>
								<Descriptions.Item
									label={t(
										"dashboard:sales.modals.selected.customerInfo.phone",
									)}
								>
									{selectedSale.customer.phone || "N/A"}
								</Descriptions.Item>
								<Descriptions.Item
									label={t("dashboard:sales.modals.selected.customerInfo.rtn")}
								>
									{selectedSale.customer.RTN || "N/A"}
								</Descriptions.Item>
							</Descriptions>
						</Card>

						<Card title={t("dashboard:sales.modals.selected.payment.title")}>
							<Descriptions column={1} size="small">
								<Descriptions.Item
									label={t("dashboard:sales.table.paymentMethod")}
								>
									{selectedSale.payment.method.replace(/_/g, " ")}
								</Descriptions.Item>
								<Descriptions.Item
									label={t("dashboard:sales.modals.selected.payment.total")}
								>
									{config?.currency}{" "}
									{selectedSale.payment.totalAmount.toFixed(2)}
								</Descriptions.Item>
								<Descriptions.Item
									label={t("dashboard:sales.modals.selected.payment.totalPaid")}
								>
									{config?.currency}{" "}
									{selectedSale.payment.paidAmount.toFixed(2)}
								</Descriptions.Item>
								<Descriptions.Item
									label={t("dashboard:sales.modals.selected.payment.change")}
								>
									{config?.currency}{" "}
									{(selectedSale.payment.changeGiven || 0).toFixed(2)}
								</Descriptions.Item>
								<Descriptions.Item
									label={t("dashboard:sales.modals.selected.payment.status")}
								>
									<Tag
										color={
											selectedSale.payment.paymentStatus === "paid"
												? "green"
												: selectedSale.payment.paymentStatus === "unpaid"
													? "red"
													: "orange"
										}
									>
										{t(
											`dashboard:sales.table.${selectedSale.payment.paymentStatus}`,
										)}
									</Tag>
								</Descriptions.Item>
							</Descriptions>
						</Card>

						<Card title={t("dashboard:sales.modals.selected.products.title")}>
							<Table
								dataSource={selectedSale.items.map((item, index) => ({
									...item,
									key: index,
									product:
										typeof item.product === "object"
											? item.product.name
											: item.product,
								}))}
								size="small"
								pagination={false}
							>
								<Table.Column
									title={t("dashboard:sales.modals.selected.products.product")}
									dataIndex="product"
								/>
								<Table.Column
									title={t("dashboard:sales.modals.selected.products.quantity")}
									dataIndex="quantity"
								/>
								<Table.Column
									title={t(
										"dashboard:sales.modals.selected.products.unitPrice",
									)}
									dataIndex="unitPrice"
									render={(v) => `${config?.currency} ${v.toFixed(2)}`}
								/>
								<Table.Column
									title={t("dashboard:sales.modals.selected.products.total")}
									dataIndex="total"
									render={(v) => `${config?.currency} ${v.toFixed(2)}`}
								/>
							</Table>
						</Card>
					</div>
				)}
			</Drawer>

			<Modal
				title={t("dashboard:sales.modals.delete.title")}
				open={deleteSaleId !== null}
				onOk={deleteSale}
				onCancel={() => setDeleteSaleId(null)}
				okButtonProps={{
					variant: "solid",
					color: "red",
				}}
				okText={t("dashboard:common.delete")}
				cancelText={t("dashboard:common.cancel")}
			>
				<p>{t("dashboard:sales.modals.delete.description")}</p>
			</Modal>

			<div className="mb-2">
				{t("dashboard:common.loggedInAs", {
					name: account?.profile.name,
					email: account?.email.value,
				})}
			</div>

			<Title className="flex items-center gap-2">
				<FaMoneyBillWave />
				{t("dashboard:sales.page.title")}
			</Title>

			<Text>{t("dashboard:sales.page.description")}</Text>

			<div className="my-2 flex items-center gap-2">
				<Button
					variant="solid"
					type="primary"
					onClick={() => {
						navigate({
							to: "/pos/sales/new",
						});
					}}
				>
					{t("dashboard:sales.page.createSale")}
				</Button>
			</div>

			<Table
				className="mt-4 overflow-x-scroll"
				dataSource={sales.sales}
				rowKey="_id"
				loading={sales.loading}
				pagination={{
					showTotal: (total, range) =>
						t("dashboard:sales.table.saleCount", {
							total: total,
							range: `${range[0]}-${range[1]}`,
						}),
					showSizeChanger: true,
					pageSize: sales.count,
					total: sales.totalSalesCount,
					current: sales.page + 1,
					onChange: (page, pageSize) => {
						fetchSales(pageSize!, page! - 1, {});
					},
				}}
				columns={[
					{
						title: t("dashboard:sales.table.date"),
						dataIndex: "date",
						key: "date",
						render: (text) => new Date(text).toLocaleString(),
						sorter: (a, b) =>
							new Date(a.date).getTime() - new Date(b.date).getTime(),
						filterDropdown: (
							<div className="p-2 rounded-md shadow-md flex gap-2 items-center justify-center">
								<DatePicker.RangePicker
									className="w-full"
									onChange={async (dates) => {
										if (dates == null) {
											await fetchSales(50, 0, {});
											return;
										}
										await fetchSales(50, 0, {
											startDate: dates![0]!.toISOString(),
											endDate: dates![1]!.toISOString(),
										});
									}}
									allowClear
									format="YYYY-MM-DD HH:mm:ss"
								/>
							</div>
						),
						filterIcon: (
							<FaSearch
								className={`${sales.filters.date ? "text-blue-500" : ""}`}
							/>
						),
					},
					{
						title: t("dashboard:sales.table.receipt"),
						dataIndex: "receiptNumber",
						key: "receiptNumber",
						filterDropdown: (
							<div className="p-2 rounded-md shadow-md flex gap-2 items-center justify-center">
								<Input.Search
									placeholder={t("dashboard:sales.table.searchByReceipt")}
									allowClear
									onClear={async () => {
										await fetchSales(50, 0, {});
									}}
									loading={sales.loading}
									onSearch={(query) => {
										fetchSales(50, 0, {
											receiptNumber: query,
										});
									}}
									enterButton={t("dashboard:common.search")}
								/>
							</div>
						),
						filterIcon: (
							<FaSearch
								className={`${sales.filters.receiptNumber ? "text-blue-500" : ""}`}
							/>
						),
					},
					{
						title: t("dashboard:sales.table.store"),
						dataIndex: "store",
						key: "store",
						render: (_, record) => {
							const store = stores.find(
								(store) => store._id === record.storeId,
							);
							return store ? store.name : "-";
						},
						filters: stores.map((store) => ({
							text: store.name,
							value: store._id,
						})),
						onFilter: (value, record) => {
							return record.storeId === value;
						},
						filterIcon: (
							<FaSearch
								className={`${sales.filters.store ? "text-blue-500" : ""}`}
							/>
						),
					},
					{
						title: t("dashboard:sales.table.customer"),
						dataIndex: "customer",
						key: "customer",
						filterDropdown: (
							<div className="p-2 rounded-md shadow-md flex gap-2 items-center justify-center">
								<Input.Search
									placeholder={t("dashboard:sales.table.searchByCustomer")}
									allowClear
									onClear={async () => {
										await fetchSales(50, 0, {});
									}}
									loading={sales.loading}
									onSearch={(query) => {
										fetchSales(50, 0, {
											customer: query,
										});
									}}
									enterButton={t("dashboard:common.search")}
								/>
							</div>
						),
						filterIcon: (
							<FaSearch
								className={`${sales.filters.customer ? "text-blue-500" : ""}`}
							/>
						),
					},
					{
						title: t("dashboard:sales.table.employee"),
						dataIndex: "employee",
						key: "employee",
						render: (_, record) => {
							const employee = employees.find(
								(employee) => employee._id === record.employeeId,
							);
							return employee ? employee.name : "-";
						},
						filters: employees.map((employee) => ({
							text: employee.name,
							value: employee._id,
						})),
						onFilter: (value, record) => {
							return record.employeeId === value;
						},
					},
					{
						title: t("dashboard:sales.table.total"),
						render: (_, record) => {
							return (
								<span>
									{config?.currency} {record.total}
								</span>
							);
						},
						sorter: (a, b) => a.total - b.total,
					},
					{
						title: t("dashboard:sales.table.status"),
						dataIndex: "status",
						render: (text) => {
							let textType = "success";
							if (text == "unpaid") {
								textType = "danger";
							} else if (text == "partially_paid") {
								textType = "warning";
							}

							return (
								<Text type={textType as any} keyboard>
									{t(`dashboard:sales.table.${text}`)}
								</Text>
							);
						},
						filters: [
							{
								text: t("dashboard:sales.table.paid"),
								value: "paid",
							},
							{
								text: t("dashboard:sales.table.partially_paid"),
								value: "partially_paid",
							},
							{
								text: t("dashboard:sales.table.unpaid"),
								value: "unpaid",
							},
						],
						onFilter: (value, record) => {
							return record.status === value;
						},
					},
					{
						title: t("dashboard:sales.table.refund"),
						dataIndex: "refund",
						render: (_, record) => {
							if (!record.refund)
								return (
									<Text keyboard>
										{t(`dashboard:sales.table.refund-no-refund`)}
									</Text>
								);
							let textType = "warning";
							if (record.refund == "total") textType = "danger";

							return (
								<Text type={textType as any} keyboard>
									{t(`dashboard:sales.table.refund-${record.refund}`)}
								</Text>
							);
						},
						filters: [
							{
								text: t("dashboard:sales.table.paid"),
								value: "paid",
							},
							{
								text: t("dashboard:sales.table.partially_paid"),
								value: "partially_paid",
							},
							{
								text: t("dashboard:sales.table.unpaid"),
								value: "unpaid",
							},
						],
						onFilter: (value, record) => {
							return record.status === value;
						},
					},
					{
						title: t("dashboard:sales.table.actions"),
						render: (_, record) => {
							return (
								<div className="flex gap-2">
									<Tooltip
										title={t("dashboard:sales.table.viewTooltip")}
										placement="top"
									>
										<Button
											variant="outlined"
											onClick={async () => {
												const result = await SalesFeature.salesAPI.get({
													saleIds: [record._id],
												});

												const products = await ProductsFeature.productsAPI.get({
													productIds: result.sales![0]!.items.map(
														(item) => item.product.toString() as string,
													),
												});

												const sale = {
													...result.sales![0],
													items: result.sales![0]!.items.map((item) => {
														const product = products.products!.find(
															(product) =>
																product._id.toString() ===
																item.product.toString(),
														);
														return {
															...item,
															product: product || item.product,
														};
													}),
												};

												if (result.status == "success") {
													console.log(sale);
													setSelectedSale(sale as ISale);
												}
											}}
											icon={<FaEye />}
										/>
									</Tooltip>

									<Tooltip
										title={t("dashboard:sales.table.printReceiptTooltip")}
										placement="top"
									>
										<Button
											variant="outlined"
											onClick={async () => {
												const result = await SalesFeature.salesAPI.get({
													saleIds: [record._id],
												});

												const pdfBytes = await generateSaleReceiptPDF(
													result.sales![0]!,
													{ currency: "$" },
												);
												const blob = new Blob([pdfBytes], {
													type: "application/pdf",
												});
												const link = document.createElement("a");
												link.href = URL.createObjectURL(blob);
												link.download = `receipt-${result.sales![0]!.receiptNumber || "sale"}.pdf`;
												link.click();
											}}
											icon={<FaReceipt />}
										/>
									</Tooltip>

									<Tooltip
										title={t("dashboard:sales.table.deleteTooltip")}
										placement="top"
									>
										<Button
											danger
											onClick={() => {
												setDeleteSaleId(record._id);
											}}
											icon={<FaTrash />}
										/>
									</Tooltip>
								</div>
							);
						},
					},
				]}
			/>
		</AdminPageLayout>
	);
}
