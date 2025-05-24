import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import dayjs from "dayjs";
import mongoose from "mongoose";

import { ReactBarcode } from "react-jsbarcode";
import jsBarcode from "jsbarcode";
import jsPDF from "jspdf";

import CategoriesFeature from "../../../features/categories";
import ProductsFeature from "../../../features/products";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

import {
	Image,
	Button,
	Input,
	Modal,
	Upload,
	Drawer,
	Select,
	Switch,
	Tag,
	Table,
	Tooltip,
	Typography,
	Collapse,
	InputNumber,
	Space,
	DatePicker,
	App,
} from "antd";
const { Text, Title } = Typography;

import AdminPageLayout from "../../../layouts/AdminLayout";

// Icons
import {
	FaPhotoVideo,
	FaPencilAlt,
	FaTrash,
	FaBox,
	FaDice,
	FaPlus,
	FaPrint,
	FaExclamationTriangle,
	FaBarcode,
	FaSearch,
	FaFilter,
} from "react-icons/fa";
import { LuSlidersHorizontal } from "react-icons/lu";

export const Route = createFileRoute("/dashboard/products/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { account } = useSelector((state: RootState) => state.auth);
	const { config } = useSelector((state: RootState) => state.config);

	const navigate = useNavigate();
	const { message } = App.useApp();
	const { t } = useTranslation(["main", "dashboard"]);

	// #region Categories
	interface ListCategory {
		_id: string;
		name: string;
		deleted: boolean;
	}
	const [categories, setCategories] = useState<ListCategory[] | null>(null);
	const fetchCategories = async () => {
		const result = await CategoriesFeature.categoriesAPI.list({
			count: 100,
			page: 0,
			fields: ["_id", "name", "deleted"],
			includeDeleted: true, // So we can show the user the categories that are deleted  and that they need to change
		});

		if (result.status == "success") {
			setCategories(
				result.categories!.map((category) => {
					return {
						_id: category._id.toString(),
						name: `${category.name} ${category.deleted ? "(DEL)" : ""}`,
						deleted: category.deleted,
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
	// const [listCategories, setListCategories] = useState<ListCategory[]>([]);
	// const newFetchCategories = async (categoryIds: []) => {
	// 	// Remove duplicates
	// 	const categoriesWithoutDuplicates = Array.from(new Set(categoryIds));
	//
	// 	const result = await CategoriesFeature.categoriesAPI.get({
	// 		categoryIds: categoriesWithoutDuplicates,
	// 		fields: ["name", "_id"],
	// 	});
	//
	// 	if (result.status == "success") {
	//      setListCategories()
	// 	}
	// };

	interface ListProduct {
		_id: string;
		sku: string;
		description: string;
		imageUrls: string[];
		barcode: string;
		name: string;
		categoryId: string;
		sellingPrice: number;
		costPrice: number;
		createdAt: Date;
		subcategories: string[];
		tags: string[];
		deleted: boolean;
	}
	const [products, setProducts] = useState<{
		products: ListProduct[];
		totalProducts: number;
	}>({
		products: [],
		totalProducts: 0,
	});

	const [productListState, setProductListState] = useState<{
		loading: boolean;
		page: number;
		count: number;
		filters: {
			type?: "physical" | "digital";
			tags?: string[];
			subcategories?: string[];
			category?: string;
			createdAtStart?: string;
			createdAtEnd?: string;
			priceRangeStart?: number;
			priceRangeEnd?: number;
		};
		search?: {
			query: string;
			searchIn: Array<"tags" | "name" | "barcode" | "description" | "sku">;
		};
		showDeleted?: boolean;
		sort?: {
			order: "asc" | "desc";
			by: "name" | "sellingPrice" | "costPrice" | "createdAt";
		};
	}>({
		loading: true,
		page: 0,
		count: 10,
		filters: {},
	});

	// Setting to "null" removes the selected field from the query
	type NullableProductListState = {
		[K in keyof typeof productListState]?: (typeof productListState)[K] | null;
	};
	const fetchProducts = async ({
		count = productListState.count,
		page = productListState.page,
		filters = productListState.filters,
		search = productListState.search,
		sort = productListState.sort,
		showDeleted = productListState.showDeleted,
	}: NullableProductListState) => {
		setProductListState({
			...productListState,
			loading: true,
		});

		const result = await ProductsFeature.productsAPI.list({
			count: count as number,
			page: page as number,
			fields: [
				"_id",
				"name",
				"description",
				"imageUrls",
				"barcode",
				"sku",
				"category",
				"costPrice",
				"sellingPrice",
				"createdAt",
				"description",
				"type",
				"tags",
				"subcategories",
				"deleted",
			],
			search: search == null ? undefined : search,
			filters: filters == null ? undefined : filters,
			sort: sort == null ? undefined : sort,
			showDeleted: showDeleted == null ? undefined : showDeleted,
		});

		if (result.status == "success") {
			setProductListState({
				...productListState,
				count: count as number,
				page: page as number,
				filters: filters == null ? {} : filters,
				sort: sort == null ? undefined : sort,
				search: search == null ? undefined : search,
				showDeleted: showDeleted == null ? undefined : showDeleted,
				loading: false,
			});

			setProducts({
				products: result.products!.map((product) => {
					return {
						...product,
						_id: product._id.toString(),
						categoryId: (
							product.category as unknown as mongoose.Types.ObjectId
						).toString(),
						subcategories: product.subcategories.map((category) =>
							category.toString(),
						),
					};
				}),
				totalProducts: result.totalProducts!,
			});
		} else {
			setProductListState({
				...productListState,
				loading: false,
			});
			message.error(t(`error-messages:${result.status}`));
		}
	};

	// Create
	const [createProductModalState, setCreateProductModalState] = useState<{
		isOpen: boolean;
		loading: boolean;

		name: string;
		category: {
			name: string;
			_id: string;
		};
		barcode: string;
		sellingPrice: number;
		costPrice: number;
	}>({
		isOpen: false,
		loading: false,

		name: "",
		category: {
			name: "",
			_id: "",
		},
		barcode: "",
		sellingPrice: 0,
		costPrice: 0,
	});
	const createProductSchema = z
		.object({
			name: z
				.string()
				.min(1, { message: "invalid-name" })
				.max(100, { message: "invalid-name" }),
			barcode: z.string().regex(/^\d+$/).min(1).max(15).optional(),
			category: z.string({ message: "invalid-category" }),
			sellingPrice: z.number().positive({ message: "invalid-selling-price" }),
			costPrice: z.number().positive({ message: "invalid-cost-price" }),
		})
		.refine((data) => data.sellingPrice >= data.costPrice, {
			message: "price-lower-than-cost",
		});
	const createProduct = async () => {
		if (createProductModalState.loading) return;
		setCreateProductModalState((prev) => ({
			...prev,
			loading: true,
		}));

		const parsedData = createProductSchema.safeParse({
			name: createProductModalState.name.trim(),
			barcode:
				createProductModalState.barcode == ""
					? undefined
					: createProductModalState.barcode,
			category: createProductModalState.category._id,
			sellingPrice: createProductModalState.sellingPrice,
			costPrice: createProductModalState.costPrice,
		});

		if (!parsedData.success) {
			for (const issue of parsedData.error.issues) {
				message.warning(
					t(`dashboard:products.modals.create.messages.${issue.message}`),
				);
			}

			setCreateProductModalState((prev) => ({
				...prev,
				loading: false,
			}));
			return;
		}

		const result = await ProductsFeature.productsAPI.create(parsedData.data);
		if (result.status == "success") {
			message.success(t("dashboard:products.modals.create.messages.success"));
			setCreateProductModalState({
				loading: false,
				isOpen: false,
				name: "",
				barcode: "",
				category: {
					name: "",
					_id: "",
				},
				sellingPrice: 0,
				costPrice: 0,
			});

			await fetchProducts({
				page: 0,
			});
		} else {
			setCreateProductModalState((prev) => ({
				...prev,
				loading: false,
			}));
			message.error(t(`error-messages:${result.status}`));
		}
	};

	// Update
	const [updateProductDrawerState, setUpdateProductDrawerState] = useState<{
		productId?: string;

		// Product information
		name: string;
		description: string;
		barcode: string;
		imageUrls: string[];

		// Categories
		category: {
			name: string; // For showing purposes
			_id: string; // For backend reference
		};
		subcategories: {
			name: string; // For showing purposes
			_id: string; // For backend reference
		}[];

		type: "physical" | "digital";
		unit: string; // Unit of measurement
		showingPhysicalInformation: boolean;
		physicalInformation?: {
			width: number;
			height: number;
			depth: number;
			weight: number;
		};

		// Prices
		sellingPrice: number;
		costPrice: number;
		taxIncluded: boolean;

		// Extra fields
		tags: string[];
		 
		metadata: Record<string, any>;
	}>({
		productId: undefined,

		name: "",
		description: "",
		barcode: "",
		imageUrls: [],

		// Categories
		category: {
			name: "", // For showing purposes
			_id: "", // For backend reference
		},
		subcategories: [], // Array of IDs referencing the subcategories

		// Product information
		type: "physical", // Type of product
		unit: "Unit", // Unit of measurement
		showingPhysicalInformation: false,
		physicalInformation: {
			width: 0,
			height: 0,
			depth: 0,
			weight: 0,
		},

		// Prices
		sellingPrice: 0,
		costPrice: 0,
		taxIncluded: false,

		// Extra fields
		tags: [],
		metadata: {},
	});
	const updateProductSchema = z
		.object({
			name: z
				.string()
				.min(1, { message: "invalid-name" })
				.max(100, { message: "invalid-name" }),
			description: z
				.string()
				.max(400, { message: "invalid-description" })
				.optional(),

			barcode: z.string().regex(/^\d+$/).min(1).max(15).optional(),

			imageUrls: z.array(z.string(), { message: "invalid-image-urls" }),

			category: z.string({ message: "invalid-category" }),
			subcategories: z
				.array(z.string(), { message: "invalid-subcategories" })
				.optional(),

			type: z.enum(["physical", "digital"], {
				message: "invalid-type",
			}),
			unit: z.string().min(1, { message: "invalid-unit" }),

			physicalInformation: z
				.object(
					{
						width: z.number().min(0, { message: "invalid-dimensions" }),
						height: z.number().min(0, { message: "invalid-dimensions" }),
						depth: z.number().min(0, { message: "invalid-dimensions" }),
						weight: z.number().min(0, { message: "invalid-weight" }),
					},
					{ message: "invalid-physical-info" },
				)
				.optional(),

			sellingPrice: z.number().positive({ message: "invalid-selling-price" }),
			costPrice: z.number().positive({ message: "invalid-cost-price" }),
			taxIncluded: z.boolean({ message: "invalid-tax-included" }).optional(),

			tags: z
				.array(
					z
						.string()
						.max(16, { message: "invalid-tag" })
						.min(1, { message: "invalid-tag" }),
					{ message: "invalid-tags" },
				)
				.optional(),
			metadata: z
				.record(z.unknown(), { message: "invalid-metadata" })
				.optional(),
		})
		.refine((data) => data.sellingPrice >= data.costPrice, {
			message: "price-lower-than-cost",
			path: ["sellingPrice"], // attach warning to sellingPrice
		});
	const updateProduct = async () => {
		if (!updateProductDrawerState.productId) return;

		const parsedData = updateProductSchema.safeParse({
			name: updateProductDrawerState.name,
			description: updateProductDrawerState.description,
			barcode:
				updateProductDrawerState.barcode == ""
					? undefined
					: updateProductDrawerState.barcode,
			imageUrls: updateProductDrawerState.imageUrls,
			category: updateProductDrawerState.category._id,
			subcategories: updateProductDrawerState.subcategories.map(
				(subcategory) => subcategory._id,
			),
			type: updateProductDrawerState.type,
			unit: updateProductDrawerState.unit,
			physicalInformation: updateProductDrawerState.showingPhysicalInformation
				? {
						width: updateProductDrawerState.physicalInformation!.width,
						height: updateProductDrawerState.physicalInformation!.height,
						depth: updateProductDrawerState.physicalInformation!.depth,
						weight: updateProductDrawerState.physicalInformation!.weight,
					}
				: undefined,
			sellingPrice: updateProductDrawerState.sellingPrice,
			costPrice: updateProductDrawerState.costPrice,
			taxIncluded: updateProductDrawerState.taxIncluded,
			tags: updateProductDrawerState.tags,
			metadata: updateProductDrawerState.metadata,
		});

		if (!parsedData.success) {
			for (const issue of parsedData.error.issues) {
				message.warning(
					t(`dashboard:products.modals.update.messages.${issue.message}`),
				);
			}
			return;
		}

		const result = await ProductsFeature.productsAPI.update({
			productId: updateProductDrawerState.productId,
			...parsedData.data,
		});

		if (result.status == "success") {
			message.success(t("dashboard:products.modals.update.messages.success"));

			setUpdateProductDrawerState({
				...updateProductDrawerState,
				productId: undefined,
			});

			await fetchProducts({
				page: 0,
			});
		} else if (result.status == "barcode-already-exists") {
			message.warning(
				t("dashboard:products.modals.update.messages.barcode-already-exists"),
			);
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	// Delete
	const [deleteProductModalState, setDeleteProductModalState] = useState<{
		productId?: string;
	}>({
		productId: undefined,
	});
	const deleteProduct = async () => {
		if (deleteProductModalState.productId == undefined) return;

		const result = await ProductsFeature.productsAPI.delete({
			productId: deleteProductModalState.productId,
		});

		if (result.status == "success") {
			message.success(t("dashboard:products.modals.delete.messages.success"));
			setDeleteProductModalState({
				productId: undefined,
			});
			await fetchProducts({
				page: 0,
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	// Generate the barcode
	const [generateBarcodeModalState, setGenerateBarcodeModalState] = useState<{
		selectedProductBarcode: string | null;
		count: number;
	}>({
		selectedProductBarcode: null,
		count: 1,
	});

	// Fetchs
	useEffect(() => {
		// Fetch products and categories
		(async () => {
			await fetchProducts({
				page: 0,
			});
			await fetchCategories();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AdminPageLayout selectedPage="products">
			{/* Create product drawer */}
			<Modal
				onCancel={() =>
					setCreateProductModalState({
						// Reset all the state
						isOpen: false,
						loading: false,
						name: "",
						barcode: "",
						category: {
							name: "",
							_id: "",
						},
						sellingPrice: 0,
						costPrice: 0,
					})
				}
				open={createProductModalState.isOpen}
				title={t("dashboard:products.modals.create.create")}
				footer={
					<div className="flex justify-end gap-2">
						<Button
							onClick={() => {
								setCreateProductModalState({
									// Reset all the state
									isOpen: false,
									loading: false,
									name: "",
									barcode: "",
									category: {
										name: "",
										_id: "",
									},
									sellingPrice: 0,
									costPrice: 0,
								});
							}}
						>
							{t("dashboard:common.cancel")}
						</Button>

						<Button
							variant="solid"
							type="primary"
							onClick={() => {
								createProduct();
							}}
							loading={createProductModalState.loading}
							disabled={createProductModalState.loading}
							icon={<FaPlus />}
						>
							{t("dashboard:products.modals.create.create")}
						</Button>
					</div>
				}
			>
				<p>{t("dashboard:products.modals.create.description")}</p>

				{/* Name */}
				<div>
					<p>{t("dashboard:products.modals.create.name")}</p>
					<Input
						onChange={(e) => {
							setCreateProductModalState({
								...createProductModalState,
								name: e.target.value,
							});
						}}
						value={createProductModalState.name}
						placeholder={t("dashboard:products.modals.create.namePlaceholder")}
					/>
				</div>

				{/* Barcode */}
				<div className="mt-2">
					<p>{t("dashboard:products.modals.create.barcode")}</p>
					<div className="flex items-center justify-center gap-2">
						<Input
							onChange={(e) => {
								setCreateProductModalState({
									...createProductModalState,
									barcode: e.target.value,
								});
							}}
							value={createProductModalState.barcode}
							placeholder={t(
								"dashboard:products.modals.create.barcodePlaceholder",
							)}
						/>

						<Tooltip
							title={t(
								"dashboard:products.modals.create.generateBarcodeTooltip",
							)}
						>
							<Button
								variant="solid"
								type="primary"
								onClick={async () => {
									const result =
										await ProductsFeature.productsUtils.generateBarcode();
									if (result.status == "success") {
										setCreateProductModalState({
											...createProductModalState,
											barcode: result.barcode!,
										});
									}
								}}
								icon={<FaDice />}
							></Button>
						</Tooltip>
					</div>
				</div>

				<div className="mt-2">
					<p>{t("dashboard:products.modals.create.category")}</p>
					<Select
						onChange={(value) => {
							setCreateProductModalState({
								...createProductModalState,
								category: {
									_id: value,
									name: categories!.find((cat) => cat._id == value)!.name,
								},
							});
						}}
						options={
							categories == null
								? []
								: categories.map((category) => {
										return {
											label: category.name,
											value: category._id.toString(),
										};
									})
						}
						value={createProductModalState.category._id}
						className="w-full"
						placeholder={t(
							"dashboard:products.modals.create.categoryPlaceholder",
						)}
					/>
				</div>

				<div className="mt-2">
					<p>{t("dashboard:products.modals.create.sellingPrice")}</p>
					<Input
						type="number"
						onChange={(e) => {
							setCreateProductModalState({
								...createProductModalState,
								sellingPrice: parseInt(e.target.value),
							});
						}}
						addonBefore={config?.currencySymbol}
						value={createProductModalState.sellingPrice}
						placeholder={t(
							"dashboard:products.modals.create.sellingPricePlaceholder",
						)}
					/>
				</div>

				<div className="mt-4">
					<p>{t("dashboard:products.modals.create.costPrice")}</p>
					<Input
						type="number"
						onChange={(e) => {
							setCreateProductModalState({
								...createProductModalState,
								costPrice: parseInt(e.target.value),
							});
						}}
						addonBefore={config?.currencySymbol}
						value={createProductModalState.costPrice}
						placeholder={t(
							"dashboard:products.modals.create.costPricePlaceholder",
						)}
					/>
				</div>
			</Modal>

			{/* Update product drawer */}
			<Drawer
				onClose={() => {
					setUpdateProductDrawerState({
						...updateProductDrawerState,
						productId: undefined,
					});
				}}
				open={updateProductDrawerState.productId !== undefined}
				title={t("dashboard:products.modals.update.title")}
				width={1000}
				extra={
					<div className="flex items-center gap-2">
						<Button
							variant="solid"
							type="primary"
							onClick={() => {
								updateProduct();
							}}
							icon={<FaPlus />}
						>
							{t("dashboard:common.save")}
						</Button>
					</div>
				}
			>
				<div>
					<ReactBarcode
						value={
							updateProductDrawerState.barcode == ""
								? "000"
								: updateProductDrawerState.barcode
						}
					/>
				</div>

				{/* Basic Information */}
				<Collapse
					defaultActiveKey={["1"]}
					className="mt-4 w-full"
					items={[
						{
							key: "1",
							label: t("dashboard:products.modals.update.general.title"),
							children: (
								<div>
									<div>
										<p>{t("dashboard:products.modals.update.general.name")}</p>
										<Input
											onChange={(e) => {
												setUpdateProductDrawerState({
													...updateProductDrawerState,
													name: e.target.value,
												});
											}}
											value={updateProductDrawerState.name}
											placeholder={t(
												"dashboard:products.modals.update.general.namePlaceholder",
											)}
										/>
									</div>

									<div className="mt-2">
										<p>
											{t(
												"dashboard:products.modals.update.general.description",
											)}
										</p>
										<Input
											onChange={(e) => {
												setUpdateProductDrawerState({
													...updateProductDrawerState,
													description: e.target.value,
												});
											}}
											value={updateProductDrawerState.description}
											placeholder={t(
												"dashboard:products.modals.update.general.descriptionPlaceholder",
											)}
										/>
									</div>

									<div className="mt-2">
										<p>
											{t("dashboard:products.modals.update.general.barcode")}
										</p>

										<div className="flex gap-2 items-center justify-center">
											<Input
												onChange={(e) => {
													setUpdateProductDrawerState({
														...updateProductDrawerState,
														barcode: e.target.value,
													});
												}}
												value={updateProductDrawerState.barcode}
												placeholder={t(
													"dashboard:products.modals.update.general.barcodePlaceholder",
												)}
											/>

											<Tooltip
												title={t(
													"dashboard:products.modals.update.general.generateBarcode",
												)}
											>
												<Button
													variant="solid"
													type="primary"
													onClick={async () => {
														const result =
															await ProductsFeature.productsUtils.generateBarcode();
														if (result.status == "success") {
															setUpdateProductDrawerState({
																...updateProductDrawerState,
																barcode: result.barcode!,
															});
														}
													}}
													icon={<FaDice />}
												></Button>
											</Tooltip>
										</div>
									</div>

									<div className="mt-2">
										<p>
											{t("dashboard:products.modals.update.general.images")}
										</p>
										<Upload
											listType="picture"
											accept="image/*"
											multiple
											maxCount={5}
											withCredentials={true}
											data={{
												folder: "products",
												tags: ["product-image"],
											}}
											action={`${import.meta.env.VITE_SERVER_URL}/api/admin/files/upload`}
											onChange={(info) => {
												if (info.file.status == "done") {
													setUpdateProductDrawerState({
														...updateProductDrawerState,
														imageUrls:
															updateProductDrawerState.imageUrls.concat(
																info.file.response.fileUrl,
															),
													});
												}
											}}
											showUploadList={false}
										>
											<Button icon={<FaPhotoVideo />}>
												{t(
													"dashboard:products.modals.update.general.imagesUpload",
												)}
											</Button>
										</Upload>

										<div className="mt-2">
											<p>
												{t(
													"dashboard:products.modals.update.general.currentImagesPreview",
												)}
											</p>
											<div className="flex gap-2">
												{updateProductDrawerState.imageUrls.map((url) => {
													return (
														<div
															className="flex gap-2 flex-col items-center justify-center"
															key={url}
														>
															<Image
																fallback={"/item.png"}
																src={`${import.meta.env.VITE_SERVER_URL}${url}`}
																alt="Product Image"
																className="w-20 h-20 object-cover rounded-lg"
																width={80}
																height={80}
															/>
															<Tooltip
																title={t(
																	"dashboard:products.modals.update.general.deleteImageTooltip",
																)}
															>
																<Button
																	variant="solid"
																	color="red"
																	onClick={() => {
																		setUpdateProductDrawerState({
																			...updateProductDrawerState,
																			imageUrls:
																				updateProductDrawerState.imageUrls.filter(
																					(imageUrl) => imageUrl !== url,
																				),
																		});
																	}}
																	icon={<FaTrash />}
																/>
															</Tooltip>
														</div>
													);
												})}
											</div>
										</div>
									</div>
								</div>
							),
						},
						{
							key: "2",
							label: (
								<span className="flex items-center">
									{t("dashboard:products.modals.update.categories.title")}
									{categories?.find(
										(cat) => cat._id == updateProductDrawerState.category._id,
									)?.deleted && (
										<Tooltip title={t("dashboard:common.actionNecessary")}>
											<FaExclamationTriangle className="ml-2 text-red-500" />
										</Tooltip>
									)}
								</span>
							),
							children: (
								<div>
									<div>
										<p>
											{t(
												"dashboard:products.modals.update.categories.category",
											)}
										</p>
										<Select
											onChange={(value) => {
												setUpdateProductDrawerState({
													...updateProductDrawerState,
													category: {
														name:
															categories!.find(
																(category) => category._id == value,
															)?.name || "",
														_id: value,
													},
												});
											}}
											options={
												categories == null
													? []
													: categories
															.filter((i) => !i.deleted)
															.map((category) => {
																return {
																	label: category.name,
																	value: category._id,
																};
															})
											}
											value={updateProductDrawerState.category._id}
											className="w-full"
											placeholder={t(
												"dashboard:products.modals.update.categories.selectCategory",
											)}
										/>
									</div>
									<div className="mt-2">
										<p>
											{t(
												"dashboard:products.modals.update.categories.subcategories",
											)}
										</p>
										<Select
											mode="tags"
											onChange={(value) => {
												const result = value.map((val) => {
													return {
														name:
															categories!.find(
																(category) => category._id == val,
															)?.name || "",
														_id: val,
													};
												});

												setUpdateProductDrawerState({
													...updateProductDrawerState,
													subcategories: result,
												});
											}}
											options={
												categories == null
													? []
													: categories
															.filter(
																(category) =>
																	category._id !==
																	updateProductDrawerState.category._id,
															)
															.map((category) => {
																return {
																	label: category.name,
																	value: category._id,
																};
															})
											}
											value={updateProductDrawerState.subcategories.map(
												(subcat) => subcat._id,
											)}
											className="w-full"
											placeholder={t(
												"dashboard:products.modals.update.categories.selectSubcategories",
											)}
										/>
									</div>
								</div>
							),
						},
						{
							key: "3",
							label: t(
								"dashboard:products.modals.update.productInformation.title",
							),
							children: (
								<div>
									<div>
										<p>
											{t(
												"dashboard:products.modals.update.productInformation.type",
											)}
										</p>
										<Select
											placeholder={t(
												"dashboard:products.modals.update.productInformation.typePlaceholder",
											)}
											className="w-full"
											value={updateProductDrawerState.type}
											onChange={(type) => {
												setUpdateProductDrawerState({
													...updateProductDrawerState,
													type,
												});
											}}
											options={[
												{
													label: t(
														"dashboard:products.modals.update.productInformation.physical",
													),
													value: "physical",
												},
												{
													label: t(
														"dashboard:products.modals.update.productInformation.digital",
													),
													value: "digital",
												},
											]}
										/>
									</div>
									<div className="mt-2">
										<p>
											{t(
												"dashboard:products.modals.update.productInformation.unit",
											)}
										</p>
										<Input
											onChange={(e) => {
												setUpdateProductDrawerState({
													...updateProductDrawerState,
													unit: e.target.value,
												});
											}}
											value={updateProductDrawerState.unit}
											placeholder={t(
												"dashboard:products.modals.update.productInformation.unitPlaceholder",
											)}
										/>
									</div>
									<div className="mt-2">
										<p>
											{t(
												"dashboard:products.modals.update.productInformation.physicalInformation",
											)}
										</p>
										<Switch
											value={
												updateProductDrawerState.showingPhysicalInformation
											}
											onChange={(value) => {
												setUpdateProductDrawerState({
													...updateProductDrawerState,
													showingPhysicalInformation: value,
												});
											}}
										/>

										{updateProductDrawerState.showingPhysicalInformation && (
											<div>
												<div className="mt-2 flex flex-1 items-center justify-center gap-2">
													<div className="flex-1">
														<p>
															{t(
																"dashboard:products.modals.update.productInformation.width",
															)}
														</p>
														<Input
															type="number"
															onChange={(e) => {
																setUpdateProductDrawerState({
																	...updateProductDrawerState,
																	physicalInformation: {
																		...updateProductDrawerState.physicalInformation,
																		width: parseInt(e.target.value),
																	} as {
																		width: number;
																		height: number;
																		depth: number;
																		weight: number;
																	},
																});
															}}
															value={
																updateProductDrawerState.physicalInformation!
																	.width
															}
															placeholder={t(
																"dashboard:products.modals.update.productInformation.width",
															)}
														/>
													</div>

													<div className="flex-1">
														<p>
															{t(
																"dashboard:products.modals.update.productInformation.height",
															)}
														</p>
														<Input
															type="number"
															onChange={(e) => {
																setUpdateProductDrawerState({
																	...updateProductDrawerState,
																	physicalInformation: {
																		...updateProductDrawerState.physicalInformation,
																		height: parseInt(e.target.value),
																	} as {
																		width: number;
																		height: number;
																		depth: number;
																		weight: number;
																	},
																});
															}}
															value={
																updateProductDrawerState.physicalInformation!
																	.height
															}
															placeholder={t(
																"dashboard:products.modals.update.productInformation.height",
															)}
														/>
													</div>

													<div className="flex-1">
														<p>
															{t(
																"dashboard:products.modals.update.productInformation.depth",
															)}
														</p>
														<Input
															type="number"
															onChange={(e) => {
																setUpdateProductDrawerState({
																	...updateProductDrawerState,
																	physicalInformation: {
																		...updateProductDrawerState.physicalInformation,
																		depth: parseInt(e.target.value),
																	} as {
																		width: number;
																		height: number;
																		depth: number;
																		weight: number;
																	},
																});
															}}
															value={
																updateProductDrawerState.physicalInformation!
																	.depth
															}
															placeholder={t(
																"dashboard:products.modals.update.productInformation.depth",
															)}
														/>
													</div>

													<div className="flex-1">
														<p>
															{t(
																"dashboard:products.modals.update.productInformation.weight",
															)}
														</p>
														<Input
															type="number"
															onChange={(e) => {
																setUpdateProductDrawerState({
																	...updateProductDrawerState,
																	physicalInformation: {
																		...updateProductDrawerState.physicalInformation,
																		weight: parseInt(e.target.value),
																	} as {
																		width: number;
																		height: number;
																		depth: number;
																		weight: number;
																	},
																});
															}}
															value={
																updateProductDrawerState.physicalInformation!
																	.weight
															}
															placeholder={t(
																"dashboard:products.modals.update.productInformation.weight",
															)}
														/>
													</div>
												</div>
												<p>
													{t(
														"dashboard:products.modals.update.productInformation.physicalInformationNotice",
													)}
												</p>
											</div>
										)}
									</div>
								</div>
							),
						},
						{
							key: "4",
							label: t("dashboard:products.modals.update.prices.title"),
							children: (
								<div>
									<div>
										<p>
											{t(
												"dashboard:products.modals.update.prices.sellingPrice",
											)}
										</p>
										<Input
											type="number"
											addonBefore={config?.currencySymbol}
											onChange={(e) => {
												setUpdateProductDrawerState({
													...updateProductDrawerState,
													sellingPrice: parseInt(e.target.value ?? 0),
												});
											}}
											value={updateProductDrawerState.sellingPrice}
											placeholder={t(
												"dashboard:products.modals.update.prices.sellingPricePlaceholder",
											)}
										/>
									</div>

									<div className="mt-2">
										<p>
											{t("dashboard:products.modals.update.prices.costPrice")}
										</p>
										<Input
											type="number"
											addonBefore={config?.currencySymbol}
											onChange={(e) => {
												setUpdateProductDrawerState({
													...updateProductDrawerState,
													costPrice: parseInt(e.target.value ?? 0),
												});
											}}
											value={updateProductDrawerState.costPrice}
											placeholder={t(
												"dashboard:products.modals.update.prices.costPricePlaceholder",
											)}
										/>
									</div>

									<div className="mt-2">
										<p>
											{t("dashboard:products.modals.update.prices.taxIncluded")}
										</p>
										<Switch
											value={updateProductDrawerState.taxIncluded}
											onChange={(tags) => {
												setUpdateProductDrawerState({
													...updateProductDrawerState,
													taxIncluded: tags,
												});
											}}
										/>
									</div>
								</div>
							),
						},
					]}
				/>
			</Drawer>

			{/* Delete product modal */}
			<Modal
				title={t("dashboard:products.modals.delete.title")}
				open={deleteProductModalState.productId !== undefined}
				onOk={() => {
					deleteProduct();
				}}
				onCancel={() => {
					setDeleteProductModalState({
						productId: undefined,
					});
				}}
				okButtonProps={{
					color: "red",
					variant: "solid",
				}}
				okText={t("dashboard:common.delete")}
			>
				<p>{t("dashboard:products.modals.delete.description")}</p>
			</Modal>

			{/* Generate barcode PDF modal */}
			<Modal
				title={t("dashboard:products.modals.generateBarcode.title")}
				open={generateBarcodeModalState.selectedProductBarcode !== null}
				onOk={() => {
					try {
						if (!generateBarcodeModalState.selectedProductBarcode) return;
						if (generateBarcodeModalState.count < 1) {
							message.error(
								t(
									"dashboard:products.modals.generateBarcode.messages.invalid-count",
								),
							);
							return;
						}

						const doc = new jsPDF();
						doc.setFontSize(16);
						doc.text(
							t("dashboard:products.modals.generateBarcode.title"),
							10,
							10,
						);

						const canvas = document.createElement("canvas");
						jsBarcode(
							canvas,
							generateBarcodeModalState.selectedProductBarcode as string,
						);

						let column = 0;
						let codesInColumn = 0;
						for (let i = 0; i < generateBarcodeModalState.count; i++) {
							doc.addImage(
								canvas.toDataURL(),
								"JPEG",
								10 + column * 30,
								20 + codesInColumn * 22,
								25,
								20,
							);
							codesInColumn++;
							if (codesInColumn == 12) {
								codesInColumn = 0;
								column++;
							}
							if (column == 6) {
								doc.addPage();
								column = 0;
							}
						}

						message.success(
							t("dashboard:products.modals.generateBarcode.messages.success"),
						);

						doc.save(
							`barcodes-${generateBarcodeModalState.selectedProductBarcode!.toString()}.pdf`,
						);

						setGenerateBarcodeModalState({
							selectedProductBarcode: null,
							count: 1,
						});
					} catch (err: unknown) {
						message.error(
							t("dashboard:products.modals.generateBarcode.messages.error"),
						);
					}
				}}
				onClose={() => {
					setGenerateBarcodeModalState({
						selectedProductBarcode: null,
						count: 1,
					});
				}}
				onCancel={() => {
					setGenerateBarcodeModalState({
						selectedProductBarcode: null,
						count: 1,
					});
				}}
				okText={t("dashboard:products.modals.generateBarcode.generate")}
			>
				<div className="flex w-full items-center justify-center">
					<ReactBarcode
						value={
							generateBarcodeModalState.selectedProductBarcode == null
								? "000"
								: generateBarcodeModalState.selectedProductBarcode.toString()
						}
					/>
				</div>

				<div>
					<p>{t("dashboard:products.modals.generateBarcode.count")}</p>
					<InputNumber
						onChange={(value) => {
							setGenerateBarcodeModalState({
								...generateBarcodeModalState,
								count: value || 0,
							});
						}}
						className="w-full"
						value={generateBarcodeModalState.count}
						placeholder={t(
							"dashboard:products.modals.generateBarcode.countPlaceholder",
						)}
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
				<FaBox />
				{t("dashboard:products.page.title")}
			</Title>

			<Text>{t("dashboard:products.page.description")}</Text>

			<div className="my-2 flex items-center gap-2">
				<Button
					variant="solid"
					type="primary"
					onClick={() => {
						setCreateProductModalState({
							...createProductModalState,
							isOpen: true,
						});
					}}
					disabled={(() => {
						if (!account) return true;
						if (account.data.role.permissions.includes("*")) return false;
						if (account.data.role.permissions.includes("products:create"))
							return false;
						return true;
					})()}
				>
					{t("dashboard:products.page.createProduct")}
				</Button>
				<Button
					variant="outlined"
					onClick={() => {
						navigate({
							to: "/dashboard/products/categories",
						});
					}}
				>
					{t("dashboard:products.page.manageCategories")}
				</Button>
			</div>

			{/* Products list */}
			<Table
				className="mt-4"
				dataSource={products.products}
				sticky={{ offsetHeader: 0 }}
				scroll={{
					x: 2000,
					y: 5000,
				}}
				columns={[
					{
						title: t("dashboard:products.table.image"),
						dataIndex: "imageUrls",
						key: "imageUrls",
						render: (imageUrls) => (
							<Image
								src={`${import.meta.env.VITE_SERVER_URL}${imageUrls[0]}`}
								alt="Product Image"
								fallback="/item.png"
								width={32}
								height={32}
							/>
						),
					},
					{
						title: t("dashboard:products.table.barcode"),
						dataIndex: "barcode",
						render: (barcode) => {
							return (
								<div className="flex gap-2 items-center">
									<FaBarcode /> {barcode}
								</div>
							);
						},
						filterIcon: () => {
							const hasFilter =
								productListState.search?.searchIn.includes("barcode");
							return (
								<FaSearch className={`${hasFilter ? "text-blue-500" : ""}`} />
							);
						},
						filterDropdown: () => {
							return (
								<Space className="p-2 flex gap-2 items-center">
									<Input
										placeholder={t("dashboard:common.search")}
										value={productListState.search?.query}
										onChange={(e) => {
											setProductListState((prev) => {
												return {
													...prev,
													search: {
														query: e.target.value,
														searchIn: ["barcode"],
													},
												};
											});
										}}
									/>
									<Button
										type="primary"
										onClick={() => {
											fetchProducts({
												search: {
													query: productListState.search!.query,
													searchIn: ["barcode"],
												},
											});
										}}
									>
										{t("dashboard:common.search")}
									</Button>

									{productListState.search?.query && (
										<Button
											type="text"
											onClick={() => {
												setProductListState((prev) => {
													return {
														...prev,
														search: {
															query: "",
															searchIn: [],
														},
													};
												});

												fetchProducts({
													page: 0,
                          search: null
												});
											}}
										>
											{t("dashboard:common.reset")}
										</Button>
									)}
								</Space>
							);
						},
					},
					{
						title: t("dashboard:products.table.name"),
						dataIndex: "name",
						key: "name",
						filterIcon: () => {
							const hasFilter =
								productListState.search?.searchIn.includes("name");
							return (
								<FaSearch className={`${hasFilter ? "text-blue-500" : ""}`} />
							);
						},
						filterDropdown: () => {
							return (
								<Space className="p-2 flex gap-2 items-center">
									<Input
										placeholder={t("dashboard:common.search")}
										value={productListState.search?.query}
										onChange={(e) => {
											setProductListState((prev) => {
												return {
													...prev,
													search: {
														query: e.target.value,
														searchIn: ["name"],
													},
												};
											});
										}}
									/>
									<Button
										type="primary"
										onClick={() => {
											fetchProducts({
												search: {
													query: productListState.search!.query,
													searchIn: ["name"],
												},
											});
										}}
									>
										{t("dashboard:common.search")}
									</Button>

									{productListState.search?.query && (
										<Button
											type="text"
											onClick={() => {
												fetchProducts({
													page: 0,
													search: null,
												});
											}}
										>
											{t("dashboard:common.reset")}
										</Button>
									)}
								</Space>
							);
						},
					},
					{
						title: t("dashboard:products.table.description"),
						dataIndex: "description",
						key: "description",
						width: 500,
						render: (description) => {
							if (description.length == 0) {
								return (
									<span className="text-gray-500 italic">
										{t("dashboard:products.table.noDescription")}
									</span>
								);
							}
							return description;
						},
						filterIcon: () => {
							const hasFilter =
								productListState.search?.searchIn.includes("description");
							return (
								<FaSearch className={`${hasFilter ? "text-blue-500" : ""}`} />
							);
						},
						filterDropdown: () => {
							return (
								<Space className="p-2 flex gap-2 items-center">
									<Input
										placeholder={t("dashboard:common.search")}
										value={productListState.search?.query}
										onChange={(e) => {
											setProductListState((prev) => {
												return {
													...prev,
													search: {
														query: e.target.value,
														searchIn: ["description"],
													},
												};
											});
										}}
									/>
									<Button
										type="primary"
										onClick={() => {
											fetchProducts({
												search: {
													query: productListState.search!.query,
													searchIn: ["description"],
												},
											});
										}}
									>
										{t("dashboard:common.search")}
									</Button>

									{productListState.search?.query && (
										<Button
											type="text"
											onClick={() => {
												fetchProducts({
													page: 0,
													search: null,
												});
											}}
										>
											{t("dashboard:common.reset")}
										</Button>
									)}
								</Space>
							);
						},
					},
					{
						title: t("dashboard:products.table.sku"),
						dataIndex: "sku",
						key: "sku",
						filterIcon: () => {
							const hasFilter =
								productListState.search?.searchIn.includes("sku");
							return (
								<FaSearch className={`${hasFilter ? "text-blue-500" : ""}`} />
							);
						},
						filterDropdown: () => {
							return (
								<Space className="p-2 flex gap-2 items-center">
									<Input
										placeholder={t("dashboard:common.search")}
										value={productListState.search?.query}
										onChange={(e) => {
											setProductListState((prev) => {
												return {
													...prev,
													search: {
														query: e.target.value,
														searchIn: ["sku"],
													},
												};
											});
										}}
									/>
									<Button
										type="primary"
										onClick={() => {
											fetchProducts({
												search: {
													query: productListState.search!.query,
													searchIn: ["sku"],
												},
											});
										}}
									>
										{t("dashboard:common.search")}
									</Button>

									{productListState.search?.query && (
										<Button
											type="text"
											onClick={() => {
												fetchProducts({
													page: 0,
													search: null,
												});
											}}
										>
											{t("dashboard:common.reset")}
										</Button>
									)}
								</Space>
							);
						},
					},

					{
						title: t("dashboard:products.table.createdAt"),
						dataIndex: "createdAt",
						key: "createdAt",
						render: (createdAt) => {
							return createdAt
								? dayjs(createdAt).format("YYYY-MM-DD HH:mm")
								: "-";
						},
						filterIcon: () => {
							const hasFilter =
								productListState.filters.createdAtEnd !== undefined ||
								productListState.filters.createdAtStart !== undefined;
							return (
								<LuSlidersHorizontal
									className={`${hasFilter ? "text-blue-500" : ""}`}
								/>
							);
						},
						filterDropdown: () => {
							return (
								<Space className="p-2 flex gap-2 items-center">
									<DatePicker
										placeholder={t("dashboard:common.from")}
										format="YYYY-MM-DD HH:mm"
										showTime
										value={productListState.filters.createdAtStart}
										onChange={(date) => {
											setProductListState((prev) => {
												return {
													...prev,
													filters: {
														...prev.filters,
														createdAtStart: date == null ? undefined : date,
													},
												};
											});
										}}
									/>

									<DatePicker
										placeholder={t("dashboard:common.to")}
										format="YYYY-MM-DD HH:mm"
										showTime
										value={productListState.filters.createdAtEnd}
										onChange={(date) => {
											setProductListState((prev) => {
												return {
													...prev,
													filters: {
														...prev.filters,
														createdAtEnd: date == null ? undefined : date,
													},
												};
											});
										}}
									/>

									<Button
										type="primary"
										onClick={() => {
											fetchProducts({
												filters: {
													...productListState.filters,
													priceRangeStart:
														productListState.filters.priceRangeStart,
													priceRangeEnd: productListState.filters.priceRangeEnd,
												},
											});
										}}
									>
										{t("dashboard:common.filter")}
									</Button>
									<Button
										type="text"
										hidden={
											productListState.filters.createdAtStart == undefined &&
											productListState.filters.createdAtEnd == undefined
										}
										onClick={async () => {
											setProductListState((prev) => {
												return {
													...prev,
													filters: {
														createdAtStart: undefined,
														createdAtEnd: undefined,
													},
												};
											});
											await fetchProducts({
												page: 0,
												filters: {
													createdAtStart: undefined,
													createdAtEnd: undefined,
												},
											});
										}}
									>
										{t("dashboard:common.reset")}
									</Button>
								</Space>
							);
						},
					},
					{
						title: t("dashboard:products.table.category"),
						dataIndex: "categoryId",
						key: "categoryId",
						// Render the category because it is the category ID
						render: (category) => {
							const categoryData = categories?.find(
								(cat) => cat._id === category,
							);
							return categoryData ? (
								<span className="flex items-center">
									{categoryData.name}
									{categoryData.deleted && (
										<Tooltip
											title={t(
												"dashboard:products.table.missingCategoryTooltip",
											)}
										>
											<FaExclamationTriangle className="text-red-500 ml-1" />
										</Tooltip>
									)}
								</span>
							) : (
								""
							);
						},
						filterIcon: () => {
							const hasFilter = productListState.filters.category !== undefined;
							return (
								<FaFilter className={`${hasFilter ? "text-blue-500" : ""}`} />
							);
						},
						filterDropdown: () => {
							return (
								<Space className="p-2 flex gap-2 items-center">
									<Select
										placeholder={t(
											"dashboard:products.table.filterCategoryPlaceholder",
										)}
										allowClear
										onClear={() => {
											setProductListState((prev) => {
												return {
													...prev,
													filters: {
														...prev.filters,
														category: undefined,
													},
												};
											});

											fetchProducts({
												page: 0,
												filters: {
													...productListState.filters,
													category: undefined,
												},
											});
										}}
										value={productListState.filters.category}
										options={
											categories?.map((category) => {
												return {
													label: category.name,
													value: category._id,
												};
											}) ?? []
										}
										onChange={(val) => {
											setProductListState((prev) => {
												return {
													...prev,
													filters: {
														...prev.filters,
														category: val == null ? undefined : val,
													},
												};
											});
										}}
									/>

									<Button
										type="primary"
										onClick={() => {
											fetchProducts({
												page: 0,
												filters: {
													...productListState.filters,
													category: productListState.filters.category,
												},
											});
										}}
									>
										{t("dashboard:common.filter")}
									</Button>
								</Space>
							);
						},
					},
					{
						title: t("dashboard:products.table.subcategories"),
						dataIndex: "subcategories",
						key: "subcategories",
						render: (subcategories) => {
							// Filter out only those subcategories that exist in the categories list
							const validSubcategories = subcategories
								?.map((subcategory: string) =>
									categories?.find((cat) => cat._id === subcategory),
								)
								.filter(Boolean); // Remove undefined values

							return (
								<div className="flex flex-col gap-1">
									{validSubcategories && validSubcategories.length > 0 ? (
										validSubcategories.map(
											(subcategoryData: { name: string }, index: number) => (
												<Tag key={index}>{subcategoryData.name}</Tag>
											),
										)
									) : (
										<span className="text-gray-500 italic">
											{t("dashboard:products.table.noSubcategories") ||
												"No categories"}
										</span>
									)}
								</div>
							);
						},
					},

					{
						title: t("dashboard:products.table.sellingPrice"),
						dataIndex: "sellingPrice",
						key: "sellingPrice",
						render: (sellingPrice) => {
							return sellingPrice.toLocaleString("en-US", {
								style: "currency",
								currency: config?.currency ?? "USD",
							});
						},
						filterIcon: () => {
							const hasFilter =
								productListState.filters.priceRangeStart !== undefined ||
								productListState.filters.priceRangeEnd !== undefined;
							return (
								<LuSlidersHorizontal
									className={`${hasFilter ? "text-blue-500" : ""}`}
								/>
							);
						},
						filterDropdown: () => {
							return (
								<Space className="p-2 flex gap-2 items-center">
									<InputNumber
										placeholder={t("dashboard:common.min")}
										value={productListState.filters.priceRangeStart}
										addonBefore={config?.currencySymbol}
										onChange={(val) => {
											setProductListState((prev) => {
												return {
													...prev,
													filters: {
														...prev.filters,
														priceRangeStart:
															val == 0 || val == null || typeof val !== "number"
																? undefined
																: (val as number),
													},
												};
											});
										}}
									/>
									<InputNumber
										placeholder={t("dashboard:common.max")}
										value={productListState.filters.priceRangeEnd}
										addonBefore={config?.currencySymbol}
										onChange={(val) => {
											setProductListState((prev) => {
												return {
													...prev,
													filters: {
														...prev.filters,
														priceRangeEnd:
															val == 0 || val == null || typeof val !== "number"
																? undefined
																: (val as number),
													},
												};
											});
										}}
									/>
									<Button
										type="primary"
										onClick={() => {
											fetchProducts({
												filters: {
													...productListState.filters,
													priceRangeStart:
														productListState.filters.priceRangeStart,
													priceRangeEnd: productListState.filters.priceRangeEnd,
												},
											});
										}}
									>
										{t("dashboard:common.filter")}
									</Button>
									<Button
										type="text"
										hidden={
											productListState.filters.priceRangeEnd == undefined &&
											productListState.filters.priceRangeStart == undefined
										}
										onClick={async () => {
											setProductListState((prev) => {
												return {
													...prev,
													filters: {
														priceRangeEnd: undefined,
														priceRangeStart: undefined,
													},
												};
											});
											await fetchProducts({
												page: 0,
												filters: {
													priceRangeStart: undefined,
													priceRangeEnd: undefined,
												},
											});
										}}
									>
										{t("dashboard:common.reset")}
									</Button>
								</Space>
							);
						},
					},
					{
						title: t("dashboard:products.table.costPrice"),
						dataIndex: "costPrice",
						key: "costPrice",
						render: (costPrice) => {
							return costPrice.toLocaleString("en-US", {
								style: "currency",
								currency: config?.currency ?? "USD",
							});
						},
					},
					{
						title: t("dashboard:products.table.actions"),
						key: "actions",
						fixed: "right",
						render: (_text, record: ListProduct) =>
							!record.deleted ? (
								<div className="flex gap-2">
									<Tooltip
										title={t("dashboard:products.table.editTooltip")}
										placement="top"
									>
										<Button
											variant="outlined"
											onClick={async () => {
												const result = await ProductsFeature.productsAPI.get({
													productIds: [record._id],
												});

												if (result.status == "success") {
													const product = result.products![0];
													const productCategory = categories!.find(
														(category) =>
															category._id ===
															(
																product.category as mongoose.Types.ObjectId
															).toString(),
													)!;
													const productSubcategories =
														product.subcategories.map((subcategory) => {
															const categoryFound = categories!.find(
																(category) =>
																	category._id ===
																	(
																		subcategory as mongoose.Types.ObjectId
																	).toString(),
															);
															return {
																_id: subcategory.toString(),
																name: categoryFound!.name,
															};
														});

													// Why are we so sure that category exists?
													// This is because we fetch the categories given the product list

													setUpdateProductDrawerState({
														...updateProductDrawerState,
														productId: product._id.toString(),
														name: product.name,
														description: product.description,
														barcode: product.barcode,
														imageUrls: product.imageUrls,
														category: productCategory,
														subcategories: productSubcategories,
														showingPhysicalInformation:
															product.physicalInformation !== undefined,
														physicalInformation: product.physicalInformation,
														unit: product.unit,
														type: product.type,
														sellingPrice: product.sellingPrice,
														costPrice: product.costPrice,
														taxIncluded: product.taxIncluded,
														tags: product.tags,
													});
												} else {
													message.error(t(`error-messages:${result.status}`));
												}
											}}
											disabled={(() => {
												if (record.deleted) return true;
												if (account == null) return true;
												if (account.data.role.permissions.includes("*"))
													return false;
												return !account.data.role.permissions.includes(
													"products:update",
												);
											})()}
											icon={<FaPencilAlt />}
										/>
									</Tooltip>

									<Tooltip
										title={t("dashboard:products.table.printBarcodesTooltip")}
										placement="top"
									>
										<Button
											variant="outlined"
											disabled={record.deleted}
											onClick={() => {
												setGenerateBarcodeModalState({
													selectedProductBarcode: record.barcode,
													count: 1,
												});
											}}
											icon={<FaPrint />}
										/>
									</Tooltip>

									<Tooltip
										title={t("dashboard:products.table.deleteTooltip")}
										placement="top"
									>
										<Button
											variant="solid"
											color="red"
											type="primary"
											onClick={() => {
												setDeleteProductModalState({
													productId: record._id,
												});
											}}
											disabled={(() => {
												if (record.deleted) return true;
												if (account == null) return true;
												if (account.data.role.permissions.includes("*"))
													return false;
												return !account.data.role.permissions.includes(
													"products:delete",
												);
											})()}
											icon={<FaTrash />}
										/>
									</Tooltip>
								</div>
							) : (
								<Tooltip
									title={t("dashboard:products.table.deletedTooltip")}
									placement="top"
								>
									<Tag color="error">
										{t("dashboard:products.table.deleted")}
									</Tag>
								</Tooltip>
							),
					},
				]}
				loading={productListState.loading}
				pagination={{
					pageSize: productListState.count,
					current: productListState.page + 1,
					showTotal: (total, range) => {
						return t("dashboard:products.table.count", {
							total,
							range: `${range[0]}-${range[1]}`,
						});
					},
					total: products.totalProducts,
					onChange: (page, pageSize) => {
						fetchProducts({
							page: page - 1,
							count: pageSize,
						});
					},
				}}
				rowKey={(record) => record._id.toString()}
			/>

			<div className="flex mt-4 gap-2 items-center">
				<Switch
					id="page-show-deleted"
					checked={productListState.showDeleted}
					onChange={(value) => {
						fetchProducts({
							showDeleted: value,
						});
					}}
				/>

				<label htmlFor="page-show-deleted">
					{t("dashboard:products.page.showDeleted")}
				</label>
			</div>
		</AdminPageLayout>
	);
}
