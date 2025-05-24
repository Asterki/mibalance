import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { notification } from "antd";
import { z } from "zod";

import { FaSpinner } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import AuthFeature from "../../features/auth/";

export const Route = createFileRoute("/auth/forgot-password")({
	component: RouteComponent,
});

function RouteComponent() {
	const { t } = useTranslation(["accounts"]);
	const dispatch = useDispatch<typeof import("../../store").store.dispatch>();
	const { loading } = useSelector((state: RootState) => state.auth);

	const emailInput = useRef<HTMLInputElement>(null);

	const handleForgotPassword = async () => {
		try {
			const parsedData = z
				.object({
					email: z.string().email(),
				})
				.safeParse({
					email: emailInput.current?.value || "",
				});

			if (!parsedData.success) {
				dispatch(AuthFeature.authSlice.actions.setError("invalid-parameters"));
				notification.error({
					message: t("forgotPassword.errorTitle"),
					description: t("forgotPassword.errors.invalid-parameters"),
				});
				return;
			}

			const result = await AuthFeature.authApi.forgotPassword({
				email: parsedData.data.email,
			});

			if (result.status !== "success") {
				dispatch(AuthFeature.authSlice.actions.setError(result.status));
				notification.error({
					message: t("forgotPassword.errorTitle"),
					description: t(`forgotPassword.errors.${result.status}`),
				});
			} else {
				dispatch(AuthFeature.authSlice.actions.clearError());
				notification.success({
					message: t("forgotPassword.emailSent"),
					description: t("forgotPassword.emailSentDescription"),
				});
			}
		} catch (error: unknown) {
			console.log(error);
			notification.error({
				message: t("forgotPassword.errorTitle"),
				description: t("forgotPassword.unexpectedError"),
			});
		}
	};

	return (
		<div>
			<main className="flex flex-col justify-center items-center min-h-screen">
				<h1 className="text-2xl font-semibold p-2">
					{t("forgotPassword.title")}
				</h1>

				<p>{t("forgotPassword.desc")}</p>

				<form
					className="border rounded-sm p-4 md:w-1/4 w-full shadow-md"
					onSubmit={(e) => {
						e.preventDefault();
						handleForgotPassword();
					}}
				>
					<div className="mb-4">
						<label>{t("forgotPassword.fields.email")}</label> <br />
						<input
							ref={emailInput}
							type="email"
							autoComplete="email"
							className="input"
							placeholder={t("forgotPassword.fields.emailPlaceholder")}
						/>
					</div>
					<button
						type="submit"
						className="bg-primary hover:brightness-110 transition-all text-white rounded-sm p-1 w-full text-center flex items-center justify-center"
					>
						{loading ? (
							<FaSpinner className="animate-spin" />
						) : (
							t("forgotPassword.submit")
						)}
					</button>
				</form>
			</main>
		</div>
	);
}
