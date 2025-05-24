import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { useEffect, useRef } from "react";
import { z } from "zod";

import { notification } from "antd";
import { useTranslation } from "react-i18next";

import AccountsFeature from "../../features/auth/";

const pageSearchSchema = z.object({
	token: fallback(z.string(), "no-token"),
});

export const Route = createFileRoute("/auth/reset-password")({
	component: RouteComponent,
	validateSearch: zodValidator(pageSearchSchema),
});

function RouteComponent() {
	const search = Route.useSearch();
	const navigate = useNavigate();
	const { t } = useTranslation(["accounts"]);

	const passwordInput = useRef<HTMLInputElement>(null);
	const repeatPasswordInput = useRef<HTMLInputElement>(null);

	const handlePasswordRecovery = async () => {
		const parsedData = z
			.object({
				password: z
					.string()
					.nonempty({ message: "password-required" })
					.min(8, { message: "password-too-short" })
					.max(255, { message: "password-too-long" }),
				repeatPassword: z
					.string()
					.nonempty({ message: "repeat-password-required" })
					.min(8, { message: "repeat-password-too-short" })
					.max(255, { message: "repeat-password-too-long" }),
			})
			.refine((data) => data.password === data.repeatPassword, {
				message: "passwords-mismatch",
				path: ["repeatPassword"],
			})
			.safeParse({
				password: passwordInput.current?.value || "",
				repeatPassword: repeatPasswordInput.current?.value || "",
			});

		if (!parsedData.success || !parsedData.data) {
			return notification.error({
				message: t("reset-password.errorTitle"),
				description: t(`reset-password.${parsedData.error.errors[0].message}`),
			});
		} else {
			const result = await AccountsFeature.authApi.resetPassword({
				token: search.token,
				newPassword: parsedData.data.password,
			});

			if (result.status == "success") {
				notification.success({
					message: t("reset-password.success"),
					description: t("reset-password.successDescription"),
				});
				navigate({ to: "/auth/login" });
			} else {
				notification.error({
					message: t("reset-password.errorTitle"),
					description: t(`reset-password.${result.status}`),
				});
			}
		}
	};

	useEffect(() => {
		if (search.token === "no-token") {
			notification.error({
				message: t("reset-password.errorTitle"),
				description: t("reset-password.no-token"),
			});
			navigate({ to: "/auth/login" });
		}
	}, [search.token, navigate, t]);

	return (
		<div>
			<main className="flex flex-col justify-center items-center min-h-screen">
				<h1 className="text-2xl font-semibold p-2">{t("reset.title")}</h1>

				<p>{t("reset-password.description")}</p>

				<form
					className="border rounded-md p-4 md:w-1/4 w-full shadow-md"
					onSubmit={(e) => {
						e.preventDefault();
						handlePasswordRecovery();
					}}
				>
					<div className="mb-4">
						<label>{t("register.fields.password")}</label> <br />
						<input
							ref={passwordInput}
							type="password"
							autoComplete="current-password"
							className="input"
							placeholder="••••••••"
						/>
					</div>
					<div className="mb-4">
						<label>{t("reset-password.fields.repeatPassword")}</label> <br />
						<input
							ref={repeatPasswordInput}
							type="password"
							autoComplete="current-password"
							className="input"
							placeholder="••••••••"
						/>
					</div>
					<button
						type="submit"
						className="bg-primary hover:brightness-110 transition-all text-white rounded-md p-1 w-full text-center flex items-center justify-center"
					>
						{t("reset-password.submit")}
					</button>
				</form>

				<div className="mt-2">
					<p>
						<Link className="text-primary hover:underline" to="/auth/login">
							{t("reset-password.login")}
						</Link>
					</p>
				</div>
			</main>
		</div>
	);
}
