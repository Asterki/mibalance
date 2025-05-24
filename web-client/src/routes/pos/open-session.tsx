import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import {
	Input,
	Modal,
	Select,
	notification,
	ConfigProvider,
	theme,
	InputNumber,
} from "antd";

import { useTranslation } from "react-i18next";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";

import AuthFeature from "../../features/auth";
import POSSessionFeature from "../../features/pos-sessions";
import StoreFeature, { IStore } from "../../features/stores";

export const Route = createFileRoute("/pos/open-session")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();

	const dispatch = useDispatch<typeof import("../../store").store.dispatch>();
	const { account } = useSelector((state: RootState) => state.auth);
	const { config } = useSelector((state: RootState) => state.config);

	const isDarkTheme = account?.preferences.general.theme === "dark";

	const [api, contextHolder] = notification.useNotification();
	const { t } = useTranslation(["main"]);

	const [stores, setStores] = useState<
		{
			name: string;
			_id: string;
		}[]
	>([]);

	const [openBoxState, setOpenBoxState] = useState<{
		starting: number;
		storeId: string;
		loading: boolean;
	}>({
		starting: 0,
		storeId: "",
		loading: false,
	});

	const openBox = async () => {
		if (openBoxState.storeId === "") {
			api.error({
				message: t("pos:open-session.messages.select-store"),
			});
			return;
		}

		if (openBoxState.starting < 0) {
			api.error({
				message: t("pos:open-session.messages.invalid-amount"),
			});
			return;
		}

		setOpenBoxState((prev) => ({
			...prev,
			loading: true,
		}));
		const response = await POSSessionFeature.POSSessionsAPI.create({
			starting: openBoxState.starting,
			storeId: openBoxState.storeId,
		});
		if (response.status == "success") {
			setOpenBoxState((prev) => ({
				...prev,
				loading: false,
			}));
			navigate({
				to: "/pos",
			});
		} else {
			setOpenBoxState((prev) => ({
				...prev,
				loading: false,
			}));
		}
	};

	useEffect(() => {
		if (!account) {
			(async () => {
				const accountResponse = await dispatch(AuthFeature.actions.fetch());
				if (AuthFeature.actions.fetch.rejected.match(accountResponse)) {
					navigate({ to: "/auth/login" });
				} else {
					const POSSessionResponse =
						await POSSessionFeature.POSSessionsAPI.list({
							count: 10,
							page: 0,
							filters: {
								status: "open",
								boxOwner: accountResponse.payload.account?._id,
							},
						});

					if (POSSessionResponse.status == "success") {
						if (
							POSSessionResponse.POSSessions &&
							POSSessionResponse.POSSessions.length > 0
						) {
							navigate({
								to: "/pos",
							});
						}
					}
				}
			})();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [account]);

	useEffect(() => {
		(async () => {
			const storesResponse = await StoreFeature.storesAPI.list({
				count: 50,
				page: 0,
			});
			if (storesResponse.status == "success" && storesResponse.stores) {
				setStores(
					storesResponse.stores.map((store: IStore) => ({
						name: store.name,
						_id: store._id.toString(),
					})),
				);
			}
		})();
	}, []);

	return (
		<ConfigProvider
			theme={{ algorithm: isDarkTheme ? theme.darkAlgorithm : undefined }}
		>
			<div
				className={`${isDarkTheme ? "bg-neutral-900" : "bg-white"} min-h-screen flex flex-col items-center justify-center`}
			>
				{contextHolder}

				<Modal
					open={true}
					title={t("pos:open-session.title")}
					onOk={() => {
						openBox();
					}}
					onCancel={() => {
						navigate({
							to: "/dashboard",
						});
					}}
					okText={t("pos:open-session.open")}
					cancelText={t("pos:open-session.cancel")}
				>
					<p>{t("pos:open-session.description")}</p>

					<InputNumber
						placeholder={t("pos:open-session.placeholder")}
						min={0}
            className="w-full"
            addonBefore={config && config.currencySymbol}
						defaultValue={openBoxState.starting}
						onChange={(val) => {
							const value = val || 0;
							if (!isNaN(value)) {
								setOpenBoxState((prev) => ({
									...prev,
									starting: value,
								}));
							}
						}}
					/>

					<Select
						options={stores.map((store) => ({
							label: store.name,
							value: store._id,
						}))}
						placeholder={t("pos:open-session.select-store")}
						onChange={(value) => {
							setOpenBoxState((prev) => ({
								...prev,
								storeId: value,
							}));
						}}
						className="w-full mt-4"
					/>
				</Modal>
			</div>
		</ConfigProvider>
	);
}
