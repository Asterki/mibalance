import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useTranslation } from "react-i18next";

import AuthFeature from "../../features/auth/";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";

import { Button } from "antd";

export const Route = createFileRoute("/auth/logout")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const dispatch = useDispatch<typeof import("../../store").store.dispatch>();
	const { account } = useSelector((state: RootState) => state.auth);

	const { t } = useTranslation(["accounts"]);

	const logout = async () => {
		const result = await dispatch(AuthFeature.actions.logout());
		if (result.type === "accounts/logout/fulfilled") {
			navigate({
				to: "/",
			});
		}
	};

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

	return (
		<div>
			{account && (
				<main className="min-h-screen flex items-center justify-center">
					<div className="rounded-md p-4 shadow-md bg-neutral-100 dark:bg-neutral-700">
						<div className="text-2xl font-bold text-center">
							{t("logout.title")}
						</div>
						<div className="text-center">
							<p>{t("logout.description")}</p>
							<Button
								className="mt-4"
								type="primary"
								variant="solid"
								color="red"
								onClick={logout}
							>
								{t("logout.button")}
							</Button>

							<br />

							<Button
								className="mt-4"
								type="default"
								variant="solid"
								onClick={() => {
									navigate({
										to: "/home",
									});
								}}
							>
								{t("logout.cancel")}
							</Button>
						</div>
					</div>
				</main>
			)}

			{!account && <p>Loading your account...</p>}
		</div>
	);
}
