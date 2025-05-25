import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { App, Button, Form, Input, Typography, Card } from "antd";

import { FaChevronLeft } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";

import AuthFeature from "../../features/auth/";

export const Route = createFileRoute("/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["accounts", "error-messages"]);
  const dispatch = useDispatch<AppDispatch>();
  const { account } = useSelector((state: RootState) => state.auth);

  const [registerState, setRegisterState] = useState({
    loading: false,
    email: "",
    name: "",
    password: "",
  });

  const registerSchema = z.object({
    email: z.string().email({ message: "invalid-email" }),
    name: z
      .string()
      .min(2, { message: "name-too-short" })
      .max(34, { message: "name-too-long" }),
    password: z
      .string()
      .min(8, { message: "password-too-short" })
      .max(100, { message: "password-too-long" }),
  });

  const handleRegister = async () => {
    if (registerState.loading) return;
    setRegisterState((s) => ({ ...s, loading: true }));

    const parsedData = registerSchema.safeParse(registerState);

    if (!parsedData.success) {
      for (const error of parsedData.error.issues) {
        message.error(t(`accounts:register.messages.${error.message}`));
      }
      setRegisterState((s) => ({ ...s, loading: false }));
      return;
    }

    const result = await dispatch(
      AuthFeature.actions.register({
        email: parsedData.data.email,
        name: parsedData.data.name,
        password: parsedData.data.password,
        language: i18n.language as any,
      }),
    );

    const payload = unwrapResult(result);

    switch (payload.status) {
      case "success":
        message.success(t("accounts:register.messages.success"));
        // Redirect after successful registration to login or dashboard
        navigate({ to: "/home" });
        break;
      case "email-in-use":
        message.error(t("accounts:register.messages.emailAlreadyUsed"));
        break;
      default:
        message.error(t(`error-messages:${payload.status}`));
        if (payload.status === "network-error") {
          navigate({ to: "/errors/offline" });
        }
    }

    setRegisterState((s) => ({ ...s, loading: false }));
  };

  useEffect(() => {
    // If already logged in, no need to register
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
        {t("accounts:register.back")}
      </Button>

      <Card
        title={
          <Typography.Title level={3} className="!mb-0 text-center">
            {t("accounts:register.title")}
          </Typography.Title>
        }
        className="w-full max-w-md shadow-lg"
      >
        <Typography.Paragraph className="text-center mb-6">
          {t("accounts:register.description")}
        </Typography.Paragraph>

        <Form layout="vertical">
          <Form.Item label={t("accounts:register.fields.email")} required>
            <Input
              value={registerState.email}
              onChange={(e) =>
                setRegisterState({ ...registerState, email: e.target.value })
              }
              autoComplete="email"
              type="email"
              placeholder={t("accounts:register.fields.emailPlaceholder")}
            />
          </Form.Item>

          <Form.Item label={t("accounts:register.fields.name")} required>
            <Input
              value={registerState.name}
              onChange={(e) =>
                setRegisterState({ ...registerState, name: e.target.value })
              }
              autoComplete="name"
              placeholder={t("accounts:register.fields.namePlaceholder")}
            />
          </Form.Item>

          <Form.Item label={t("accounts:register.fields.password")} required>
            <Input.Password
              value={registerState.password}
              onChange={(e) =>
                setRegisterState({ ...registerState, password: e.target.value })
              }
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={registerState.loading}
              block
              onClick={handleRegister}
            >
              {t("accounts:register.submit")}
            </Button>
          </Form.Item>
        </Form>

        <Typography.Paragraph className="text-center mt-2">
          <Typography.Text>
            {t("accounts:register.alreadyHaveAccount")}
          </Typography.Text>{" "}
          <Link to="/auth/login" className="text-primary hover:underline">
            {t("accounts:register.loginHere")}
          </Link>
        </Typography.Paragraph>
      </Card>
    </div>
  );
}
