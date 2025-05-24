import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
	FaUserTimes,
	FaRandom,
	FaSave,
	FaUserShield,
	FaEnvelope,
	FaPhotoVideo,
} from "react-icons/fa";

import { Button, Select, Input, Modal, Upload, notification } from "antd";
import ImgCrop from "antd-img-crop";

import { useTranslation } from "react-i18next";
import { z } from "zod";

import ProfileFeature from "../../features/profile/";

import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export const Route = createFileRoute("/profile/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { account } = useSelector((state: RootState) => state.auth);

	const [api, contextHolder] = notification.useNotification();

	const { t } = useTranslation(["profile"]);

	// Profile Related
	const [stagedProfile, setStagedProfile] = useState<{
		name: string;
	}>({
		name: "",
	});

	const [stagedPreferences, setStagedPreferences] = useState<{
		theme: string;
		language: string;
	}>({
		theme: "",
		language: "",
	});
	const [changeProfilePictureWindowOpen, setChangeProfilePictureWindowOpen] =
		useState(false);

	const saveStagedProfileChanges = async () => {
		const result = await ProfileFeature.api.updateProfile({
			name: stagedProfile.name == "" ? undefined : stagedProfile.name,
		});
		if (result.status == "success")
			api.success({ message: t("messages.profile-updated") });
		else {
			api.error({ message: t(`messages.${result.status}`) });
		}
	};

	const saveStagedProfilePreferences = async () => {
		const result = await ProfileFeature.api.updatePreferences({
			theme: stagedPreferences.theme as "dark" | "light",
			language: stagedPreferences.language as "en" | "es",
		});

		if (result.status == "success") {
			api.success({ message: t("messages.profile-updated") });
			setTimeout(() => {
				window.location.reload();
			}, 5000);
		} else {
			api.error({ message: t(`messages.${result.status}`) });
		}
	};

	// Two Factor Related
	const [tfaState, setTfaState] = useState<{
		windowOpen: boolean;
		secret: string;
		secretQR: string;
		tfaCode: string;
		password: string;
	}>({
		windowOpen: false,
		secret: "",
		secretQR: "",
		tfaCode: "",
		password: "",
	});
	const twoFactorMethods = {
		async generateSecret() {
			// const { secret, otpauth } =
			// 	await AccountsFeature.accountsApi.generateTFASecret();
			//
			// if (!secret || !otpauth) {
			// 	notification.error({
			// 		message: t("messages.failed-to-generate-secret"),
			// 	});
			// } else {
			// 	const qrCode = await QRCode.toDataURL(otpauth);
			// 	setTfaState({
			// 		windowOpen: true,
			// 		secret: secret,
			// 		secretQR: qrCode,
			// 		tfaCode: "",
			// 		password: "",
			// 	});
			// }
		},

		async enableTwoFactor() {
			// const result = await AccountsFeature.accountsApi.enableTwoFactor({
			// 	secret: tfaState.secret,
			// 	tfaCode: tfaState.tfaCode,
			// 	password: tfaState.password,
			// });
			//
			// if (result.status == "success") {
			// 	api.success({
			// 		message: t("messages.two-factor-enabled"),
			// 	});
			//
			// 	setTfaState({
			// 		password: "",
			// 		tfaCode: "",
			// 		secret: "",
			// 		secretQR: "",
			// 		windowOpen: false,
			// 	});
			// } else {
			// 	api.error({ message: t(`messages.${result.status}`) });
			// }
		},

		async disableTwoFactor() {
		// 	const result = await AccountsFeature.accountsApi.disableTwoFactor({
		// 		tfaCode: tfaState.tfaCode,
		// 		password: tfaState.password,
		// 	});
		//
		// 	if (result.status == "success") {
		// 		api.success({
		// 			message: t("messages.two-factor-disabled"),
		// 		});
		//
		// 		setTfaState({
		// 			password: "",
		// 			tfaCode: "",
		// 			secret: "",
		// 			secretQR: "",
		// 			windowOpen: false,
		// 		});
		// 	} else {
		// 		api.error({ message: t(`messages.${result.status}`) });
		// 	}
		},
	};

	// Change Password
	const [changePasswordState, setChangePasswordState] = useState<{
		modalOpen: boolean;
		currentPassword: string;
		newPassword: string;
		confirmPassword: string;
	}>({
		modalOpen: false,
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const changePasswordClickHandler = async () => {
		const parsedData = z
			.object({
				currentPassword: z
					.string()
					.nonempty({ message: "current-password-required" }),
				newPassword: z.string().nonempty({ message: "new-password-required" }),
				confirmPassword: z
					.string()
					.nonempty({ message: "confirm-password-required" }),
			})
			.refine((data) => data.newPassword === data.confirmPassword, {
				message: "passwords-mismatch",
			})
			.safeParse({
				currentPassword: changePasswordState.currentPassword,
				newPassword: changePasswordState.newPassword,
				confirmPassword: changePasswordState.confirmPassword,
			});

		if (!parsedData.success || !parsedData.data) {
			api.error({
				message: t(`messages.${parsedData.error.errors[0].message}`),
			});
			return;
		}

		// const result = await AccountsFeature.accountsApi.changePassword({
		// 	newPassword: changePasswordState.newPassword,
		// 	currentPassword: changePasswordState.currentPassword,
		// });
		//
		// if (result.status == "success") {
		// 	api.success({
		// 		message: t("messages.password-updated"),
		// 	});
		// 	setChangePasswordState({
		// 		...changePasswordState,
		// 		modalOpen: false,
		// 	});
		// } else {
		// 	api.error({
		// 		message: t(`messages.${result.status}`),
		// 	});
		// }
	};

	// Change Email
	const [changeEmailState, setChangeEmailState] = useState<{
		modalOpen: boolean;
		newEmail: string;
		password: string;
	}>({
		modalOpen: false,
		newEmail: "",
		password: "",
	});
	const changeEmailClickHandler = async () => {
		const parsedData = z
			.object({
				newEmail: z
					.string()
					.nonempty({ message: "new-email-required" })
					.email({ message: "invalid-email" }),
				password: z.string().nonempty({ message: "password-required" }),
			})
			.safeParse({
				newEmail: changeEmailState.newEmail,
				password: changeEmailState.password,
			});

		if (!parsedData.success || !parsedData.data) {
			api.error({
				message: t(`messages.${parsedData.error.errors[0].message}`),
			});
			return;
		}

		// const result = await AccountsFeature.accountsApi.changeEmail({
		// 	newEmail: changeEmailState.newEmail,
		// 	password: changeEmailState.password,
		// });
		//
		// if (result.status == "success") {
		// 	api.success({ message: t("messages.email-updated") });
		// 	setChangeEmailState({
		// 		...changeEmailState,
		// 		modalOpen: false,
		// 	});
		// } else {
		// 	api.error({ message: t(`messages.${result.status}`) });
		// }
	};

	// const requestVerificationEmailClickHandler = async () => {
	// 	const result = await AccountsFeature.accountsApi.requestEmailVerification();
	// 	if (result.status == "success") {
	// 		api.success({ message: t("verification-email-sent") });
	// 	} else {
	// 		api.error({ message: t(`messages.${result.status}`) });
	// 	}
	// };

	const [deleteAccountState, setDeleteAccountState] = useState<{
		modalOpen: boolean;
		password: string;
		tfaCode?: string;
	}>({ modalOpen: false, password: "", tfaCode: undefined });
	const deleteAccountClickHandler = async () => {
		const parsedData = z
			.object({
				password: z.string().nonempty({ message: "password-required" }),
				tfaCode: z.string().optional(),
			})
			.safeParse({
				password: deleteAccountState.password,
				tfaCode: deleteAccountState.tfaCode,
			});

		if (!parsedData.success || !parsedData.data) {
			api.error({
				message: t(`messages.${parsedData.error.errors[0].message}`),
			});
			return;
		}

		// const result = await AccountsFeature.accountsApi.deleteAccount({
		// 	password: deleteAccountState.password,
		// 	tfaCode: deleteAccountState.tfaCode,
		// });
		//
		// if (result.status == "success") {
		// 	api.success({ message: t("messages.delete-success") });
		// 	setDeleteAccountState({
		// 		...deleteAccountState,
		// 		modalOpen: false,
		// 	});
		// 	setTimeout(() => {
		// 		window.location.href = "/";
		// 	}, 5000);
		// } else {
		// 	api.error({
		// 		message: t(`errors.delete-account.${result.status}`),
		// 	});
		// }
	};

	// Hooks
	useEffect(() => {
		if (account) {
			setStagedProfile({
				name: account?.profile.name || "",
			});

			setStagedPreferences({
				theme: account?.preferences.general.theme || "",
				language: account?.preferences.general.language || "",
			});
		}
	}, [account]);

	return (
		<div
		>
			{contextHolder}
			{account && (
				<main className="my-20 px-2">
					{/* Windows and modals */}
					<Modal
						open={tfaState.windowOpen}
						onClose={() => setTfaState({ ...tfaState, windowOpen: false })}
						onCancel={() => setTfaState({ ...tfaState, windowOpen: false })}
						title={t("modals.tfa.title")}
						footer={[
							<Button
								onClick={() => setTfaState({ ...tfaState, windowOpen: false })}
							>
								{t("modals.tfa.close")}
							</Button>,
							<Button
								variant="solid"
								color="green"
								onClick={() => twoFactorMethods.enableTwoFactor()}
								hidden={
									account && account.preferences.security.twoFactorEnabled
								}
							>
								{t("modals.tfa.enable.submit")}
							</Button>,
							<Button
								variant="solid"
								color="red"
								onClick={() => twoFactorMethods.disableTwoFactor()}
								hidden={
									account && !account.preferences.security.twoFactorEnabled
								}
							>
								{t("modals.tfa.disable.disable")}
							</Button>,
						]}
					>
						{account && !account.preferences.security.twoFactorEnabled && (
							<div className="flex flex-col items-center justify-center gap-2">
								<h2 className="font-lg">{t("modals.tfa.enable.text-1")}</h2>
								<h2 className="font-lg">{t("modals.tfa.enable.text-2")}</h2>

								<div className="flex items-center justify-center flex-col">
									<img src={tfaState.secretQR} alt="QR Code" />
									<p>
										{t("modals.tfa.enable.secret")}: {tfaState.secret}
									</p>
								</div>

								<Input
									type="text"
									placeholder={t("modals.tfa.enable.code")}
									onChange={(e) =>
										setTfaState({ ...tfaState, tfaCode: e.target.value })
									}
									value={tfaState.tfaCode}
								/>

								<Input
									type="password"
									placeholder={t("modals.tfa.enable.password")}
									onChange={(e) =>
										setTfaState({ ...tfaState, password: e.target.value })
									}
								/>
							</div>
						)}

						{account && account.preferences.security.twoFactorEnabled && (
							<div className="flex flex-col items-center justify-center gap-2">
								<h2 className="font-lg">{t("modals.tfa.disable.text")}</h2>

								<Input
									type="password"
									placeholder={t("modals.tfa.enable.password")}
									onChange={(e) =>
										setTfaState({ ...tfaState, password: e.target.value })
									}
								/>

								<Input
									type="text"
									placeholder={t("modals.tfa.enable.code")}
									onChange={(e) =>
										setTfaState({ ...tfaState, tfaCode: e.target.value })
									}
								/>
							</div>
						)}
					</Modal>

					<Modal
						open={changePasswordState.modalOpen}
						cancelText={t("modals.updatePassword.cancel")}
						onCancel={() =>
							setChangePasswordState({
								...changePasswordState,
								modalOpen: false,
							})
						}
						onClose={() =>
							setChangePasswordState({
								...changePasswordState,
								modalOpen: false,
							})
						}
						okText={t("modals.updatePassword.submit")}
						onOk={() => changePasswordClickHandler()}
						title={t("modals.updatePassword.title")}
					>
						<div className="flex flex-col items-center justify-center gap-2">
							<h2 className="font-lg w-full text-left">
								{t("modals.updatePassword.text")}
							</h2>

							<Input
								type="password"
								placeholder={t("modals.updatePassword.current")}
								onChange={(e) =>
									setChangePasswordState({
										...changePasswordState,
										currentPassword: e.target.value,
									})
								}
							/>

							<Input
								type="password"
								placeholder={t("modals.updatePassword.new")}
								onChange={(e) =>
									setChangePasswordState({
										...changePasswordState,
										newPassword: e.target.value,
									})
								}
							/>

							<Input
								type="password"
								placeholder={t("modals.updatePassword.confirm")}
								onChange={(e) =>
									setChangePasswordState({
										...changePasswordState,
										confirmPassword: e.target.value,
									})
								}
							/>
						</div>
					</Modal>

					<Modal
						open={changeEmailState.modalOpen}
						cancelText={t("modals.updateEmail.cancel")}
						onCancel={() =>
							setChangeEmailState({ ...changeEmailState, modalOpen: false })
						}
						onClose={() =>
							setChangeEmailState({
								...changeEmailState,
								modalOpen: false,
							})
						}
						okText={t("modals.updateEmail.submit")}
						onOk={() => changeEmailClickHandler()}
						title={t("modals.updateEmail.title")}
					>
						<div className="flex flex-col items-center justify-center gap-2">
							<h2 className="font-lg w-full text-left">
								{t("modals.updateEmail.text")}
							</h2>
							<Input
								type="email"
								placeholder={t("modals.updateEmail.new")}
								onChange={(e) =>
									setChangeEmailState({
										...changeEmailState,
										newEmail: e.target.value,
									})
								}
							/>

							<Input
								type="password"
								placeholder={t("modals.updateEmail.current")}
								onChange={(e) =>
									setChangeEmailState({
										...changeEmailState,
										password: e.target.value,
									})
								}
							/>
						</div>
					</Modal>

					<Modal
						open={deleteAccountState.modalOpen}
						cancelText={t("modals.deleteAccount.cancel")}
						onCancel={() =>
							setDeleteAccountState({ ...deleteAccountState, modalOpen: false })
						}
						onClose={() =>
							setDeleteAccountState({
								...deleteAccountState,
								modalOpen: false,
							})
						}
						okText={t("modals.deleteAccount.submit")}
						onOk={() => deleteAccountClickHandler()}
						title={t("modals.deleteAccount.title")}
					>
						<div className="flex flex-col items-center justify-center gap-2">
							<h2 className="font-lg w-full">
								Enter your password to delete your account, this action is
								permanent
							</h2>

							<Input
								type="password"
								placeholder={t("modals.deleteAccount.password")}
								onChange={(e) =>
									setDeleteAccountState({
										...deleteAccountState,
										password: e.target.value,
									})
								}
							/>

							{account && account.preferences.security.twoFactorEnabled && (
								<Input
									type="text"
									placeholder={t("modals.deleteAccount.twoFactor")}
									onChange={(e) =>
										setDeleteAccountState({
											...deleteAccountState,
											tfaCode: e.target.value,
										})
									}
								/>
							)}
						</div>
					</Modal>

					<h1 className="text-2xl mt-2">
						{t("welcome", { name: account.profile.name })}
					</h1>

					<fieldset className="border dark:border-neutral-600 rounded-md p-2">
						<legend className="font-bold">{t("personal.title")}</legend>

						<p>{t("personal.displayName")}</p>
						<Input
							type="text"
							placeholder="Your Name"
							onChange={(e) =>
								setStagedProfile({
									...stagedProfile,
									name: e.target.value,
								})
							}
							defaultValue={account.profile.name}
						/>

						<p className="mt-2">{t("personal.changeProfilePicture")}</p>
						<Button
							type="primary"
							onClick={() => setChangeProfilePictureWindowOpen(true)}
							icon={<FaPhotoVideo className="inline-block" />}
						>
							{t("personal.changeProfilePicture")}
						</Button>
						<Modal
							open={changeProfilePictureWindowOpen}
							onCancel={() => setChangeProfilePictureWindowOpen(false)}
							title={t("personal.changeProfilePicture")}
							okButtonProps={{ hidden: true }}
							cancelText={t("personal.cancel")}
						>
							<p>{t("personal.uploadProfilePicture")}</p>

							<ImgCrop rotationSlider>
								<Upload
									withCredentials={true}
									accept="image/*"
									action={`${import.meta.env.VITE_SERVER_URL}/api/files/upload`}
									data={{
										folder: "profile-pictures",
									}}
									onChange={async (data) => {
										if (data.file.status == "done") {
											const result = await ProfileFeature.api.updateProfile({
												avatarUrl: `/${data.file.response.file.filePath}/${data.file.response.file._id}.${data.file.response.file.metadata.type.split("/")[1]}`,
											});
											if (result.status == "success") {
												api.success({
													message: t("messages.profile-picture-updated"),
												});
											} else {
												api.error({
													message: t(`messages.${result.status}`),
												});
											}

											setChangeProfilePictureWindowOpen(false);
										}
									}}
									type="drag"
									className="mt-2"
									multiple={false}
								>
									<FaPhotoVideo className="inline-block" />
									<p>{t("personal.dragndrop")}</p>
								</Upload>
							</ImgCrop>

							<img src="" alt="" />
						</Modal>
						<br />

						<Button
							type="primary"
							className="mt-2"
							onClick={() => saveStagedProfileChanges()}
							icon={<FaSave className="inline-block" />}
						>
							{t("saveChanges")}
						</Button>
					</fieldset>

					<fieldset className="items-start dark:border-neutral-600 border rounded-md mt-8 p-2">
						<legend className="font-bold">{t("preferences.title")}</legend>

						<p>{t("preferences.displayLanguage")}</p>
						<Select
							onChange={(lang) =>
								setStagedPreferences({
									...stagedPreferences,
									language: lang,
								})
							}
							className="w-full"
							defaultValue={account.preferences.general.language}
							options={[
								{ label: t("preferences.english"), value: "en" },
								{ label: t("preferences.spanish"), value: "es" },
							]}
						/>

						<p className="mt-4">{t("preferences.theme")}</p>
						<Select
							onChange={(theme) =>
								setStagedPreferences({
									...stagedPreferences,
									theme: theme,
								})
							}
							className="w-full"
							defaultValue={account.preferences.general.theme}
							options={[
								{ label: t("preferences.dark"), value: "dark" },
								{ label: t("preferences.light"), value: "light" },
							]}
						/>

						<br />

						<Button
							type="primary"
							className="mt-4"
							onClick={() => saveStagedProfilePreferences()}
							icon={<FaSave className="inline-block" />}
						>
							{t("saveChanges")}
						</Button>
					</fieldset>

					<fieldset className="border dark:border-neutral-600 rounded-md mt-8 p-2">
						<legend className="font-bold">{t("security.title")}</legend>

						<div className="flex items-center justify-start gap-2 flex-row">
							<Button
								variant="solid"
								color={
									account.preferences.security.twoFactorEnabled
										? "red"
										: "green"
								}
								onClick={() => twoFactorMethods.generateSecret()}
								icon={<FaUserShield className="inline-block" />}
							>
								{account && account.preferences.security.twoFactorEnabled
									? t("security.disableTwoFactor")
									: t("security.enableTwoFactor")}
							</Button>

							<Button
								type="primary"
								onClick={() => {
									setChangePasswordState({
										...changePasswordState,
										modalOpen: true,
									});
								}}
								icon={<FaRandom className="inline-block" />}
							>
								{t("security.changePassword")}
							</Button>

							<Button
								type="primary"
								onClick={() => {
									setChangeEmailState({
										...changeEmailState,
										modalOpen: true,
									});
								}}
								icon={<FaEnvelope className="inline-block" />}
							>
								{t("security.changeEmail")}
							</Button>

							{account && !account.email.verified && (
								<Button
									type="primary"
									onClick={() => {
										// requestVerificationEmailClickHandler();
									}}
								>
									<FaEnvelope className="inline-block" />{" "}
									{t("security.resendVerificationEmail")}
								</Button>
							)}

							<Button
								type="primary"
								variant="solid"
								color="red"
								onClick={() =>
									setDeleteAccountState({
										...deleteAccountState,
										modalOpen: true,
									})
								}
								icon={<FaUserTimes className="inline-block" />}
							>
								{t("security.deleteAccount")}
							</Button>
						</div>
					</fieldset>
				</main>
			)}
		</div>
	);
}
