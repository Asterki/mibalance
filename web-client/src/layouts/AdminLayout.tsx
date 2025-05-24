import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	FaBars,
	FaCog,
	FaMoneyBill,
	FaHandHoldingUsd,
	FaLandmark,
	FaHome,
	FaBox,
	FaTruckMoving,
	FaUser,
} from "react-icons/fa";
import { BsPinMap } from "react-icons/bs";

import { ConfigProvider, theme, Layout, Menu, Drawer, Button } from "antd";
const { Header, Sider, Content, Footer } = Layout;
import esES from "antd/locale/es_ES";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { unwrapResult } from "@reduxjs/toolkit";

import AuthFeature from "../features/auth/";

import { useTranslation } from "react-i18next";

interface LayoutProps {
	children: React.ReactNode;
	selectedPage?: string;
}

export default function PageLayout({ children, selectedPage }: LayoutProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch<typeof import("../store").store.dispatch>();

	const { t } = useTranslation(["main"]);

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

				if (
					AuthFeature.actions.fetch.rejected.match(result) ||
					result.payload.status === "unauthenticated"
				) {
					navigate({ to: "/auth/login" });
				}
			})();
		}
	}, [account]);

	const menuItems = [
		{
			key: "dashboard",
			label: <Link to="/dashboard">{t("dashboard:sidebar.index")}</Link>,
			icon: <FaHome />,
		},
		{
			key: "products",
			label: (
				<Link to="/dashboard/products">{t("dashboard:sidebar.products")}</Link>
			),
			icon: <FaBox />,
		},
		{
			key: "stores",
			label: (
				<Link to="/dashboard/stores">{t("dashboard:sidebar.stores")}</Link>
			),
			icon: <FaLandmark />,
		},
		{
			key: "warehouses",
			label: (
				<Link to="/dashboard/warehouses">
					{t("dashboard:sidebar.warehouses")}
				</Link>
			),
			icon: <BsPinMap />,
		},
		{
			key: "sales",
			label: <Link to="/dashboard/sales">{t("dashboard:sidebar.sales")}</Link>,
			icon: <FaMoneyBill />,
		},
		{
			key: "purchases",
			label: (
				<Link to="/dashboard/purchases">
					{t("dashboard:sidebar.purchases")}
				</Link>
			),
			icon: <FaHandHoldingUsd />,
		},
		{
			key: "suppliers",
			label: (
				<Link to="/dashboard/suppliers">
					{t("dashboard:sidebar.suppliers")}
				</Link>
			),
			icon: <FaTruckMoving />,
		},
		{
			key: "accounts",
			label: (
				<Link to="/dashboard/accounts">{t("dashboard:sidebar.accounts")}</Link>
			),
			icon: <FaUser />,
		},
		{
			key: "settings",
			label: (
				<Link to="/dashboard/settings">{t("dashboard:sidebar.settings")}</Link>
			),
			icon: <FaCog />,
		},
	];

	const isDark = account?.preferences.general.theme === "dark";

	return (
		<ConfigProvider
			locale={esES}
			theme={{
				algorithm: isDark ? theme.darkAlgorithm : undefined,
			}}
		>
			<Layout className={`${isDark ? "dark" : ""} min-h-screen`}>
				{/* Top Navbar */}
				<Header
					className="px-4 flex items-center justify-between bg-white dark:bg-neutral-800"
					style={{ paddingInline: 16 }}
				>
					<Button
						type="text"
						icon={<FaBars />}
						onClick={() => setDrawerVisible(true)}
						className="md:hidden text-xl"
					/>
					<h1 className="text-lg font-semibold text-black dark:text-white">
						{t("dashboard:sidebar.title")}
					</h1>
				</Header>

				<Layout hasSider>
					{/* Sidebar for desktop */}
					<Sider
						breakpoint="md"
						collapsible
						collapsed={collapsed}
						onCollapse={(value) => setCollapsed(value)}
						className="hidden md:block"
						theme={isDark ? "dark" : "light"}
						width={220}
					>
						<Menu
							mode="inline"
							defaultSelectedKeys={[selectedPage || "dashboard"]}
							items={menuItems}
							className="h-full"
						/>
					</Sider>

					{/* Sidebar Drawer for mobile */}
					<Drawer
						title="Menú"
						placement="left"
						onClose={() => setDrawerVisible(false)}
						open={drawerVisible}
					>
						<Menu
							mode="inline"
							defaultSelectedKeys={[selectedPage || "dashboard"]}
							items={menuItems}
							onClick={() => setDrawerVisible(false)}
						/>
					</Drawer>

					{/* Main Content */}
					<Layout style={{ background: "transparent" }}>
						<Content className="p-6 bg-white dark:bg-neutral-800 dark:text-white dark:border-neutral-700 border">
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
