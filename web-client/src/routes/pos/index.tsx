import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Button, Drawer, Typography, Card, Divider } from "antd";
import { FaCartPlus, FaCashRegister, FaBoxOpen } from "react-icons/fa";

import type { RootState } from "../../store";
import POSSessionsFeature from "../../features/pos-sessions";
import StoresFeature from "../../features/stores";
import POSPageLayout from "../../layouts/POSLayout";

const { Title, Text } = Typography;

export const Route = createFileRoute("/pos/")({
	component: POSHomePage,
});

const SessionInfoRow = ({
	label,
	value,
}: {
	label: string;
	value: React.ReactNode;
}) => (
	<tr className="border-b">
		<td className="py-2 font-medium text-gray-700 dark:text-gray-100">
			{label}
		</td>
		<td className="text-gray-900 dark:text-gray-300">{value}</td>
	</tr>
);

const ConfirmCloseSessionModal = ({
	open,
	onClose,
	onConfirm,
	title,
	description,
	confirmText,
	cancelText,
}: {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	description: string;
	confirmText: string;
	cancelText: string;
}) => (
	<Drawer open={open} onClose={onClose} title={title} width={600}>
		<p className="mb-4">{description}</p>
		<div className="flex justify-end gap-2">
			<Button onClick={onClose}>{cancelText}</Button>
			<Button
				type="primary"
				danger
				icon={<FaCashRegister />}
				onClick={onConfirm}
			>
				{confirmText}
			</Button>
		</div>
	</Drawer>
);

function POSHomePage() {
	const dispatch = useDispatch<typeof import("../../store").store.dispatch>();
	const navigate = useNavigate();
	const { t } = useTranslation(["pos", "dashboard"]);
	const { config } = useSelector((state: RootState) => state.config);
	const { POSSession } = useSelector((state: RootState) => state.POSSessions);
	const { account } = useSelector((state: RootState) => state.auth);

	const [storeName, setStoreName] = useState("");
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		const fetchStore = async () => {
			if (!POSSession?.store) return;
			const res = await StoresFeature.storesAPI.get({
				storeIds: [POSSession.store.toString() as string],
				relations: [],
				fields: ["name"],
			});

			if (res.status === "success") setStoreName(res.stores?.[0]?.name || "");
		};
		fetchStore();
	}, [POSSession]);

	const closeSession = async () => {
		if (!POSSession) return;
		const result = await POSSessionsFeature.POSSessionsAPI.update({
			POSSessionId: POSSession._id.toString(),
			status: "closed",
		});
		if (result.status === "success") {
			dispatch(POSSessionsFeature.POSSessionsSlice.actions.setSession(null));
			navigate({ to: "/" });
		}
	};

	return (
		<POSPageLayout>
			{/* Close Session Modal */}
			<ConfirmCloseSessionModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onConfirm={closeSession}
				title={t("pos:index.modal.title")}
				description={t("pos:index.modal.description")}
				confirmText={t("pos:index.modal.confirm")}
				cancelText={t("common:cancel")}
			/>

			{/* User Info */}
			<div className="mb-4 text-sm text-gray-500">
				{t("dashboard:common.loggedInAs", {
					name: account?.profile.name,
					email: account?.email.value,
				})}
			</div>

			{/* Page Header */}
			<Title level={1}>{t("pos:index.heading")}</Title>
			<Text type="secondary">{t("pos:index.subheading")}</Text>

			{/* Session Info */}
			<Card className="mt-6">
				<Title level={3}>{t("pos:index.session.title")}</Title>
				<Text>{t("pos:index.session.description")}</Text>
				<Divider />

				<table className="w-full">
					<tbody>
						<SessionInfoRow
							label={t("pos:index.session.status")}
							value={t(`pos:status.${POSSession?.status || "closed"}`)}
						/>
						<SessionInfoRow
							label={t("pos:index.session.store")}
							value={storeName}
						/>
						<SessionInfoRow
							label={t("pos:index.session.starting")}
							value={`${POSSession?.starting ?? 0} ${config?.currencySymbol}`}
						/>
						<SessionInfoRow
							label={t("pos:index.session.cash")}
							value={`${POSSession?.currentWithoutStarting ?? 0} ${config?.currencySymbol}`}
						/>
						<SessionInfoRow
							label={t("pos:index.session.total")}
							value={`${(POSSession?.currentWithoutStarting ?? 0) + (POSSession?.starting ?? 0)} ${config?.currencySymbol}`}
						/>
						<SessionInfoRow
							label={t("pos:index.session.totalSales")}
							value={POSSession?.totalSales ?? 0}
						/>
						<SessionInfoRow
							label={t("pos:index.session.totalRefunds")}
							value={POSSession?.totalRefunds ?? 0}
						/>
						<SessionInfoRow
							label={t("pos:index.session.totalPayouts")}
							value={POSSession?.totalPayouts ?? 0}
						/>
						<SessionInfoRow
							label={t("pos:index.session.totalDeposits")}
							value={POSSession?.totalDeposits ?? 0}
						/>
						<SessionInfoRow
							label={t("pos:index.session.expectedClosing")}
							value={`${POSSession?.expectedClosingAmount ?? 0} ${config?.currencySymbol}`}
						/>
						<SessionInfoRow
							label={t("pos:index.session.cashCounted")}
							value={`${POSSession?.cashCounted ?? 0} ${config?.currencySymbol}`}
						/>
						<SessionInfoRow
							label={t("pos:index.session.openedAt")}
							value={new Date(POSSession?.openedAt ?? 0).toLocaleString()}
						/>
						<SessionInfoRow
							label={t("pos:index.session.closedAt")}
							value={
								POSSession?.closedAt
									? new Date(POSSession.closedAt).toLocaleString()
									: t("pos:index.session.stillOpen")
							}
						/>
						{POSSession?.notes && (
							<SessionInfoRow
								label={t("pos:index.session.notes")}
								value={POSSession.notes}
							/>
						)}
					</tbody>
				</table>

				<div className="mt-4 text-right">
					<Button
						type="primary"
						danger
						icon={<FaCashRegister />}
						onClick={() => setModalOpen(true)}
					>
						{t("pos:index.session.closeButton")}
					</Button>
				</div>
			</Card>

			{/* Sales Section */}
			<Card className="mt-8">
				<Title level={3} className="flex items-center gap-2">
					<FaCartPlus /> {t("pos:index.sales.title")}
				</Title>
				<Text>{t("pos:index.sales.description")}</Text>

				<div className="mt-4 flex gap-2">
					<Button
						type="primary"
						icon={<FaCartPlus />}
						onClick={() => navigate({ to: "/pos/sales/new" })}
					>
						{t("pos:index.sales.new")}
					</Button>
					<Button onClick={() => navigate({ to: "/dashboard/sales" })}>
						{t("pos:index.sales.view")}
					</Button>
				</div>
			</Card>

			{/* Purchases Section */}
			<Card className="mt-8">
				<Title level={3} className="flex items-center gap-2">
					<FaBoxOpen /> {t("pos:index.purchases.title")}
				</Title>
				<Text>{t("pos:index.purchases.description")}</Text>

				<div className="mt-4 flex gap-2">
					<Button type="primary" onClick={() => navigate({ to: "/" })}>
						{t("pos:index.purchases.new")}
					</Button>
					<Button onClick={() => navigate({ to: "/dashboard/purchases" })}>
						{t("pos:index.purchases.view")}
					</Button>
				</div>
			</Card>
		</POSPageLayout>
	);
}
