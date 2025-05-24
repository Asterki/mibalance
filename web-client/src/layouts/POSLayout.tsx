import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
	FaShoppingCart,
	FaListAlt,
	FaBars,
	FaDashcube,
	FaHome,
	FaDesktop,
} from "react-icons/fa";

import { Layout, Menu, Button, Drawer, ConfigProvider, theme } from "antd";
const { Header, Sider, Content, Footer } = Layout;
import esES from "antd/locale/es_ES";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";

import POSSessionsFeature from "../features/pos-sessions";
import AuthFeature from "../features/auth/";

import { useTranslation } from "react-i18next";
import { unwrapResult } from "@reduxjs/toolkit";

interface LayoutProps {
	children: React.ReactNode;
	selectedPage?: string;
}

export default function SalesManagerLayout({
	children,
	selectedPage,
}: LayoutProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch<typeof import("../store").store.dispatch>();
	const { t } = useTranslation(["pos"]);

	const { account } = useSelector((state: RootState) => state.auth);
	const [collapsed, setCollapsed] = useState(false);
	const [drawerVisible, setDrawerVisible] = useState(false);

	useEffect(() => {
		if (!account) {
			(async () => {
				const result = await dispatch(AuthFeature.actions.fetch());

				const payload = unwrapResult(result);

				if (payload.status == "network-error") {
					navigate({ to: "/errors/offline" });
				}

				if (payload.status == "unauthenticated") {
					navigate({ to: "/auth/login" });
				}

				const session = await dispatch(
					POSSessionsFeature.actions.fetchByCurrentUser(),
				);
				if (
					POSSessionsFeature.actions.fetchByCurrentUser.rejected.match(session)
				) {
					navigate({ to: "/pos/open-session" });
				}
			})();
		} else {
			(async () => {
				const session = await dispatch(
					POSSessionsFeature.actions.fetchByCurrentUser(),
				);
				if (
					POSSessionsFeature.actions.fetchByCurrentUser.rejected.match(session)
				) {
					navigate({ to: "/pos/open-session" });
				}
			})();
		}
	}, [account]);

	const menuItems = [
		{
			key: "pos",
			label: t("sidebar.menu"),
			icon: <FaHome />,
			path: "/pos",
		},

		{
			key: "dashboard",
			label: t("sidebar.dashboard"),
			icon: <FaDesktop />,
			path: "/dashboard",
		},
		{
			key: "new-sale",
			label: t("sidebar.newSale"),
			icon: <FaShoppingCart />,
			path: "/pos/sales/new",
		},
		{
			key: "sales",
			label: t("sidebar.consultSales"),
			icon: <FaListAlt />,
			path: "/dashboard/sales",
		},
	];

	const isDark = account?.preferences.general.theme === "dark";

	return (
		<ConfigProvider
			locale={esES}
			theme={{ algorithm: isDark ? theme.darkAlgorithm : undefined }}
		>
			<Layout className={`${isDark ? "dark" : ""} min-h-screen`}>
				<Header className="px-4 flex items-center justify-between bg-white dark:bg-neutral-800">
					<Button
						type="text"
						icon={<FaBars />}
						onClick={() => setDrawerVisible(true)}
						className="md:hidden text-xl"
					/>
					<h1 className="text-lg font-semibold text-black dark:text-white">
						{t("sidebar.title")}
					</h1>
				</Header>

				<Layout hasSider>
					<Sider
						breakpoint="md"
						collapsible
						collapsed={collapsed}
						onCollapse={setCollapsed}
						className="hidden md:block"
						theme={isDark ? "dark" : "light"}
						width={220}
					>
						<Menu
							mode="inline"
							defaultSelectedKeys={[selectedPage || "pos"]}
							items={menuItems.map(({ key, label, icon, path }) => ({
								key,
								label: (
									<span onClick={() => navigate({ to: path })}>{label}</span>
								),
								icon,
							}))}
							className="h-full"
						/>
					</Sider>

					<Drawer
						title={t("sidebar.menu")}
						placement="left"
						onClose={() => setDrawerVisible(false)}
						open={drawerVisible}
					>
						<Menu
							mode="inline"
							defaultSelectedKeys={[selectedPage || "pos"]}
							items={menuItems.map(({ key, label, icon, path }) => ({
								key,
								label: (
									<span
										onClick={() => {
											navigate({ to: path });
											setDrawerVisible(false);
										}}
									>
										{label}
									</span>
								),
								icon,
							}))}
						/>
					</Drawer>

					<Layout style={{ background: "transparent" }}>
						<Content className="p-6 bg-white dark:bg-neutral-800 dark:text-white">
							{children}
						</Content>
						<Footer className="text-center bg-white dark:bg-neutral-800 dark:text-white">
							© {new Date().getFullYear()} Vimar MiCuadro
						</Footer>
					</Layout>
				</Layout>
			</Layout>
		</ConfigProvider>
	);
}
