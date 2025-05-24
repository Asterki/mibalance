import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { notification } from "antd";

import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import AuthFeature from "../../features/auth";

import { useTranslation } from "react-i18next";

const pageSearchSchema = z.object({
	token: fallback(z.string(), "no-token"),
});

export const Route = createFileRoute("/auth/verify-email")({
	component: RouteComponent,
	validateSearch: zodValidator(pageSearchSchema),
});

function RouteComponent() {
	const search = Route.useSearch();
	const navigate = useNavigate();
	const { t } = useTranslation(["accounts"]);

	useEffect(() => {
		(async () => {
			try {
				if (search.token === "no-token") {
					notification.error({
						message: t("verify-email.no-token"),
						description: t("verify-email.no-token-description"),
					});
					return;
				}

				// Call the API to verify the email
				const result = await AuthFeature.authApi.verifyEmail({
					token: search.token,
				});

				if (result.status === "success") {
					notification.success({
						message: t("verify-email.success"),
						description: t("verify-email.success-description"),
					});
					navigate({ to: "/auth/login" });
				} else {
					notification.error({
						message: t("verify-email.error"),
						description: t("verify-email.error-description"),
					});
					navigate({ to: "/auth/login" });
				}
			} catch (_error: Error | unknown) {
				notification.error({
					message: t("verify-email.error"),
					description: t("verify-email.unexpected-error"),
				});
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div>...</div>;
}
