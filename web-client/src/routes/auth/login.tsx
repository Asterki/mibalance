import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { App, Modal, Button, Form, Input, Typography, Card } from "antd";

import { FaChevronLeft } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";

import AuthFeature from "../../features/auth/";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { t } = useTranslation(["accounts", "error-messages"]);
  const dispatch = useDispatch<AppDispatch>();
  const { error, account } = useSelector((state: RootState) => state.auth);

  const [loginState, setLoginState] = useState({
    loading: false,
    email: "",
    password: "",
    requiresTfa: false,
    tfa: "",
  });

  const loginSchema = z.object({
    email: z.string().email({ message: "invalid-email" }),
    password: z.string().min(1, { message: "invalid-password" }),
    tfa: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .refine((code) => !code || code.length === 6, {
        message: "invalid-tfa-code",
      }),
  });

  const handleLogin = async () => {
    if (loginState.loading) return;
    setLoginState((s) => ({ ...s, loading: true }));

    const parsedData = loginSchema.safeParse(loginState);

    if (!parsedData.success) {
      for (const error of parsedData.error.issues) {
        message.error(t(`login.messages.${error.message}`));
      }
      setLoginState((s) => ({ ...s, loading: false }));
      return;
    }

    const result = await dispatch(
      AuthFeature.actions.login({
        email: parsedData.data.email,
        password: parsedData.data.password,
        tfaCode: parsedData.data.tfa,
      }),
    );

    const payload = unwrapResult(result);

    switch (payload.status) {
      case "success":
        message.success(t("login.messages.success"));
        break;
      case "requires-tfa":
        message.error(t("login.messages.requires-tfa"));
        setLoginState((s) => ({ ...s, loading: false, requiresTfa: true }));
        break;
      case "invalid-credentials":
        message.error(t("login.messages.invalid-credentials"));
        break;
      case "invalid-tfa-code":
        message.error(t("login.messages.invalid-tfa-code"));
        break;
      default:
        message.error(t(`error-messages:${payload.status}`));
        if (payload.status === "network-error") {
          navigate({ to: "/errors/offline" });
        }
    }

    setLoginState((s) => ({ ...s, loading: false }));
  };

  useEffect(() => {
    if (account) {
      navigate({ to: "/home" });
    }
  }, [account, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 relative">
      <Button
        type="link"
        icon={<FaChevronLeft />}
        onClick={() => navigate({ to: "/" })}
        className="absolute top-4 left-4"
      >
        {t("login.back")}
      </Button>

      <Modal
        open={error === "requires-tfa"}
        title={t("login.tfa")}
        onOk={handleLogin}
        okText={t("login.submit")}
        onCancel={() => dispatch(AuthFeature.authSlice.actions.clearError())}
        cancelText={t("login.cancel")}
      >
        <p>{t("login.tfaDescription")}</p>
        <Input.Password
          onChange={(e) =>
            setLoginState({ ...loginState, tfa: e.target.value })
          }
          value={loginState.tfa}
          autoComplete="one-time-code"
          placeholder="••••••"
        />
      </Modal>

      <Card
        title={
          <Typography.Title level={3} className="!mb-0 text-center">
            {t("login.title")}
          </Typography.Title>
        }
        className="w-full max-w-md shadow-lg"
      >
        <Typography.Paragraph className="text-center mb-6">
          {t("login.description")}
        </Typography.Paragraph>

        <Form layout="vertical">
          <Form.Item label={t("login.fields.email")} required>
            <Input
              value={loginState.email}
              onChange={(e) =>
                setLoginState({ ...loginState, email: e.target.value })
              }
              autoComplete="email"
              type="email"
              placeholder={t("login.fields.emailPlaceholder")}
            />
          </Form.Item>

          <Form.Item label={t("login.fields.password")} required>
            <Input.Password
              value={loginState.password}
              onChange={(e) =>
                setLoginState({ ...loginState, password: e.target.value })
              }
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loginState.loading}
              block
              onClick={handleLogin}
            >
              {t("login.submit")}
            </Button>
          </Form.Item>
        </Form>

        <Typography.Paragraph className="text-center mt-2">
          <Link
            to="/auth/forgot-password"
            className="text-primary hover:underline"
          >
            {t("login.forgotPassword")}
          </Link>
        </Typography.Paragraph>
        <Typography.Paragraph className="text-center mt-2">
          <Link
            to="/auth/register"
            className="text-primary hover:underline"
          >
            {t("login.noAccount")}
          </Link>
        </Typography.Paragraph>
      </Card>
    </div>
  );
}
