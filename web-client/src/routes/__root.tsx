/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { App, Result, Button } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";

class ErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	{ hasError: boolean }
> {
	constructor(props: any) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(_error: any) {
		return { hasError: true };
	}

	componentDidCatch(error: any, errorInfo: any) {
		if (import.meta.env.MODE === "production") {
			// Optionally log the error to a service
			// logErrorToService(error, errorInfo);
		}
	}

	render() {
		if (this.state.hasError) {
			return import.meta.env.MODE === "production" ? <ErrorFallback /> : null;
		}

		return this.props.children;
	}
}

function ErrorFallback() {
	const { t } = useTranslation(["errors"]);
	const navigate = useNavigate();

	return (
		<div className="flex items-center justify-center min-h-screen px-4 w-full">
			<Result
				status="500"
				title={t("500.title")}
				subTitle={t("500.description")}
				extra={
					<Button type="primary" onClick={() => navigate({ to: "/" })}>
						{t("500.back")}
					</Button>
				}
			/>
		</div>
	);
}

export const Route = createRootRoute({
	component: () => (
		<App>
			<ErrorBoundary>
				<Outlet />
			</ErrorBoundary>
			{import.meta.env.MODE === "development" && <TanStackRouterDevtools />}
		</App>
	),
});
