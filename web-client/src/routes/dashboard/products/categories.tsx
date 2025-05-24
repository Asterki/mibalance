import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

import {
	Image,
	Button,
	Input,
	Modal,
	Drawer,
	Space,
	Select,
	Tooltip,
	Upload,
	Table,
	Tag,
	App,
	Typography,
	Switch,
} from "antd";
const { Title, Text } = Typography;

import AdminPageLayout from "../../../layouts/AdminLayout";
import {
	FaLayerGroup,
	FaPencilAlt,
	FaPhotoVideo,
	FaSearch,
	FaTrash,
} from "react-icons/fa";
import ImgCrop from "antd-img-crop";

import AdminFeature from "../../../features/admin";
import CategoriesFeature from "../../../features/categories";

export const Route = createFileRoute("/dashboard/products/categories")({
	component: RouteComponent,
});

function RouteComponent() {
	const { account } = useSelector((state: RootState) => state.auth);

	const { message } = App.useApp();
	const navigate = useNavigate();
	const { t } = useTranslation(["main", "dashboard"]);

	// #region Categories
	interface ListCategory {
		_id: string;
		name: string;
		description: string;
		tags: string[];
		imageUrl: string;
		deleted: boolean;
	}
	const [categoriesListState, setCategoriesListState] = useState<{
		loading: boolean;
		search?: {
			query: string;
			searchIn: Array<"name" | "description" | "tags">;
		};
		includeDeleted?: boolean;
		page: number;
		count: number;
	}>({
		loading: true,
		page: 0,
		count: 10,
		includeDeleted: false,
		search: undefined,
	});
	const [categories, setCategories] = useState<{
		categories: ListCategory[];
		totalCategories: number;
	}>({
		categories: [],
		totalCategories: 0,
	});
	// Fetch categories
	type NullableCategoriesListState = {
		[K in keyof typeof categoriesListState]?:
			| (typeof categoriesListState)[K]
			| null;
	};
	const fetchCategories = async ({
		count = categoriesListState.count,
		page = categoriesListState.page,
		includeDeleted = categoriesListState.includeDeleted,
		search = categoriesListState.search,
	}: NullableCategoriesListState) => {
		const result = await CategoriesFeature.categoriesAPI.list({
			count: count as number,
			page: page as number,
			search: search == null ? undefined : search,
			fields: ["_id", "name", "description", "tags", "imageUrl", "deleted"],
			// sort: sort == null ? undefined : sort,
			includeDeleted: includeDeleted == null ? undefined : includeDeleted,
		});

		if (result.status == "success") {
			setCategoriesListState((prev) => {
				return {
					...prev,
					count: count as number,
					page: page as number,
					// sort: sort == null ? undefined : sort,
					search: search == null ? undefined : search,
					includeDeleted: includeDeleted == null ? undefined : includeDeleted,
					loading: false,
				};
			});

			setCategories({
				categories: result.categories!.map((category) => ({
					_id: category._id.toString(),
					name: category.name,
					description: category.description,
					tags: category.tags,
					imageUrl: category.imageUrl,
					deleted: category.deleted,
				})),
				totalCategories: result.totalCategories!,
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	// Create Category
	const [createCategoryState, setCreateCategoryState] = useState<{
		isOpen: boolean;
		name: string;
		description: string;
		tags: string[];
		imageUrl?: string;
	}>({
		isOpen: false,
		name: "",
		description: "",
		tags: [],
		imageUrl: undefined,
	});
	const createCategorySchema = z.object({
		name: z
			.string()
			.trim()
			.min(1, { message: "invalid-name-length" })
			.max(100, { message: "invalid-name-length" }),
		description: z
			.string()
			.trim()
			.min(1, { message: "invalid-description-length" })
			.max(500, { message: "invalid-description-length" })
			.optional(),
		tags: z
			.array(
				z
					.string()
					.trim()
					.min(1, { message: "invalid-tags-length" })
					.max(16, { message: "invalid-tags-length" }),
			)
			.max(10, { message: "invalid-tags-length" })
			.optional(),
		imageUrl: z.string().optional(),
		metadata: z.record(z.any()).optional(),
	});
	const createCategory = async () => {
		const parseResult = createCategorySchema.safeParse(createCategoryState);
		if (!parseResult.success) {
			for (const issue of parseResult.error.issues) {
				message.warning(
					t(`dashboard:categories.modals.create.messages.${issue.message}`),
				);
			}
			return;
		}

		const result = await CategoriesFeature.categoriesAPI.create(
			parseResult.data,
		);

		if (result.status == "success") {
			message.success(t("dashboard:categories.modals.create.messages.success"));
			setCreateCategoryState({
				isOpen: false,
				name: "",
				description: "",
				tags: [],
				imageUrl: "",
			});

			await fetchCategories({
				page: 0,
				count: 10,
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	// Delete Category
	const [deleteCategoryState, setDeleteCategoryState] = useState<{
		categoryId?: string;
	}>({
		categoryId: undefined,
	});
	const deleteCategory = async () => {
		if (deleteCategoryState.categoryId == null) return;
		const result = await CategoriesFeature.categoriesAPI.delete({
			categoryId: deleteCategoryState.categoryId,
		});

		if (result.status == "success") {
			message.success(t("dashboard:categories.modals.delete.messages.success"));

			setDeleteCategoryState({
				categoryId: undefined,
			});

			await fetchCategories({
				page: 0,
				count: 10,
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	// Edit Category
	const [updateCategoryState, setUpdateCategoryState] = useState<{
		categoryId?: string;
		name: string;
		description: string;
		tags: string[];
		imageUrl?: string;
	}>({
		categoryId: undefined,
		name: "",
		description: "",
		tags: [],
		imageUrl: undefined,
	});
	const updateCategorySchema = z.object({
		name: z
			.string()
			.trim()
			.min(1, { message: "invalid-name-length" })
			.max(100, { message: "invalid-name-length" }),
		description: z
			.string()
			.trim()
			.min(1, { message: "invalid-description-length" })
			.max(500, { message: "invalid-description-length" })
			.nullable(),
		tags: z
			.array(
				z
					.string()
					.min(1, { message: "invalid-tags-length" })
					.max(16, { message: "invalid-tags-length" }),
			)
			.max(10, { message: "too-many-tags" })
			.optional(),
		imageUrl: z.string().nullable(),
		metadata: z.record(z.any()).optional(),
	});
	const updateCategory = async () => {
		if (updateCategoryState.categoryId == null) return;
		const parseResult = updateCategorySchema.safeParse(updateCategoryState);
		if (!parseResult.success) {
			for (const issue of parseResult.error.issues) {
				message.warning(
					t(`dashboard:categories.modals.update.messages.${issue.message}`),
				);
			}

			return;
		}

		const result = await CategoriesFeature.categoriesAPI.update({
			categoryId: updateCategoryState.categoryId,
			name: parseResult.data.name,
			description: parseResult.data.description,
			tags: parseResult.data.tags,
			imageUrl: parseResult.data.imageUrl,
		});

		if (result.status == "success") {
			message.success(t("dashboard:categories.modals.update.messages.success"));
			setUpdateCategoryState({
				categoryId: undefined,
				name: "",
				description: "",
				tags: [],
				imageUrl: undefined,
			});

			await fetchCategories({
				page: 0,
				count: 10,
			});
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	useEffect(() => {
		// Fetch products and categories
		(async () => {
			await fetchCategories({
				page: 0,
				count: 10,
			});
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AdminPageLayout selectedPage="products">
			{/* Edit Category */}
			<Drawer
				onClose={() => {
					setUpdateCategoryState({
						...updateCategoryState,
						categoryId: undefined,
					});
				}}
				open={updateCategoryState.categoryId != undefined}
				title={t("dashboard:categories.modals.update.title")}
				width={1000}
				extra={
					<Button
						variant="solid"
						type="primary"
						onClick={() => {
							updateCategory();
						}}
					>
						{t("dashboard:common.save")}
					</Button>
				}
			>
				<p>{t("dashboard:categories.modals.update.modalDescription")}</p>
				<div className="flex flex-col gap-4 mt-4">
					<div>
						<p>{t("dashboard:categories.modals.update.name")}</p>
						<Input
							type="text"
							value={updateCategoryState.name}
							onChange={(e) => {
								setUpdateCategoryState({
									...updateCategoryState,
									name: e.target.value,
								});
							}}
							placeholder={t(
								"dashboard:categories.modals.update.namePlaceholder",
							)}
						/>
					</div>

					<div>
						<p>{t("dashboard:categories.modals.update.description")}</p>
						<Input
							type="text"
							value={updateCategoryState.description}
							onChange={(e) => {
								setUpdateCategoryState({
									...updateCategoryState,
									description: e.target.value,
								});
							}}
							placeholder={t(
								"dashboard:categories.modals.update.descriptionPlaceholder",
							)}
						/>
					</div>

					<div>
						<p>{t("dashboard:categories.modals.update.tags")}</p>
						<Select
							mode="tags"
							maxCount={10}
							className="w-full"
							placeholder={t(
								"dashboard:categories.modals.update.tagsPlaceholder",
							)}
							value={updateCategoryState.tags}
							onChange={(tags) => {
								setUpdateCategoryState({
									...updateCategoryState,
									tags: tags,
								});
							}}
						/>
					</div>

					<div>
						<p className="mt-2">
							{t("dashboard:categories.modals.update.uploadImageLabel")}
						</p>

						<ImgCrop>
							<Upload
								listType="picture"
								accept="image/*"
								withCredentials={true}
								data={{
									folder: "category-images",
									tags: ["category-image"],
								}}
								action={`${import.meta.env.VITE_SERVER_URL}/api/admin/files/upload`}
								onChange={(info) => {
									if (info.file.status == "done") {
										setUpdateCategoryState({
											...updateCategoryState,
											imageUrl: info.file.response.fileUrl,
										});

										message.success(
											t(
												"dashboard:categories.modals.update.messages.image-upload-success",
											),
										);
									}
								}}
								onRemove={async (file) => {
									const response = await AdminFeature.FilesAPI.deleteFile(
										file.response.fileId as unknown as string,
									);

									// Remove the image from the state
									setUpdateCategoryState({
										...updateCategoryState,
										imageUrl: "",
									});

									if (response.status == "success") {
										message.success(
											t(
												"dashboard:categories.modals.update.messages.image-delete-success",
											),
										);
									} else {
										message.error(
											t(
												"dashboard:categories.modals.update.messages.image-upload-error",
											),
										);
									}
								}}
							>
								<Button icon={<FaPhotoVideo />} variant="outlined">
									{t("dashboard:categories.modals.update.uploadImage")}
								</Button>
							</Upload>
						</ImgCrop>

						{updateCategoryState.imageUrl && (
							<div className="mt-4">
								<p>{t("dashboard:categories.modals.update.currentImage")}</p>
								<Image
									src={`${import.meta.env.VITE_SERVER_URL}${updateCategoryState.imageUrl}`}
									alt="Category Image"
									className="w-20 h-20 rounded-lg"
									width={80}
									height={80}
								/>

								<br />

								<Button
									variant="outlined"
									danger
									onClick={() => {
										setUpdateCategoryState({
											...updateCategoryState,
											imageUrl: "",
										});
									}}
									icon={<FaTrash />}
								>
									{t("dashboard:categories.modals.update.removeImage")}
								</Button>
							</div>
						)}
					</div>
				</div>
			</Drawer>

			{/* Create Category */}
			<Modal
				title={t("dashboard:categories.modals.create.title")}
				open={createCategoryState.isOpen}
				onOk={createCategory}
				okText={t("dashboard:common.create")}
				cancelText={t("dashboard:common.cancel")}
				onCancel={() =>
					setCreateCategoryState({
						isOpen: false,
						tags: [],
						name: "",
						description: "",
						imageUrl: "",
					})
				}
			>
				<p>{t("dashboard:categories.modals.create.modalDescription")}</p>

				<div className="flex flex-col gap-2">
					<Input
						type="text"
						value={createCategoryState.name}
						onChange={(e) => {
							setCreateCategoryState({
								...createCategoryState,
								name: e.target.value,
							});
						}}
						placeholder={t("dashboard:categories.modals.create.name")}
					/>
					<Input
						type="text"
						value={createCategoryState.description}
						onChange={(e) => {
							setCreateCategoryState({
								...createCategoryState,
								description: e.target.value,
							});
						}}
						placeholder={t("dashboard:categories.modals.create.description")}
					/>
					<Select
						maxCount={10}
						mode="tags"
						placeholder={t("dashboard:categories.modals.create.tags")}
						value={createCategoryState.tags}
						onChange={(tags) => {
							setCreateCategoryState({
								...createCategoryState,
								tags: tags,
							});
						}}
					/>

					<p className="mt-2">
						{t("dashboard:categories.modals.create.uploadImageLabel")}
					</p>
					<ImgCrop>
						<Upload
							listType="picture"
							accept="image/*"
							withCredentials={true}
							data={{
								folder: "category-images",
								tags: ["category-image"],
							}}
							action={`${import.meta.env.VITE_SERVER_URL}/api/admin/files/upload`}
							onChange={(info) => {
								if (info.file.status == "done") {
									setCreateCategoryState({
										...createCategoryState,
										imageUrl: info.file.response.fileUrl,
									});
								}
							}}
							showUploadList={false}
							onRemove={async (file) => {
								const response = await AdminFeature.FilesAPI.deleteFile(
									file.response.fileId as unknown as string,
								);

								// Remove the image from the state
								setCreateCategoryState({
									...createCategoryState,
									imageUrl: "",
								});

								if (response.status == "success") {
									message.success(
										t("dashboard:categories.modals.create.imagesDeleteSuccess"),
									);
								} else {
									message.error(
										t("dashboard:categories.modals.create.imagesDeleteError"),
									);
								}
							}}
						>
							<Button icon={<FaPhotoVideo />} variant="outlined">
								{t("dashboard:categories.modals.create.uploadImage")}
							</Button>
						</Upload>
					</ImgCrop>
				</div>
			</Modal>

			{/* Delete Category */}
			<Modal
				title={t("dashboard:categories.modals.delete.title")}
				open={deleteCategoryState.categoryId != null}
				onOk={deleteCategory}
				okButtonProps={{ variant: "solid", color: "red" }}
				okText={t("dashboard:common.delete")}
				cancelText={t("dashboard:common.cancel")}
				onCancel={() =>
					setDeleteCategoryState({
						categoryId: undefined,
					})
				}
			>
				<p>{t("dashboard:categories.modals.delete.description")}</p>
			</Modal>

			<div className="mb-2">
				{t("dashboard:common.loggedInAs", {
					name: account?.profile.name,
					email: account?.email.value,
				})}
			</div>

			<Title className="flex items-center gap-2">
				<FaLayerGroup />
				{t("dashboard:categories.page.title")}
			</Title>

			<Text>{t("dashboard:categories.page.description")}</Text>

			<div className="my-2 flex items-center gap-2 flex-wrap">
				<Button
					variant="outlined"
					onClick={() => {
						navigate({
							to: "/dashboard/products",
						});
					}}
				>
					{t("dashboard:categories.page.returnToProducts")}
				</Button>

				<Button
					variant="solid"
					type="primary"
					onClick={() => {
						setCreateCategoryState({
							...createCategoryState,
							isOpen: true,
						});
					}}
					disabled={
						account !== null
							? !account.data.role.permissions.includes("categories:create") &&
								!account.data.role.permissions.includes("*")
							: true
					}
				>
					{t("dashboard:categories.page.createCategory")}
				</Button>
			</div>

			{/* Categories List */}
			<Table
				className="mt-4 overflow-x-scroll"
				dataSource={categories.categories}
				loading={categoriesListState.loading}
				pagination={{
					pageSize: categoriesListState.count,
					total: categories.totalCategories,
					current: categoriesListState.page + 1,
					showTotal: (total, range) =>
						t("dashboard:categories.table.total", {
							total: total,
							range: range[0] + "-" + range[1],
						}),
					showSizeChanger: true,
					onChange: (current, size) => {
						fetchCategories({
							count: size,
							page: current - 1,
						});
					},
				}}
				rowKey={(record) => record._id.toString()}
				columns={[
					{
						title: t("dashboard:categories.table.image"),
						dataIndex: "imageUrl",
						key: "imageUrl",
						render: (imageUrl) => (
							<Image
								fallback={"/item.png"}
								src={`${import.meta.env.VITE_SERVER_URL}${imageUrl}`}
								alt="Category Image"
								className="w-20 h-20 object-cover rounded-lg"
								width={32}
								height={32}
							/>
						),
					},
					{
						title: t("dashboard:categories.table.name"),
						dataIndex: "name",
						key: "name",
						filterIcon: () => {
							const isFiltered =
								categoriesListState.search?.searchIn.includes("name");
							return <FaSearch className={isFiltered ? "text-blue-500" : ""} />;
						},
						filterDropdown: () => {
							return (
								<Space className="p-2 flex gap-2 items-center">
									<Input
										placeholder={t("dashboard:common.search")}
										value={categoriesListState.search?.query}
										onChange={(e) => {
											setCategoriesListState((prev) => {
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
											fetchCategories({
												search: {
													query: categoriesListState.search!.query,
													searchIn: ["name"],
												},
											});
										}}
									>
										{t("dashboard:common.search")}
									</Button>

									{categoriesListState.search?.query && (
										<Button
											type="text"
											onClick={() => {
												fetchCategories({
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
						title: t("dashboard:categories.table.description"),
						dataIndex: "description",
						key: "description",
						filterIcon: () => {
							const isFiltered =
								categoriesListState.search?.searchIn.includes("description");
							return <FaSearch className={isFiltered ? "text-blue-500" : ""} />;
						},
						filterDropdown: () => {
							return (
								<Space className="p-2 flex gap-2 items-center">
									<Input
										placeholder={t("dashboard:common.search")}
										value={categoriesListState.search?.query}
										onChange={(e) => {
											setCategoriesListState((prev) => {
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
											fetchCategories({
												search: {
													query: categoriesListState.search!.query,
													searchIn: ["description"],
												},
											});
										}}
									>
										{t("dashboard:common.search")}
									</Button>

									{categoriesListState.search?.query && (
										<Button
											type="text"
											onClick={() => {
												fetchCategories({
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
						title: t("dashboard:categories.table.tags"),
						dataIndex: "tags",
						key: "tags",
						render: (tags) => (
							<span>
								{tags.map((tag: string) => (
									<Tag key={tag}>#{tag}</Tag>
								))}
							</span>
						),
					},
					{
						title: t("dashboard:categories.table.actions"),
						key: "actions",
						fixed: "right",
						render: (_, record: ListCategory) => {
							{
								if (record.deleted) {
									return (
										<Tag color="red" className="ml-2">
											{t("dashboard:categories.table.deleted")}
										</Tag>
									);
								}

								return (
									<div className="flex items-center gap-2">
										<Tooltip
											placement="top"
											title={t("dashboard:categories.table.editTooltip")}
										>
											<Button
												variant="outlined"
												onClick={async () => {
													const result =
														await CategoriesFeature.categoriesAPI.get({
															categoryIds: [record._id.toString()],
														});
													if (result.status == "success") {
														const category = result.categories![0];
														setUpdateCategoryState({
															...updateCategoryState,
															categoryId: category._id.toString(),
															name: category.name,
															description: category.description,
															tags: category.tags,
															imageUrl: category.imageUrl,
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
														"categories.update",
													);
												})()}
											>
												<FaPencilAlt />
											</Button>
										</Tooltip>

										<Tooltip
											placement="top"
											title={t("dashboard:categories.table.deleteTooltip")}
										>
											<Button
												variant="outlined"
												danger
												onClick={() => {
													setDeleteCategoryState({
														categoryId: record._id.toString(),
													});
												}}
												disabled={(() => {
													if (record.deleted) return true;
													if (account == null) return true;
													if (account.data.role.permissions.includes("*"))
														return false;
													return !account.data.role.permissions.includes(
														"categories.delete",
													);
												})()}
											>
												<FaTrash />
											</Button>
										</Tooltip>
									</div>
								);
							}
						},
					},
				]}
			/>

			<div className="flex mt-4 gap-2 items-center">
				<Switch
					id="page-show-deleted"
					checked={categoriesListState.includeDeleted}
					onChange={(value) => {
						fetchCategories({
							includeDeleted: value,
						});
					}}
				/>

				<label htmlFor="page-show-deleted">
					{t("dashboard:categories.page.showDeleted")}
				</label>
			</div>
		</AdminPageLayout>
	);
}
