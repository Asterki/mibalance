import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import CategoriesFeature, { ICategory } from "../../../features/categories";
import { IProduct } from "../../../features/products";
import WarehouseFeature, { IWarehouse } from "../../../features/warehouses";
import StockFeature, { IStock } from "../../../features/stock";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

import {
	Image,
	App,
	Button,
	Input,
	Modal,
	Select,
	Table,
	Tooltip,
	Typography,
} from "antd";
const { Text, Title } = Typography;

import AdminPageLayout from "../../../layouts/AdminLayout";
import { FaBarcode, FaBoxes } from "react-icons/fa";

export const Route = createFileRoute("/dashboard/warehouses/stock")({
	component: RouteComponent,
});

function RouteComponent() {
	const { account } = useSelector((state: RootState) => state.auth);

	const { message } = App.useApp();
	const { t } = useTranslation(["main", "dashboard"]);
	const navigate = useNavigate();

	const [categoryListState, setCategoryListState] = useState<
		ICategory[] | null
	>(null);
	const fetchCategories = async () => {
		const result = await CategoriesFeature.categoriesAPI.list({
			count: 100,
			page: 0,
		});

		if (result.status == "success" && result.categories) {
			setCategoryListState(result.categories);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	// #region Warehouses
	const [warehouses, setWarehouses] = useState<IWarehouse[] | null>(null);
	const fetchWarehouses = async () => {
		const result = await WarehouseFeature.warehouseAPI.list({
			count: 100,
			page: 0,
		});

		if (result.status == "success" && result.warehouses) {
			setWarehouses(result.warehouses);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};
	const [selectedWarehouse, setSelectedWarehouse] = useState<IWarehouse | null>(
		null,
	);
	// #endregion
	const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

	// #region Stocks
	const [stockListState, setStockListState] = useState<{
		loading: boolean;
		stocks: IStock[];
		totalCount: number;
		page: number;
		count: number;
	}>({
		loading: true,
		stocks: [],
		totalCount: 0,
		page: 0,
		count: 50,
	});
	const fetchStocks = async (page: number, count: number) => {
		if (selectedWarehouse == null) {
			return;
		}

		setStockListState((prev) => {
			return {
				...prev,
				loading: true,
			};
		});

		const result = await StockFeature.stockAPI.listStock({
			warehouseId: selectedWarehouse._id.toString(),
			page,
			count,
		});

		if (result.status == "success") {
			setStockListState((prev) => {
				return {
					...prev,
					loading: false,
					stocks: result.stocks!,
					totalCount: result.totalCount!,
					page: page,
					count: count,
				};
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};
	// #endregion

	const [updateProductStockState, setUpdateProductStockState] = useState<{
		loading: boolean;
		quantity: number;
		stockId: string | null;
	}>({
		loading: false,
		quantity: 0,
		stockId: null,
	});
	const updateProductStock = async () => {
		if (updateProductStockState.stockId == null) {
			return;
		}

		if (updateProductStockState.quantity < 0) {
			message.error(
				t("dashboard:stock.modals.adjustStock.messages.not-negative"),
			);
			return;
		}

		setUpdateProductStockState((prev) => {
			return {
				...prev,
				loading: true,
			};
		});

		const result = await StockFeature.stockAPI.updateStock({
			quantity: updateProductStockState.quantity,
			stockId: updateProductStockState.stockId!,
		});

		if (result.status == "success") {
			await fetchStocks(0, 50);
			setUpdateProductStockState({
				loading: false,
				quantity: 0,
				stockId: null,
			});
			setSelectedProduct(null);
			message.success(t("dashboard:stock.modals.adjustStock.messages.success"));
		} else {
			message.error(t(`error-messages:${result.status}`));
		}

		setUpdateProductStockState((prev) => {
			return {
				...prev,
				loading: false,
			};
		});
	};

	useEffect(() => {
		// Fetch products and categories
		(async () => {
			await fetchStocks(0, 50);
			await fetchWarehouses();
			await fetchCategories();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (selectedWarehouse == null) {
			return;
		}

		// Fetch products stock
		fetchStocks(0, 50);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedWarehouse]);

	return (
		<AdminPageLayout selectedPage="warehouses">
			<Modal
				open={!!selectedProduct}
				onClose={() => {
					setSelectedProduct(null);
				}}
				onCancel={() => {
					setSelectedProduct(null);
				}}
				title={t("dashboard:stock.modals.adjustStock.title")}
				onOk={() => {
					updateProductStock();
				}}
				okText={t("dashboard:common.save")}
				cancelText={t("dashboard:common.cancel")}
				width={800}
				loading={updateProductStockState.loading}
				className="w-full"
			>
				<p>{t("dashboard:stock.modals.adjustStock.description")}</p>

				<div className="flex items-center gap-2 mt-4">
					<Image
						src={selectedProduct?.imageUrls[0]}
						alt={selectedProduct?.name}
						fallback="/item.png"
						width={100}
						height={100}
						className="rounded-md"
					/>
					<div className="gap-2 flex flex-col font-bold">
						<p>{selectedProduct?.name}</p>
						<p>{selectedWarehouse?.name}</p>
					</div>
				</div>

				<div className="mt-4">
					<p>{t("dashboard:stock.modals.adjustStock.quantity")}</p>

					<Input
						type="number"
						value={updateProductStockState.quantity}
						min={0}
						disabled={updateProductStockState.loading}
						onChange={(e) => {
							setUpdateProductStockState((prev) => {
								return {
									...prev,
									quantity: parseInt(e.target.value),
								};
							});
						}}
						placeholder={t(
							"dashboard:stock.modals.adjustStock.quantityPlaceholder",
						)}
						className="w-48"
					/>
				</div>
			</Modal>

			{/* Main content */}
			<div className="mb-2">
				{t("dashboard:common.loggedInAs", {
					name: account?.profile.name,
					email: account?.email.value,
				})}
			</div>

			<Title className="flex items-center gap-2">
				<FaBoxes />
				{t("dashboard:stock.page.title")}
			</Title>

			<Text>{t("dashboard:stock.page.description")}</Text>

			<div className="my-2 flex items-center gap-2">
				<Button
					variant="outlined"
					onClick={() => {
						navigate({
							to: "/dashboard/products",
						});
					}}
				>
					{t("dashboard:stock.page.manageProducts")}
				</Button>
				<Button
					variant="outlined"
					onClick={() => {
						navigate({
							to: "/dashboard/warehouses",
						});
					}}
				>
					{t("dashboard:stock.page.manageWarehouses")}
				</Button>
			</div>

			{/* Products */}
			<section className="mt-8">
				{/* Select the warehouse */}
				<div className="mt-4 flex items-center gap-6">
					<div className="flex items-center justify-center gap-2">
						<p>{t("dashboard:stock.selectWarehouse")}</p>
						<Select
							className="w-48"
							onChange={(e) => {
								setSelectedWarehouse(
									warehouses?.find((w) => w._id == e) ?? null,
								);
							}}
							onClear={async () => {
								setSelectedWarehouse(null);
							}}
							allowClear={true}
							options={warehouses?.map((warehouse) => {
								return {
									label: warehouse.name,
									value: warehouse._id.toString(),
								};
							})}
						/>
					</div>
				</div>

				{selectedWarehouse == null && (
					<Text>{t("dashboard:stock.notice")}</Text>
				)}

				{selectedWarehouse != null && (
					<Table
						className="mt-4 overflow-x-scroll"
						dataSource={stockListState.stocks}
						rowKey="_id"
						loading={stockListState.loading}
						pagination={{
							pageSize: stockListState.count,
							total: stockListState.totalCount,
							current: stockListState.page + 1,
							showSizeChanger: true,
							pageSizeOptions: [10, 20, 50, 100],
							onChange: (page, pageSize) => {
								fetchStocks(page - 1, pageSize);
							},
							onShowSizeChange: (page, pageSize) => {
								fetchStocks(page - 1, pageSize);
							},
						}}
						columns={[
							{
								title: t("dashboard:stock.table.product"),
								dataIndex: "product",
								key: "product",
								render: (product: IProduct) => {
									return (
										<div className="flex items-center gap-2">
											<Image
												src={product.imageUrls[0]}
												alt={product.name}
												fallback="/item.png"
												width={40}
												height={40}
												className="rounded-md"
											/>
											<p>{product.name}</p>
										</div>
									);
								},
							},
							{
								title: t("dashboard:stock.table.barcode"),
								dataIndex: "product",
								key: "barcode",
								render: (product: IProduct) => {
									return (
										<span className="flex items-center gap-2">
											<FaBarcode /> {product.barcode}
										</span>
									);
								},
							},
							{
								title: t("dashboard:stock.table.category"),
								dataIndex: "product",
								key: "category",
								render: (product: IProduct) => {
									return (
										<p>
											{
												categoryListState?.find(
													(c) =>
														c._id.toString() ==
														(product.category as unknown as string),
												)?.name
											}
										</p>
									);
								},
							},
							{
								title: t("dashboard:stock.table.quantity"),
								render: (_, stock: IStock) => {
									return (
										<p>
											{stock.stock} {(stock.product as IProduct).unit}
										</p>
									);
								},
							},
							{
								title: t("dashboard:stock.table.actions"),
								render: (_, stock: IStock) => {
									return (
										<div className="flex items-center gap-2">
											<Tooltip title={t("dashboard:stock.table.editStock")}>
												<Button
													variant="outlined"
													icon={<FaBoxes />}
													onClick={() => {
														setSelectedProduct(stock.product as IProduct);
														setUpdateProductStockState((prev) => {
															return {
																...prev,
																quantity: stock.stock,
																stockId: stock._id as unknown as string,
															};
														});
													}}
													disabled={
														!account ||
														!(
															account?.data.role.permissions.includes("*") ||
															account?.data.role.permissions.includes(
																"stock:update",
															)
														)
													}
												/>
											</Tooltip>
										</div>
									);
								},
							},
						]}
					/>
				)}
			</section>
		</AdminPageLayout>
	);
}
