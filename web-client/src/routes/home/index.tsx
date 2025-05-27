import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Layout, Card, Row, Col, Typography, Button } from "antd";
import {
  FaCog,
  FaUserCircle,
  FaWallet,
  FaExchangeAlt,
  FaFileInvoice,
} from "react-icons/fa";

import type { RootState } from "../../store";

import AuthFeature from "../../features/auth/";
import HomeLayout from "../../layouts/HomeLayout";

export const Route = createFileRoute("/home/")({
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
      title: t("dashboard:links.settingsTitle", "Configuraciones"),
      to: "/home/settings",
      icon: <FaCog size="3rem" color="#1890ff" />,
      buttonLabel: t("dashboard:links.settingsButton", "Administrar"),
    },
    {
      title: t("dashboard:links.profileTitle", "Perfil"),
      to: "/home/profile",
      icon: <FaUserCircle size="3rem" color="#1890ff" />,
      buttonLabel: t("dashboard:links.profileButton", "Ver Perfil"),
    },
    {
      title: t("dashboard:links.walletsTitle", "Billeteras"),
      to: "/home/wallets",
      icon: <FaWallet size="3rem" color="#1890ff" />,
      buttonLabel: t("dashboard:links.walletsButton", "Ver Billeteras"),
    },
    {
      title: t("dashboard:links.transactionsTitle", "Transacciones"),
      to: "/home/transactions",
      icon: <FaExchangeAlt size="3rem" color="#1890ff" />,
      buttonLabel: t("dashboard:links.transactionsButton", "Ver Transacciones"),
    },
    {
      title: t("dashboard:links.budgetsTitle", "Presupuestos"),
      to: "/home/budgets",
      icon: <FaFileInvoice size="3rem" color="#1890ff" />,
      buttonLabel: t("dashboard:links.budgetsButton", "Ver Presupuestos"),
    },
  ];

  const greeting =
    new Date().getHours() < 12
      ? t("dashboard:greetings.morning", "Buenos días")
      : new Date().getHours() < 18
        ? t("dashboard:greetings.afternoon", "Buenas tardes")
        : t("dashboard:greetings.evening", "Buenas noches");

  return (
    <HomeLayout>
      <Content>
        {/* Greeting Section */}
        <Row justify="center" className="mb-12">
          <Col xs={24} sm={20} md={16} lg={12}>
            <Card className="rounded-lg shadow-md bg-gray-50 dark:bg-neutral-700">
              <Title level={3} style={{ color: "#1890ff", marginBottom: 8 }}>
                {greeting}, {account?.profile.name}
              </Title>
              <Paragraph type="secondary">
                {account?.email.value} —{" "}
                <Link to="/auth/logout" className="text-blue-500 underline">
                  {t("dashboard:logout", "Cerrar sesión")}
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
                className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-50 dark:bg-neutral-700 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
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
    </HomeLayout>
  );
}
