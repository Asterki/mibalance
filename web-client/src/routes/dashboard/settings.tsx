import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

import {
	Input,
	Select,
	Button,
	Switch,
	Typography,
	App,
	Collapse,
	InputNumber,
	Space,
} from "antd";
import { FaCog, FaTrash } from "react-icons/fa";
const { Text, Title } = Typography;
const { Panel } = Collapse;

import AdminPageLayout from "../../layouts/AdminLayout";

import ConfigFeature, { IConfig } from "../../features/config";

export const Route = createFileRoute("/dashboard/settings")({
	component: RouteComponent,
});

function RouteComponent() {
	const { config } = useSelector((state: RootState) => state.config);
	const { account } = useSelector((state: RootState) => state.auth);
	const { t } = useTranslation(["main"]);

	const { message } = App.useApp();

	const [currentConfig, setCurrentConfig] = useState<IConfig | null>(null);

	const updateConfigSchema = z
		.object({
			currency: z.string().min(1, { message: "invalid-currency" }),
			currencySymbol: z.string().min(1, { message: "invalid-currency" }),
			currencyPosition: z.enum(["left", "right"], {
				errorMap: () => ({ message: "invalid-currency-position" }),
			}),

			taxes: z
				.array(
					z.object({
						name: z.string().min(1, { message: "invalid-taxes-name" }),
						rate: z.number().min(0, { message: "invalid-taxes-rate" }),
					}),
				)
				.min(1, { message: "invalid-taxes" })
				.superRefine((taxes, ctx) => {
					const seen = new Set<string>();
					for (let i = 0; i < taxes.length; i++) {
						const name = taxes[i].name.trim().toLowerCase();
						if (seen.has(name)) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: "duplicate-taxes-name",
								path: [i, "name"], // Highlight the duplicate input's name field
							});
						}
						seen.add(name);
					}
				}),
			invoiceNumberRange: z.object({
				start: z.number({ invalid_type_error: "invalid-invoice-start" }),
				end: z.number({ invalid_type_error: "invalid-invoice-end" }),
				current: z.number({ invalid_type_error: "invalid-invoice-current" }),
			}),

			inventorySettings: z.object({
				lowStockAlerts: z.boolean({
					invalid_type_error: "invalid-low-stock-alerts",
				}),
			}),

			notifications: z.object({
				email: z.boolean({ invalid_type_error: "invalid-email-notification" }),
				sms: z.boolean({ invalid_type_error: "invalid-sms-notification" }),
				push: z.boolean({ invalid_type_error: "invalid-push-notification" }),
			}),
		})
		.refine(
			(data) => {
				const { invoiceNumberRange } = data;
				return (
					invoiceNumberRange.start <= invoiceNumberRange.end &&
					invoiceNumberRange.current >= invoiceNumberRange.start &&
					invoiceNumberRange.current <= invoiceNumberRange.end
				);
			},
			{
				message: "invalid-invoice-number-range",
			},
		);

	const updateConfig = async () => {
		const parsedData = updateConfigSchema.safeParse(currentConfig);
		if (!parsedData.success) {
			for (const error of parsedData.error.errors) {
				message.warning(t(`dashboard:config.messages.${error.message}`));
			}
			return;
		}

		const result = await ConfigFeature.configAPI.update({
			taxes: parsedData.data.taxes!,
			currency: parsedData.data.currency,
			currencySymbol: parsedData.data.currencySymbol,
			currencyPosition: parsedData.data.currencyPosition,
			invoiceNumberRange: parsedData.data.invoiceNumberRange,
			inventorySettings: parsedData.data.inventorySettings,
			notifications: parsedData.data.notifications,
		});

		if (result.status == "success") {
			message.success(t("dashboard:config.messages.success"));
		} else {
			message.error(t(`error-messages:${result.status}`));
		}
	};

	useEffect(() => {
		if (config) setCurrentConfig(config);
	}, [config]);

	return (
		<AdminPageLayout selectedPage="settings">
			<div className="mb-2">
				{t("dashboard:common.loggedInAs", {
					name: account?.profile.name,
					email: account?.email.value,
				})}
			</div>

			<Title className="flex items-center gap-2">
				<FaCog />
				{t("dashboard:config.page.title")}
			</Title>
			<Text>{t("dashboard:config.page.description")}</Text>

			{currentConfig && (
				<Collapse className="mt-4">
					<Panel header={t("dashboard:config.currency.title")} key="1">
						<Space direction="vertical" style={{ width: "100%" }}>
							<Input
								addonBefore={t("dashboard:config.currency.fields.currency")}
								value={currentConfig.currency}
								onChange={(e) =>
									setCurrentConfig({
										...currentConfig,
										currency: e.target.value,
									})
								}
								disabled={
									!account ||
									!(
										account?.data.role.permissions.includes("*") ||
										account?.data.role.permissions.includes("config:update")
									)
								}
							/>
							<Input
								addonBefore={t("dashboard:config.currency.fields.symbol")}
								value={currentConfig.currencySymbol}
								onChange={(e) =>
									setCurrentConfig({
										...currentConfig,
										currencySymbol: e.target.value,
									})
								}
								disabled={
									!account ||
									!(
										account?.data.role.permissions.includes("*") ||
										account?.data.role.permissions.includes("config:update")
									)
								}
							/>
							<div className="flex gap-2 items-center">
								<p>{t("dashboard:config.currency.fields.position")}</p>
								<Select
									style={{ width: 200 }}
									value={currentConfig.currencyPosition}
									onChange={(val) =>
										setCurrentConfig({
											...currentConfig,
											currencyPosition: val as "left" | "right",
										})
									}
									disabled={
										!account ||
										!(
											account?.data.role.permissions.includes("*") ||
											account?.data.role.permissions.includes("config:update")
										)
									}
								>
									<Select.Option value="left">
										{t("dashboard:config.currency.fields.left")}
									</Select.Option>
									<Select.Option value="right">
										{t("dashboard:config.currency.fields.right")}
									</Select.Option>
								</Select>
							</div>
						</Space>
					</Panel>

					<Panel header={t("dashboard:config.taxes.title")} key="2">
						{currentConfig.taxes.map((tax, idx) => (
							<Space direction="horizontal" key={idx} className="mb-2 w-full">
								<Input
									placeholder={t("dashboard:config.taxes.fields.name")}
									value={tax.name}
									onChange={(e) => {
										const newTaxes = [...currentConfig.taxes];
										newTaxes[idx].name = e.target.value;
										setCurrentConfig({ ...currentConfig, taxes: newTaxes });
									}}
									disabled={
										!account ||
										!(
											account?.data.role.permissions.includes("*") ||
											account?.data.role.permissions.includes("config:update")
										)
									}
								/>
								<InputNumber
									min={0}
									max={100}
									addonAfter="%"
									value={tax.rate}
									onChange={(val) => {
										const newTaxes = [...currentConfig.taxes];
										newTaxes[idx].rate = val || 0;
										setCurrentConfig({ ...currentConfig, taxes: newTaxes });
									}}
									disabled={
										!account ||
										!(
											account?.data.role.permissions.includes("*") ||
											account?.data.role.permissions.includes("config:update")
										)
									}
								/>

								<Button
									danger
									onClick={() => {
										const newTaxes = [...currentConfig.taxes];
										newTaxes.splice(idx, 1);
										setCurrentConfig({ ...currentConfig, taxes: newTaxes });
									}}
									icon={<FaTrash />}
									className="ml-2"
									disabled={
										!account ||
										!(
											account?.data.role.permissions.includes("*") ||
											account?.data.role.permissions.includes("config:update")
										)
									}
								>
									{t("dashboard:config.taxes.removeTax")}
								</Button>
							</Space>
						))}

						<br />

						<Button
							onClick={() =>
								setCurrentConfig({
									...currentConfig,
									taxes: [...currentConfig.taxes, { name: "", rate: 0 }],
								})
							}
							disabled={
								!account ||
								!(
									account?.data.role.permissions.includes("*") ||
									account?.data.role.permissions.includes("config:update")
								)
							}
						>
							{t("dashboard:config.taxes.addTax")}
						</Button>
					</Panel>

					<Panel header={t("dashboard:config.invoice.title")} key="3">
						<Space direction="vertical">
							<InputNumber
								addonBefore={t("dashboard:config.invoice.fields.start")}
								value={currentConfig.invoiceNumberRange.start}
								onChange={(val) =>
									setCurrentConfig({
										...currentConfig,
										invoiceNumberRange: {
											...currentConfig.invoiceNumberRange,
											start: val || 0,
										},
									})
								}
								disabled={
									!account ||
									!(
										account?.data.role.permissions.includes("*") ||
										account?.data.role.permissions.includes("config:update")
									)
								}
							/>
							<InputNumber
								addonBefore={t("dashboard:config.invoice.fields.end")}
								value={currentConfig.invoiceNumberRange.end}
								onChange={(val) =>
									setCurrentConfig({
										...currentConfig,
										invoiceNumberRange: {
											...currentConfig.invoiceNumberRange,
											end: val || 0,
										},
									})
								}
								disabled={
									!account ||
									!(
										account?.data.role.permissions.includes("*") ||
										account?.data.role.permissions.includes("config:update")
									)
								}
							/>
							<InputNumber
								addonBefore={t("dashboard:config.invoice.fields.current")}
								value={currentConfig.invoiceNumberRange.current}
								onChange={(val) =>
									setCurrentConfig({
										...currentConfig,
										invoiceNumberRange: {
											...currentConfig.invoiceNumberRange,
											current: val || 0,
										},
									})
								}
								disabled={
									!account ||
									!(
										account?.data.role.permissions.includes("*") ||
										account?.data.role.permissions.includes("config:update")
									)
								}
							/>
						</Space>
					</Panel>

					<Panel header={t("dashboard:config.inventory.title")} key="4">
						<Switch
							checked={currentConfig.inventorySettings.lowStockAlerts}
							onChange={(checked) =>
								setCurrentConfig({
									...currentConfig,
									inventorySettings: {
										...currentConfig.inventorySettings,
										lowStockAlerts: checked,
									},
								})
							}
							disabled={
								!account ||
								!(
									account?.data.role.permissions.includes("*") ||
									account?.data.role.permissions.includes("config:update")
								)
							}
						/>
						<span className="ml-2">
							{t("dashboard:config.inventory.fields.lowStockAlerts")}
						</span>
					</Panel>

					<Panel header={t("dashboard:config.notifications.title")} key="5">
						<Space direction="vertical">
							{(["email", "sms", "push"] as const).map((type) => (
								<div key={type}>
									<Switch
										checked={currentConfig.notifications[type]}
										onChange={(checked) =>
											setCurrentConfig({
												...currentConfig,
												notifications: {
													...currentConfig.notifications,
													[type]: checked,
												},
											})
										}
										disabled={
											!account ||
											!(
												account?.data.role.permissions.includes("*") ||
												account?.data.role.permissions.includes("config:update")
											)
										}
									/>
									<span className="ml-2">
										{t(`dashboard:config.notifications.fields.${type}`)}
									</span>
								</div>
							))}
						</Space>
					</Panel>
				</Collapse>
			)}

			{currentConfig && (
				<Button
					className="mt-4"
					type="primary"
					onClick={() => {
						updateConfig();
					}}
					disabled={
						!account ||
						!(
							account?.data.role.permissions.includes("*") ||
							account?.data.role.permissions.includes("config:update")
						)
					}
				>
					{t("dashboard:common.save")}
				</Button>
			)}
		</AdminPageLayout>
	);
}
