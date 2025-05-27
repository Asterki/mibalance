import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { App, Button, Card, Form, Input, Typography } from "antd";
import { FaChevronLeft } from "react-icons/fa";
import { z } from "zod";

import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import type { RootState } from "../../store";
import AuthFeature from "../../features/auth";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { message } = App.useApp();
  const { t } = useTranslation(["accounts"]);
  const dispatch = useDispatch<typeof import("../../store").store.dispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const emailRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    const parsed = z
      .object({ email: z.string().email("invalid-email") })
      .safeParse({ email: emailRef.current?.value || "" });

    if (!parsed.success) {
      message.error(t("forgotPassword.errors.invalid-email"));
      return;
    }

    const result = await AuthFeature.authApi.forgotPassword({
      email: parsed.data.email,
    });

    if (result.status !== "success") {
      dispatch(AuthFeature.authSlice.actions.setError(result.status));
      message.error(t(`forgotPassword.errors.${result.status}`));
    } else {
      dispatch(AuthFeature.authSlice.actions.clearError());
      message.success(t("forgotPassword.emailSent"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 relative">
      <Button
        type="link"
        icon={<FaChevronLeft />}
        onClick={() => navigate({ to: "/auth/login" })}
        className="absolute top-4 left-4"
      >
        {t("forgotPassword.back")}
      </Button>

      <Card
        title={
          <Typography.Title level={3} className="!mb-0 text-center">
            {t("forgotPassword.title")}
          </Typography.Title>
        }
        bordered={false}
        className="w-full max-w-md shadow-lg"
      >
        <Typography.Paragraph className="text-center mb-6">
          {t("forgotPassword.desc")}
        </Typography.Paragraph>

        <Form layout="vertical" onFinish={handleForgotPassword}>
          <Form.Item
            label={t("forgotPassword.fields.email")}
            required
            name="email"
          >
            <Input
              type="email"
              autoComplete="email"
              placeholder={t("forgotPassword.fields.emailPlaceholder")}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="font-semibold"
            >
              {t("forgotPassword.submit")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
