import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  Card,
  Carousel,
  Divider,
  Space,
} from "antd";
import {
  WalletOutlined,
  DashboardOutlined,
  LoginOutlined,
  LineChartOutlined,
  FileSearchOutlined,
  CloudServerOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";

import AuthFeature from "../features/auth/";
import type { RootState } from "../store";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

function RouteComponent() {
  const { t } = useTranslation(["main"]);
  const dispatch = useDispatch<typeof import("../store").store.dispatch>();
  const { account } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!account) dispatch(AuthFeature.actions.fetch());
  }, [account]);

  const quickLinks = [
    { name: t("home:login"), href: "/auth/login", icon: <LoginOutlined /> },
    {
      name: t("home:dashboard"),
      href: "/dashboard",
      icon: <DashboardOutlined />,
    },
    { name: t("home:expenses"), href: "/expenses", icon: <WalletOutlined /> },
  ];

  return (
    <div>
      <Content className="px-4 py-10 max-w-screen-xl mx-auto">
        {/* HERO */}
        <section className="mb-20 text-center">
          <Title level={1}>Vimar - MiFinanzas</Title>
          <Paragraph className="max-w-2xl mx-auto">
            {t("home:subtitle")}
          </Paragraph>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <Link to="/auth/login">
              <Button size="large">{t("home:cta")}</Button>
            </Link>
          </div>
        </section>

        {/* QUICK LINKS */}
        <section className="mb-14 text-center">
          <Title level={3}>{t("home:quickLinks")}</Title>
          <Row gutter={[16, 16]} justify="center" className="mt-4">
            {quickLinks.map((link) => (
              <Col key={link.href}>
                <Link to={link.href}>
                  <Button type="default" icon={link.icon} size="large">
                    {link.name}
                  </Button>
                </Link>
              </Col>
            ))}
          </Row>
        </section>

        {/* CAROUSEL */}
        <section className="mb-16 w-full mx-auto">
          <Carousel autoplay>
            {["overview", "analytics", "reports"].map((img) => (
              <div key={img}>
                <img
                  src={`/promo/${img}.png`}
                  alt={img}
                  className="w-full rounded"
                />
              </div>
            ))}
          </Carousel>
        </section>

        {/* FEATURES */}
        <section className="mb-20 text-center">
          <Title level={2}>{t("home:featuresTitle")}</Title>
          <Row gutter={[24, 24]} justify="center" className="mt-6">
            {[
              {
                title: t("home:features.assistant.title"),
                desc: t("home:features.assistant.desc"),
                icon: <FileSearchOutlined />,
              },
              {
                title: t("home:features.analytics.title"),
                desc: t("home:features.analytics.desc"),
                icon: <LineChartOutlined />,
              },
              {
                title: t("home:features.expenseTracker.title"),
                desc: t("home:features.expenseTracker.desc"),
                icon: <WalletOutlined />,
              },
              {
                title: t("home:features.integration.title"),
                desc: t("home:features.integration.desc"),
                icon: <CloudServerOutlined />,
              },
            ].map((feature, i) => (
              <Col xs={24} md={12} lg={6} key={i}>
                <Card hoverable>
                  <Space direction="vertical" align="center">
                    <div style={{ fontSize: "2rem", color: "#1890ff" }}>
                      {feature.icon}
                    </div>
                    <Title level={4}>{feature.title}</Title>
                    <Paragraph type="secondary">{feature.desc}</Paragraph>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* TESTIMONIALS */}
        <section className="mb-20 text-center">
          <Title level={3}>{t("home:testimonialsTitle")}</Title>
          <Carousel autoplay dots={true}>
            {["testimonial1", "testimonial2"].map((key, i) => (
              <div key={i}>
                <Paragraph italic className="max-w-xl mx-auto">
                  {t(`home:testimonials.${key}.text`)}
                  <br />
                  <Text strong>{t(`home:testimonials.${key}.author`)}</Text>
                </Paragraph>
              </div>
            ))}
          </Carousel>
        </section>

        <Divider />

        {/* SUPPORT */}
        <section className="text-center mb-20">
          <Title level={4}>{t("home:supportTitle")}</Title>
          <Paragraph>{t("home:supportDesc")}</Paragraph>
          <Space size="middle" className="mt-4">
            <Link to="/">
              <Button icon={<CustomerServiceOutlined />}>
                {t("home:contactSupport")}
              </Button>
            </Link>
            <Link to="/">
              <Button>{t("home:documentation")}</Button>
            </Link>
          </Space>
        </section>

        {/* FOOTER */}
        <section className="text-center text-gray-400 mb-4">
          <Text type="secondary">
            © {new Date().getFullYear()} Asterki Mi Products — {t("home:rights")}
          </Text>
        </section>
      </Content>
    </div>
  );
}
