import { createFileRoute } from "@tanstack/react-router";
// import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import type { RootState } from "../../store";

import HomeLayout from "../../layouts/HomeLayout";
import { FaFileInvoice } from "react-icons/fa";

import { Button, Typography } from "antd";
const { Title, Text } = Typography;

export const Route = createFileRoute("/home/budgets")({
  component: RouteComponent,
});

function RouteComponent() {
  // const _navigate = useNavigate();
  // const _dispatch = useDispatch<typeof import("../../store").store.dispatch>();
  const { account } = useSelector((state: RootState) => state.auth);

  const { t } = useTranslation(["main"]);

  return (
    <HomeLayout selectedPage="budgets">
      <div className="mb-2">
        {t("dashboard:common.loggedInAs", {
          name: account?.profile.name,
          email: account?.email.value,
        })}
      </div>

      <Title level={1} className="flex items-center gap-2">
        <FaFileInvoice />
        {t("dashboard:budgets.page.title")}
      </Title>

      <Text>{t("dashboard:budgets.page.description")}</Text>

      <div className="my-2 flex items-center gap-2">
        <Button
          variant="solid"
          type="primary"
          onClick={() => {
            // setNewPurchase({ ...newPurchase, modalOpen: true });
          }}
        >
          {t("dashboard:budgets.page.createBudget")}
        </Button>
      </div>
    </HomeLayout>
  );
}
