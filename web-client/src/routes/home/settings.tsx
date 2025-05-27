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
  Tag,
  InputNumber,
  Space,
} from "antd";
import { FaCog, FaTrash } from "react-icons/fa";
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
      .min(1, "new-password-required")
      .max(100, "new-password-max-length"),
    confirmNewPassword: z
      .string()
      .min(1, "confirm-new-password-required")
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
          header={t("dashboard:settings.panels.notifications.title")}
          key="2"
        >
          <Text>
            {t("dashboard:settings.panels.notifications.description")}
          </Text>
          <Space
            direction="vertical"
            style={{ width: "100%" }}
            className="mt-2"
          >
            <Switch
              checkedChildren={t("common:on")}
              unCheckedChildren={t("common:off")}
              defaultChecked
            />
            <Switch
              checkedChildren={t("common:on")}
              unCheckedChildren={t("common:off")}
            />
          </Space>
        </Panel>
        <Panel header={t("dashboard:settings.panels.privacy.title")} key="3">
          <Text>{t("dashboard:settings.panels.privacy.description")}</Text>
          <Space
            direction="vertical"
            style={{ width: "100%" }}
            className="mt-2"
          >
            <Switch
              checkedChildren={t("common:on")}
              unCheckedChildren={t("common:off")}
              defaultChecked
            />
            <Switch
              checkedChildren={t("common:on")}
              unCheckedChildren={t("common:off")}
            />
          </Space>
        </Panel>
        <Panel header={t("dashboard:settings.panels.data.title")} key="4">
          <Text>{t("dashboard:settings.panels.data.description")}</Text>
          <Space
            direction="vertical"
            style={{ width: "100%" }}
            className="mt-2"
          >
            <Button
              type="primary"
              danger
              icon={<FaTrash />}
              onClick={() => {
                // Modal.confirm({
                //   title: t("dashboard:settings.panels.data.actions.delete-account.title"),
                //   content: t("dashboard:settings.panels.data.actions.delete-account.description"),
                //   okText: t("common:delete"),
                //   okType: "danger",
                //   onOk: async () => {
                //     const result = await AuthFeature.authApi.deleteAccount();
                //     if (result.status === "success") {
                //       message.success(t("dashboard:settings.panels.data.actions.delete-account.messages.success"));
                //     } else {
                //       message.error(t(`error-messages:${result.status}`));
                //     }
                //   },
                // });
              }}
            >
              {t("dashboard:settings.panels.data.actions.delete-account.label")}
            </Button>
          </Space>
        </Panel>
      </Collapse>
    </HomeLayout>
  );
}
