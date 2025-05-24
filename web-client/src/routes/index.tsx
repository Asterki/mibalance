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
	ShoppingCartOutlined,
	DashboardOutlined,
	LoginOutlined,
	RobotOutlined,
	BarChartOutlined,
	CloudServerOutlined,
	CustomerServiceOutlined,
} from "@ant-design/icons";

import AuthFeature from "../features/auth/";
import type { RootState } from "../store";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

function RouteComponent() {
	const dispatch = useDispatch<typeof import("../store").store.dispatch>();
	const { account } = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		if (!account) dispatch(AuthFeature.actions.fetch());
	}, [account]);

	const quickLinks = [
		{ name: "Login", href: "/auth/login", icon: <LoginOutlined /> },
		{ name: "Dashboard", href: "/dashboard", icon: <DashboardOutlined /> },
		{ name: "POS", href: "/pos", icon: <ShoppingCartOutlined /> },
	];

	return (
		<div>
			<Content className="px-4 py-10 max-w-screen-xl mx-auto">
				{/* HERO */}
				<section className="mb-20 text-center">
					<Title level={1}>Vimar - MiCuadro</Title>
					<Paragraph className="max-w-2xl mx-auto">
						The smart platform for managing sales, inventory, and customer
						experiences — built for speed, simplicity, and full offline control.
					</Paragraph>
					<div className="flex justify-center gap-4 mt-6 flex-wrap">
						<Link to="/auth/login">
							<Button size="large">
								I Already Have an Account
							</Button>
						</Link>
					</div>
				</section>

				{/* QUICK LINKS */}
				<section className="mb-14 text-center">
					<Title level={3}>Jump Into Action</Title>
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
						{["stock", "roles", "products"].map((img) => (
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
					<Title level={2}>Powerful Features That Work for You</Title>
					<Row gutter={[24, 24]} justify="center" className="mt-6">
						{[
							{
								title: "Smart Assistant",
								desc: "Ask anything — Vimar AI helps you generate invoices, find reports, or automate tasks instantly.",
								icon: <RobotOutlined />,
							},
							{
								title: "Insights & Analytics",
								desc: "Track sales, margins, and trends with stunning dashboards and exportable reports.",
								icon: <BarChartOutlined />,
							},
							{
								title: "Offline-Ready POS",
								desc: "Serve customers with zero downtime. Our POS works even when you're disconnected.",
								icon: <ShoppingCartOutlined />,
							},
							{
								title: "Integration Hub",
								desc: "Seamlessly connect with payment gateways, accounting apps, and more.",
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
					<Title level={3}>Users Say It's a Game Changer</Title>
					<Carousel autoplay dots={true}>
						{[
							{
								text: `"Finally a POS that works even during power outages. Saved our store more than once."`,
								author: "— Ana M., Grocery Owner",
							},
							{
								text: `"The AI assistant helped generate tax reports in seconds. Incredibly helpful."`,
								author: "— Luis G., Retail Manager",
							},
						].map((testimonial, i) => (
							<div key={i}>
								<Paragraph italic className="max-w-xl mx-auto">
									{testimonial.text}
									<br />
									<Text strong>{testimonial.author}</Text>
								</Paragraph>
							</div>
						))}
					</Carousel>
				</section>

				<Divider />

				{/* SUPPORT */}
				<section className="text-center mb-20">
					<Title level={4}>Need Help Getting Started?</Title>
					<Paragraph>
						Our support team is ready to guide you. Check the docs or open a
						ticket now.
					</Paragraph>
					<Space size="middle" className="mt-4">
						<Link to="/">
							<Button icon={<CustomerServiceOutlined />}>
								Contact Support
							</Button>
						</Link>
						<Link to="/">
							<Button>View Documentation</Button>
						</Link>
					</Space>
				</section>

				{/* FOOTER */}
				<section className="text-center text-gray-400 mb-4">
					<Text type="secondary">
						© {new Date().getFullYear()} Vimar — All rights reserved.
					</Text>
				</section>
			</Content>
		</div>
	);
}
