import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Layout, Card, Row, Col, Typography, Button } from "antd";
import {
	FaStore,
	FaCogs,
	FaBoxes,
	FaTags,
	FaWarehouse,
	FaClipboardList,
	FaCashRegister,
	FaShoppingCart,
	FaTruck,
	FaUsers,
	FaUserShield,
} from "react-icons/fa";

import type { RootState } from "../../store";

import AuthFeature from "../../features/auth/";
import AdminPageLayout from "../../layouts/AdminLayout";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

const { Title, Paragraph } = Typography;
const { Content } = Layout;

function RouteComponent() {
	const navigate = useNavigate();
	const dispatch = useDispatch<typeof import("../../store").store.dispatch>();
	const { account } = useSelector((state: RootState) => state.auth);
	const { t } = useTranslation(["main"]);

	useEffect(() => {
		if (!account) {
			(async () => {
				const result = await dispatch(AuthFeature.actions.fetch());
				if (AuthFeature.actions.fetch.rejected.match(result)) {
					navigate({ to: "/auth/login" });
				}
			})();
		}
	}, [account, dispatch, navigate]);

	const quickLinks = [
		{
			title: t("dashboard:index.links.posTitle"), // "Punto de Venta"
			to: "/pos/",
			icon: <FaCashRegister size="3rem" color="#1890ff" />,
			buttonLabel: t("dashboard:index.links.posButton"), // "Ir al POS"
		},
		{
			title: t("dashboard:index.links.settingsTitle"), // "Configuraciones"
			to: "/dashboard/settings",
			icon: <FaCogs size="3rem" color="#1890ff" />,
			buttonLabel: t("dashboard:index.links.settingsButton"), // "Administrar Configuraciones"
		},
		{
			title: t("dashboard:index.links.productsTitle"), // "Productos"
			to: "/dashboard/products",
			icon: <FaBoxes size="3rem" color="#1890ff" />,
			buttonLabel: t("dashboard:index.links.productsButton"), // "Administrar Productos"
		},
		{
			title: t("dashboard:index.links.categoriesTitle"), // "Categorías"
			to: "/dashboard/products/categories",
			icon: <FaTags size="3rem" color="#1890ff" />,
			buttonLabel: t("dashboard:index.links.categoriesButton"), // "Ver Categorías"
		},
		{
			title: t("dashboard:index.links.storesTitle"), // "Tiendas"
			to: "/dashboard/stores",
			icon: <FaStore size="3rem" color="#1890ff" />,
			buttonLabel: t("dashboard:index.links.storesButton"), // "Ver Tiendas"
		},
		{
			title: t("dashboard:index.links.warehousesTitle"), // "Almacenes"
			to: "/dashboard/warehouses",
			icon: <FaWarehouse size="3rem" color="#1890ff" />,
			buttonLabel: t("dashboard:index.links.warehousesButton"), // "Ver Almacenes"
		},
		{
			title: t("dashboard:index.links.stockTitle"), // "Inventario"
			to: "/dashboard/warehouses/stock",
			icon: <FaClipboardList size="3rem" color="#1890ff" />,
			buttonLabel: t("dashboard:index.links.stockButton"), // "Ver Stock"
		},
		{
			title: t("dashboard:index.links.salesTitle"), // "Ventas"
			to: "/dashboard/sales",
			icon: <FaShoppingCart size="3rem" color="#1890ff" />,
			buttonLabel: t("dashboard:index.links.salesButton"), // "Ver Ventas"
		},
		{
			title: t("dashboard:index.links.purchasesTitle"), // "Compras"
			to: "/dashboard/purchases",
			icon: <FaTruck size="3rem" color="#1890ff" />,
			buttonLabel: t("dashboard:index.links.purchasesButton"), // "Ver Compras"
		},
		{
			title: t("dashboard:index.links.suppliersTitle"), // "Proveedores"
			to: "/dashboard/suppliers",
			icon: <FaUsers size="3rem" color="#1890ff" />,
			buttonLabel: t("dashboard:index.links.suppliersButton"), // "Ver Proveedores"
		},
		{
			title: t("dashboard:index.links.accountsTitle"), // "Usuarios"
			to: "/dashboard/accounts",
			icon: <FaUserShield size="3rem" color="#1890ff" />,
			buttonLabel: t("dashboard:index.links.accountsButton"), // "Administrar Usuarios"
		},
	];

	const greeting =
		new Date().getHours() < 12
			? t("dashboard:index.greetings.morning")
			: new Date().getHours() < 18
				? t("dashboard:index.greetings.afternoon")
				: t("dashboard:index.greetings.evening");

	return (
		<AdminPageLayout>
			<Content>
				{/* Greeting Section */}
				<Row justify="center" className="mb-12">
					<Col xs={24} sm={20} md={16} lg={12}>
						<Card className="rounded-lg shadow-md bg-gray-50">
							<Title level={3} style={{ color: "#1890ff", marginBottom: 8 }}>
								{greeting}, {account?.profile.name}
							</Title>
							<Paragraph type="secondary">
								{account?.email.value} — {t("dashboard:index.logout")}{" "}
								<Link to="/auth/logout" className="text-blue-500 underline">
									{t("dashboard:index.login")}
								</Link>
							</Paragraph>
						</Card>
					</Col>
				</Row>

				{/* Quick Links Grid */}
				<Row gutter={[24, 24]} justify="center">
					{quickLinks.map((link, index) => (
						<Col xs={24} sm={12} md={8} lg={6} key={index}>
							<Card
								hoverable
								className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-50 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
							>
								<div className="text-blue-500 mb-4 text-center flex justify-center w-full">
									{link.icon}
								</div>
								<Title level={5} className="mb-2 text-gray-800 text-center">
									{link.title}
								</Title>
								<Link to={link.to} className="w-full">
									<Button type="primary" block>
										{link.buttonLabel}
									</Button>
								</Link>
							</Card>
						</Col>
					))}
				</Row>
			</Content>
		</AdminPageLayout>
	);
}
