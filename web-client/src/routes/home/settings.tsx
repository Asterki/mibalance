import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import type { RootState } from "../../store";

import HomeLayout from "../../layouts/HomeLayout";

import qrCode from "qrcode";
import {
  Input,
  Form,
  QRCode,
  Select,
  Button,
  Switch,
  Typography,
  App,
  Collapse,
  Modal,
  Space,
} from "antd";
import { FaCog } from "react-icons/fa";
const { Text, Title } = Typography;
const { Panel } = Collapse;

import AuthFeature from "../../features/auth/";

export const Route = createFileRoute("/home/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  // const _navigate = useNavigate();
  // const _dispatch = useDispatch<typeof import("../../store").store.dispatch>();
  const { account } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation(["main"]);

  const { message } = App.useApp();

  // --- Change Password ---
  const [changePasswordState, setChangePasswordState] = useState<{
    open: boolean;
    loading: boolean;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }>({
    open: false,
    loading: false,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "current-password-required"),
    newPassword: z
      .string()
      .min(8, "new-password-required")
      .max(100, "new-password-max-length"),
    confirmNewPassword: z
      .string()
      .min(8, "confirm-new-password-required")
      .superRefine((val, ctx) => {
        if (val !== changePasswordState.newPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "passwords-do-not-match",
          });
        }
      }),
  });
  const changePassword = async () => {
    setChangePasswordState((prev) => ({
      ...prev,
      loading: true,
    }));

    const parsedData = changePasswordSchema.safeParse({
      currentPassword: changePasswordState.currentPassword,
      newPassword: changePasswordState.newPassword,
      confirmNewPassword: changePasswordState.confirmNewPassword,
    });

    if (!parsedData.success) {
      for (const error of parsedData.error.errors) {
        message.error(
          t(
            `dashboard:settings.modals.change-password.messages.${error.message}`,
          ),
        );
      }
      setChangePasswordState((prev) => ({
        ...prev,
        loading: false,
      }));
      return;
    }

    const result = await AuthFeature.authApi.changePassword({
      currentPassword: changePasswordState.currentPassword,
      newPassword: changePasswordState.newPassword,
    });

    if (result.status == "success") {
      message.success(
        t("dashboard:settings.modals.change-password.messages.success"),
      );
      setChangePasswordState({
        open: false,
        loading: false,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } else {
      message.error(t(`error-messages:${result.status}`));
      setChangePasswordState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  // --- Change Email ---
  const [changeEmailState, setChangeEmailState] = useState<{
    open: boolean;
    loading: boolean;
    newEmail: string;
    password: string;
  }>({
    open: false,
    loading: false,
    newEmail: "",
    password: "",
  });
  const changeEmailSchema = z.object({
    newEmail: z.string().email("invalid-email").min(1, "new-email-required"),
    password: z.string().min(1, "password-required"),
  });
  const changeEmail = async () => {
    setChangeEmailState((prev) => ({
      ...prev,
      loading: true,
    }));

    const parsedData = changeEmailSchema.safeParse({
      newEmail: changeEmailState.newEmail,
      password: changeEmailState.password,
    });

    if (!parsedData.success) {
      for (const error of parsedData.error.errors) {
        message.error(
          t(`dashboard:settings.modals.change-email.messages.${error.message}`),
        );
      }
      setChangeEmailState((prev) => ({
        ...prev,
        loading: false,
      }));
      return;
    }

    const result = await AuthFeature.authApi.changeEmail({
      newEmail: changeEmailState.newEmail,
      password: changeEmailState.password,
    });

    if (result.status == "success") {
      message.success(
        t("dashboard:settings.modals.change-email.messages.success"),
      );
      setChangeEmailState({
        open: false,
        loading: false,
        newEmail: "",
        password: "",
      });
    } else {
      message.error(t(`error-messages:${result.status}`));
      setChangeEmailState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const [enableTFAState, setEnableTFAState] = useState<{
    open: boolean;
    loading: boolean;
    secret: string | null;
    code: string;
    password: string;
  }>({
    open: false,
    loading: false,
    secret: null,
    password: "",
    code: "",
  });
  const enableTFASchema = z.object({
    secret: z.string().min(1, "tfa-secret-required"),
    code: z.string().min(1, "tfa-code-required"),
    password: z.string().min(1, "password-required"),
  });
  const enableTFA = async () => {
    setEnableTFAState((prev) => ({
      ...prev,
      loading: true,
    }));

    const parsedData = enableTFASchema.safeParse({
      secret: enableTFAState.secret,
      code: enableTFAState.code,
      password: enableTFAState.password,
    });

    if (!parsedData.success) {
      for (const error of parsedData.error.errors) {
        message.error(
          t(`dashboard:settings.modals.enable-tfa.messages.${error.message}`),
        );
      }
      setEnableTFAState((prev) => ({
        ...prev,
        loading: false,
      }));
      return;
    }

    const result = await AuthFeature.authApi.enableTFA({
      secret: enableTFAState.secret as string,
      password: enableTFAState.password,
      tfaCode: enableTFAState.code,
    });

    if (result.status == "success") {
      message.success(
        t("dashboard:settings.modals.enable-tfa.messages.success"),
      );
      setEnableTFAState({
        open: false,
        loading: false,
        secret: null,
        code: "",
        password: "",
      });
    } else if (result.status === "invalid-credentials") {
      message.error(
        t("dashboard:settings.modals.enable-tfa.messages.invalid-credentials"),
      );
      setEnableTFAState((prev) => ({
        ...prev,
        loading: false,
      }));
    } else if (result.status === "invalid-tfa-code") {
      message.error(
        t("dashboard:settings.modals.enable-tfa.messages.invalid-tfa-code"),
      );
      setEnableTFAState((prev) => ({
        ...prev,
        loading: false,
      }));
    } else {
      message.error(t(`error-messages:${result.status}`));
      setEnableTFAState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const [disableTFAState, setDisableTFAState] = useState<{
    open: boolean;
    loading: boolean;
    code: string;
    password: string;
  }>({
    open: false,
    loading: false,
    code: "",
    password: "",
  });
  const disableTFASchema = z.object({
    code: z.string().min(1, "tfa-code-required"),
    password: z.string().min(1, "password-required"),
  });
  const disableTFA = async () => {
    setDisableTFAState((prev) => ({
      ...prev,
      loading: true,
    }));

    const parsedData = disableTFASchema.safeParse({
      code: disableTFAState.code,
      password: disableTFAState.password,
    });

    if (!parsedData.success) {
      for (const error of parsedData.error.errors) {
        message.error(
          t(`dashboard:settings.modals.disable-tfa.messages.${error.message}`),
        );
      }
      setDisableTFAState((prev) => ({
        ...prev,
        loading: false,
      }));
      return;
    }

    const result = await AuthFeature.authApi.disableTFA({
      password: disableTFAState.password,
      tfaCode: disableTFAState.code,
    });

    if (result.status == "success") {
      message.success(
        t("dashboard:settings.modals.disable-tfa.messages.success"),
      );
      setDisableTFAState({
        open: false,
        loading: false,
        code: "",
        password: "",
      });
    } else if (result.status === "invalid-credentials") {
      message.error(
        t("dashboard:settings.modals.disable-tfa.messages.invalid-credentials"),
      );
      setDisableTFAState((prev) => ({
        ...prev,
        loading: false,
      }));
    } else if (result.status === "invalid-tfa-code") {
      message.error(
        t("dashboard:settings.modals.disable-tfa.messages.invalid-tfa-code"),
      );
      setDisableTFAState((prev) => ({
        ...prev,
        loading: false,
      }));
    } else if (result.status === "tfa-not-enabled") {
      message.error(
        t("dashboard:settings.modals.disable-tfa.messages.tfa-not-enabled"),
      );
      setDisableTFAState((prev) => ({
        ...prev,
        loading: false,
      }));
    } else {
      message.error(t(`error-messages:${result.status}`));
      setDisableTFAState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const [preferencesState, setPreferencesState] = useState<{
    open: boolean;
    loading: boolean;
    theme: string;
    language: string;
    notifications: {
      newLogins: boolean;
      passwordChanges: boolean;
      walletUpdates: boolean;
      accountStatusChanges: boolean;
      emailChanges: boolean;
      profileChanges: boolean;
      securityAlerts: boolean;
      generalUpdates: boolean;
      marketing: boolean;
    };
  }>({
    open: false,
    loading: false,
    theme: "light",
    language: "en",
    notifications: {
      newLogins: true,
      passwordChanges: true,
      walletUpdates: true,
      accountStatusChanges: true,
      emailChanges: true,
      profileChanges: true,
      securityAlerts: true,
      generalUpdates: true,
      marketing: false,
    },
  });
  const preferencesSchema = z.object({
    theme: z.enum(["light", "dark"]),
    language: z.string().min(1, "language-required"),
    notifications: z.object({
      newLogins: z.boolean(),
      passwordChanges: z.boolean(),
      walletUpdates: z.boolean(),
      accountStatusChanges: z.boolean(),
      emailChanges: z.boolean(),
      profileChanges: z.boolean(),
      securityAlerts: z.boolean(),
      generalUpdates: z.boolean(),
      marketing: z.boolean(),
    }),
  });
  const updatePreferences = async () => {
    setPreferencesState((prev) => ({
      ...prev,
      loading: true,
    }));

    const parsedData = preferencesSchema.safeParse({
      theme: preferencesState.theme,
      language: preferencesState.language,
      notifications: preferencesState.notifications,
    });

    if (!parsedData.success) {
      for (const error of parsedData.error.errors) {
        message.error(
          t(`dashboard:settings.panels.preferences.messages.${error.message}`),
        );
      }
      setPreferencesState((prev) => ({
        ...prev,
        loading: false,
      }));
      return;
    }

    const result = await AuthFeature.authApi.updatePreferences({
      theme: preferencesState.theme,
      language: preferencesState.language,
      notifications: {
        newLogins: preferencesState.notifications.newLogins,
        passwordChanges: preferencesState.notifications.passwordChanges,
        walletUpdates: preferencesState.notifications.walletUpdates,
        accountStatusChanges:
          preferencesState.notifications.accountStatusChanges,
        emailChanges: preferencesState.notifications.emailChanges,
        profileChanges: preferencesState.notifications.profileChanges,
        securityAlerts: preferencesState.notifications.securityAlerts,
        generalUpdates: preferencesState.notifications.generalUpdates,
        marketing: preferencesState.notifications.marketing,
      },
    });

    if (result.status == "success") {
      message.success(
        t("dashboard:settings.panels.preferences.messages.success"),
      );
      setPreferencesState((prev) => ({
        ...prev,
        loading: false,
      }));

      setTimeout(() => {
        window.location.reload();
      }, 1000); // Delay to ensure the message is shown before reload
    } else {
      message.error(t(`error-messages:${result.status}`));
      setPreferencesState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const [changeNameState, setChangeNameState] = useState<{
    open: boolean;
    loading: boolean;
    newName: string;
  }>({
    open: false,
    loading: false,
    newName: "",
  });
  const changeNameSchema = z.object({
    newName: z.string().min(2, "name-too-short").max(100, "name-max-length"),
  });
  const changeName = async () => {
    setChangeNameState((prev) => ({
      ...prev,
      loading: true,
    }));

    const parsedData = changeNameSchema.safeParse({
      newName: changeNameState.newName,
    });

    if (!parsedData.success) {
      for (const error of parsedData.error.errors) {
        message.error(
          t(`dashboard:settings.modals.change-name.messages.${error.message}`),
        );
      }
      setChangeNameState((prev) => ({
        ...prev,
        loading: false,
      }));
      return;
    }

    const result = await AuthFeature.authApi.updateProfile({
      name: changeNameState.newName,
    });

    if (result.status == "success") {
      message.success(
        t("dashboard:settings.modals.change-name.messages.success"),
      );
      setChangeNameState({
        open: false,
        loading: false,
        newName: "",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000); // Delay to ensure the message is shown before reload
    } else {
      message.error(t(`error-messages:${result.status}`));
      setChangeNameState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    if (account) {
      setPreferencesState((prev) => ({
        ...prev,
        theme: account.preferences.general.theme,
        language: account.preferences.general.language,
        notifications: {
          newLogins: account.preferences.notifications.newLogins,
          passwordChanges: account.preferences.notifications.passwordChanges,
          walletUpdates: account.preferences.notifications.walletUpdates,
          accountStatusChanges:
            account.preferences.notifications.accountStatusChanges,
          emailChanges: account.preferences.notifications.emailChanges,
          profileChanges: account.preferences.notifications.profileChanges,
          securityAlerts: account.preferences.notifications.securityAlerts,
          generalUpdates: account.preferences.notifications.generalUpdates,
          marketing: account.preferences.notifications.marketing,
        },
      }));
    }
  }, [account]);

  return (
    <HomeLayout selectedPage="settings">
      {/* --- Change Password Modal --- */}
      <Modal
        title={t("dashboard:settings.modals.change-password.title")}
        open={changePasswordState.open}
        onCancel={() => {
          setChangePasswordState((prev) => ({
            ...prev,
            open: false,
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          }));
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setChangePasswordState((prev) => ({
                ...prev,
                open: false,
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
              }));
            }}
          >
            {t("dashboard:common.cancel")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={changePasswordState.loading}
            onClick={changePassword}
          >
            {t("dashboard:common.save")}
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item
            label={t(
              "dashboard:settings.modals.change-password.fields.current-password",
            )}
            required
          >
            <Input.Password
              value={changePasswordState.currentPassword}
              onChange={(e) =>
                setChangePasswordState((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              autoFocus
            />
          </Form.Item>

          <Form.Item
            label={t(
              "dashboard:settings.modals.change-password.fields.new-password",
            )}
            required
          >
            <Input.Password
              value={changePasswordState.newPassword}
              onChange={(e) =>
                setChangePasswordState((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
            />
          </Form.Item>

          <Form.Item
            label={t(
              "dashboard:settings.modals.change-password.fields.confirm-new-password",
            )}
            required
          >
            <Input.Password
              value={changePasswordState.confirmNewPassword}
              onChange={(e) =>
                setChangePasswordState((prev) => ({
                  ...prev,
                  confirmNewPassword: e.target.value,
                }))
              }
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t("dashboard:settings.modals.change-email.title")}
        open={changeEmailState.open}
        onCancel={() => {
          setChangeEmailState((prev) => ({
            ...prev,
            open: false,
            newEmail: "",
            password: "",
          }));
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setChangeEmailState((prev) => ({
                ...prev,
                open: false,
                newEmail: "",
                password: "",
              }));
            }}
          >
            {t("dashboard:common.cancel")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={changeEmailState.loading}
            onClick={changeEmail}
          >
            {t("dashboard:common.save")}
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item
            label={t("dashboard:settings.modals.change-email.fields.new-email")}
            required
          >
            <Input
              type="email"
              value={changeEmailState.newEmail}
              onChange={(e) =>
                setChangeEmailState((prev) => ({
                  ...prev,
                  newEmail: e.target.value,
                }))
              }
              autoFocus
            />
          </Form.Item>

          <Form.Item
            label={t("dashboard:settings.modals.change-email.fields.password")}
            required
          >
            <Input.Password
              value={changeEmailState.password}
              onChange={(e) =>
                setChangeEmailState((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t("dashboard:settings.modals.enable-tfa.title")}
        open={enableTFAState.open}
        onCancel={() => {
          setEnableTFAState((prev) => ({
            ...prev,
            open: false,
            secret: null,
            code: "",
            password: "",
          }));
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setEnableTFAState((prev) => ({
                ...prev,
                open: false,
                secret: null,
                code: "",
                password: "",
              }));
            }}
          >
            {t("dashboard:common.cancel")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={enableTFAState.loading}
            onClick={enableTFA}
          >
            {t("dashboard:common.save")}
          </Button>,
        ]}
      >
        <Text className="mb-2">
          {t("dashboard:settings.modals.enable-tfa.description")}
        </Text>

        <br />
        <br />

        <Text className="mb-4 mt-2 pt-2">
          {t("dashboard:settings.modals.enable-tfa.instructions")}
        </Text>
        <br />
        <br />

        <Form layout="vertical">
          <div className="flex items-center justify-center mb-6 gap-2 flex-col">
            <QRCode value={enableTFAState.secret || ""} size={256} />

            <Input
              value={enableTFAState.secret || ""}
              readOnly
              className="w-full"
              placeholder={t(
                "dashboard:settings.modals.enable-tfa.fields.secret-placeholder",
              )}
            />
          </div>

          <Form.Item
            label={t("dashboard:settings.modals.enable-tfa.fields.code")}
            required
          >
            <Input
              value={enableTFAState.code}
              onChange={(e) =>
                setEnableTFAState((prev) => ({
                  ...prev,
                  code: e.target.value,
                }))
              }
            />
          </Form.Item>

          <Form.Item
            label={t("dashboard:settings.modals.enable-tfa.fields.password")}
            required
          >
            <Input.Password
              value={enableTFAState.password}
              onChange={(e) =>
                setEnableTFAState((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t("dashboard:settings.modals.disable-tfa.title")}
        open={disableTFAState.open}
        onCancel={() => {
          setDisableTFAState((prev) => ({
            ...prev,
            open: false,
            code: "",
            password: "",
          }));
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setDisableTFAState((prev) => ({
                ...prev,
                open: false,
                code: "",
                password: "",
              }));
            }}
          >
            {t("dashboard:common.cancel")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={disableTFAState.loading}
            onClick={disableTFA}
          >
            {t("dashboard:common.save")}
          </Button>,
        ]}
      >
        <Text className="mb-6">
          {t("dashboard:settings.modals.disable-tfa.description")}
        </Text>

        <br />
        <br />

        <Form layout="vertical">
          <Form.Item
            label={t("dashboard:settings.modals.disable-tfa.fields.code")}
            required
          >
            <Input
              value={disableTFAState.code}
              onChange={(e) =>
                setDisableTFAState((prev) => ({
                  ...prev,
                  code: e.target.value,
                }))
              }
            />
          </Form.Item>

          <Form.Item
            label={t("dashboard:settings.modals.disable-tfa.fields.password")}
            required
          >
            <Input.Password
              value={disableTFAState.password}
              onChange={(e) =>
                setDisableTFAState((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t("dashboard:settings.modals.change-name.title")}
        open={changeNameState.open}
        onCancel={() => {
          setChangeNameState((prev) => ({
            ...prev,
            open: false,
            newName: "",
          }));
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setChangeNameState((prev) => ({
                ...prev,
                open: false,
                newName: "",
              }));
            }}
          >
            {t("dashboard:common.cancel")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={changeNameState.loading}
            onClick={changeName}
          >
            {t("dashboard:common.save")}
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item
            label={t("dashboard:settings.modals.change-name.fields.new-name")}
            required
          >
            <Input
              value={changeNameState.newName}
              onChange={(e) =>
                setChangeNameState((prev) => ({
                  ...prev,
                  newName: e.target.value,
                }))
              }
              autoFocus
            />
          </Form.Item>
        </Form>
      </Modal>

      <div className="mb-2">
        {t("dashboard:common.loggedInAs", {
          name: account?.profile.name,
          email: account?.email.value,
        })}
      </div>

      <Title level={1} className="flex items-center gap-2">
        <FaCog />
        {t("dashboard:settings.page.title")}
      </Title>

      <Text>{t("dashboard:settings.page.description")}</Text>

      <Collapse className="mt-4" defaultActiveKey={["1"]}>
        <Panel header={t("dashboard:settings.panels.account.title")} key="1">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Button
              type="primary"
              onClick={() =>
                setChangeNameState((prev) => ({ ...prev, open: true }))
              }
            >
              {t("dashboard:settings.panels.account.actions.change-name")}
            </Button>

            <Button
              type="primary"
              onClick={() =>
                setChangePasswordState((prev) => ({ ...prev, open: true }))
              }
            >
              {t("dashboard:settings.panels.account.actions.change-password")}
            </Button>
            <Button
              type="primary"
              onClick={() =>
                setChangeEmailState((prev) => ({ ...prev, open: true }))
              }
            >
              {t("dashboard:settings.panels.account.actions.change-email")}
            </Button>

            {account && !account.preferences.security.twoFactorEnabled && (
              <Button
                type="primary"
                onClick={async () => {
                  const result = await AuthFeature.authApi.generateTFASecret();
                  if (result.status === "success") {
                    qrCode.toDataURL(result.secret!, (err) => {
                      if (err) {
                        message.error(
                          t(
                            "dashboard:settings.panels.account.actions.enable-tfa.messages.qr-error",
                          ),
                        );
                      } else {
                        setEnableTFAState((prev) => ({
                          ...prev,
                          open: true,
                          secret: result.secret as string,
                        }));
                      }
                    });
                  } else {
                    message.error(t(`error-messages:${result.status}`));
                  }
                }}
              >
                {t("dashboard:settings.panels.account.actions.enable-tfa")}
              </Button>
            )}

            {account && account.preferences.security.twoFactorEnabled && (
              <Button
                type="primary"
                danger
                onClick={() => {
                  setDisableTFAState((prev) => ({ ...prev, open: true }));
                }}
              >
                {t("dashboard:settings.panels.account.actions.disable-tfa")}
              </Button>
            )}
          </Space>
        </Panel>
        <Panel
          header={t("dashboard:settings.panels.preferences.title")}
          key="2"
        >
          <Text>{t("dashboard:settings.panels.preferences.description")}</Text>
          <Space
            direction="vertical"
            style={{ width: "100%" }}
            className="mt-2"
          >
            <Form layout="vertical">
              <Form.Item
                label={t("dashboard:settings.panels.preferences.fields.theme")}
              >
                <Select
                  value={preferencesState.theme}
                  onChange={(value) =>
                    setPreferencesState((prev) => ({
                      ...prev,
                      theme: value,
                    }))
                  }
                >
                  <Select.Option value="light">
                    {t("dashboard:settings.panels.preferences.options.light")}
                  </Select.Option>
                  <Select.Option value="dark">
                    {t("dashboard:settings.panels.preferences.options.dark")}
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={t(
                  "dashboard:settings.panels.preferences.fields.language",
                )}
              >
                <Select
                  value={preferencesState.language}
                  onChange={(value) =>
                    setPreferencesState((prev) => ({
                      ...prev,
                      language: value,
                    }))
                  }
                >
                  <Select.Option value="en">
                    {t("dashboard:settings.panels.preferences.options.en")}
                  </Select.Option>
                  <Select.Option value="es">
                    {t("dashboard:settings.panels.preferences.options.es")}
                  </Select.Option>
                  <Select.Option value="de">
                    {t("dashboard:settings.panels.preferences.options.de")}
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={t(
                  "dashboard:settings.panels.preferences.fields.notificationsLabel",
                )}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div className="flex items-center flex-row-reverse justify-end gap-2">
                    <span>
                      {t(
                        "dashboard:settings.panels.preferences.fields.notifications.options.new-logins",
                      )}
                    </span>
                    <Switch
                      checkedChildren={t("dashboard:common.on")}
                      unCheckedChildren={t("dashboard:common.off")}
                      checked={preferencesState.notifications.newLogins}
                      onChange={(checked) =>
                        setPreferencesState((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            newLogins: checked,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center flex-row-reverse justify-end gap-2">
                    <span>
                      {t(
                        "dashboard:settings.panels.preferences.fields.notifications.options.password-changes",
                      )}
                    </span>
                    <Switch
                      checkedChildren={t("dashboard:common.on")}
                      unCheckedChildren={t("dashboard:common.off")}
                      checked={preferencesState.notifications.passwordChanges}
                      onChange={(checked) =>
                        setPreferencesState((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            passwordChanges: checked,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center flex-row-reverse justify-end gap-2">
                    <span>
                      {t(
                        "dashboard:settings.panels.preferences.fields.notifications.options.wallet-updates",
                      )}
                    </span>
                    <Switch
                      checkedChildren={t("dashboard:common.on")}
                      unCheckedChildren={t("dashboard:common.off")}
                      checked={preferencesState.notifications.walletUpdates}
                      onChange={(checked) =>
                        setPreferencesState((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            walletUpdates: checked,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center flex-row-reverse justify-end gap-2">
                    <span>
                      {t(
                        "dashboard:settings.panels.preferences.fields.notifications.options.account-status-changes",
                      )}
                    </span>
                    <Switch
                      checkedChildren={t("dashboard:common.on")}
                      unCheckedChildren={t("dashboard:common.off")}
                      checked={
                        preferencesState.notifications.accountStatusChanges
                      }
                      onChange={(checked) =>
                        setPreferencesState((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            accountStatusChanges: checked,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center flex-row-reverse justify-end gap-2">
                    <span>
                      {t(
                        "dashboard:settings.panels.preferences.fields.notifications.options.email-changes",
                      )}
                    </span>
                    <Switch
                      checkedChildren={t("dashboard:common.on")}
                      unCheckedChildren={t("dashboard:common.off")}
                      checked={preferencesState.notifications.emailChanges}
                      onChange={(checked) =>
                        setPreferencesState((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            emailChanges: checked,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center flex-row-reverse justify-end gap-2">
                    <span>
                      {t(
                        "dashboard:settings.panels.preferences.fields.notifications.options.profile-changes",
                      )}
                    </span>
                    <Switch
                      checkedChildren={t("dashboard:common.on")}
                      unCheckedChildren={t("dashboard:common.off")}
                      checked={preferencesState.notifications.profileChanges}
                      onChange={(checked) =>
                        setPreferencesState((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            profileChanges: checked,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center flex-row-reverse justify-end gap-2">
                    <span>
                      {t(
                        "dashboard:settings.panels.preferences.fields.notifications.options.security-alerts",
                      )}
                    </span>
                    <Switch
                      checkedChildren={t("dashboard:common.on")}
                      unCheckedChildren={t("dashboard:common.off")}
                      checked={preferencesState.notifications.securityAlerts}
                      onChange={(checked) =>
                        setPreferencesState((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            securityAlerts: checked,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center flex-row-reverse justify-end gap-2">
                    <span>
                      {t(
                        "dashboard:settings.panels.preferences.fields.notifications.options.general-updates",
                      )}
                    </span>
                    <Switch
                      checkedChildren={t("dashboard:common.on")}
                      unCheckedChildren={t("dashboard:common.off")}
                      checked={preferencesState.notifications.generalUpdates}
                      onChange={(checked) =>
                        setPreferencesState((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            generalUpdates: checked,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center flex-row-reverse justify-end gap-2">
                    <span>
                      {t(
                        "dashboard:settings.panels.preferences.fields.notifications.options.marketing",
                      )}
                    </span>
                    <Switch
                      checkedChildren={t("dashboard:common.on")}
                      unCheckedChildren={t("dashboard:common.off")}
                      checked={preferencesState.notifications.marketing}
                      onChange={(checked) =>
                        setPreferencesState((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            marketing: checked,
                          },
                        }))
                      }
                    />
                  </div>
                </Space>
              </Form.Item>

              <Button
                type="primary"
                loading={preferencesState.loading}
                onClick={updatePreferences}
                className="mt-4"
              >
                {t("dashboard:common.save")}
              </Button>
            </Form>
          </Space>
        </Panel>
      </Collapse>
    </HomeLayout>
  );
}
