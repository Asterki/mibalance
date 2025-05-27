import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  FaBars,
  FaFileInvoice,
  FaHome,
  FaExchangeAlt,
  FaCog,
  FaWallet,
} from "react-icons/fa";

import { ConfigProvider, Layout, Menu, Drawer, Button, theme } from "antd";

// Import antd locales
import esES from "antd/locale/es_ES";
import deDE from "antd/locale/de_DE";
import enUS from "antd/locale/en_US";
import frFR from "antd/locale/fr_FR";
import zhCN from "antd/locale/zh_CN";
import itIT from "antd/locale/it_IT";
import ptBR from "antd/locale/pt_BR";
import ruRU from "antd/locale/ru_RU";
import koKR from "antd/locale/ko_KR";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { unwrapResult } from "@reduxjs/toolkit";

import AuthFeature from "../features/auth/";
import { useTranslation } from "react-i18next";

const { Header, Sider, Content, Footer } = Layout;

interface LayoutProps {
  children: React.ReactNode;
  selectedPage?: string;
}

export default function PageLayout({ children, selectedPage }: LayoutProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<typeof import("../store").store.dispatch>();
  const { t, i18n } = useTranslation(["main"]);
  const { account } = useSelector((state: RootState) => state.auth);

  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    if (!account) {
      (async () => {
        const result = await dispatch(AuthFeature.actions.fetch());
        const payload = unwrapResult(result);

        if (payload.status == "network-error") {
          navigate({ to: "/errors/offline" });
        }

        if (
          AuthFeature.actions.fetch.rejected.match(result) ||
          result.payload.status === "unauthenticated"
        ) {
          navigate({ to: "/auth/login" });
        }
      })();
    } else {
      // Set the language based on the account preferences
      const language = account.preferences.general.language || "en";
      if (i18n.language !== language) {
        i18n.changeLanguage(language);
      }
    }
  }, [account]);

  const menuItems = [
    {
      key: "home",
      label: <Link to="/home">{t("dashboard:sidebar.index")}</Link>,
      icon: <FaHome />,
    },
    {
      key: "wallets",
      label: <Link to="/home/wallets">{t("dashboard:sidebar.wallets")}</Link>,
      icon: <FaWallet />,
    },
    {
      key: "transactions",
      label: (
        <Link to="/home/transactions">
          {t("dashboard:sidebar.transactions")}
        </Link>
      ),
      icon: <FaExchangeAlt />,
    },
    {
      key: "settings",
      label: <Link to="/home/settings">{t("dashboard:sidebar.settings")}</Link>,
      icon: <FaCog />,
    },
  ];

  const isDark = account?.preferences.general.theme === "dark";

  return (
    <ConfigProvider
      locale={(() => {
        switch (account?.preferences.general.language) {
          case "es":
            return esES;
          case "de":
            return deDE;
          case "en":
            return enUS;
          case "fr":
            return frFR;
          case "zh":
            return zhCN;
          case "it":
            return itIT;
          case "pt":
            return ptBR;
          case "ru":
            return ruRU;
          case "ko":
            return koKR;
          default:
            return enUS;
        }
      })()}
      theme={{ algorithm: isDark ? theme.darkAlgorithm : undefined }}
    >
      <Layout className={`${isDark ? "dark" : ""} min-h-screen`}>
        <Header
          className="px-4 flex items-center justify-between bg-white dark:bg-neutral-800"
          style={{ paddingInline: 16 }}
        >
          <Button
            type="text"
            icon={<FaBars />}
            onClick={() => setDrawerVisible(true)}
            className="md:hidden text-xl"
          />
          <div className="flex items-center gap-2">
            <Link to="/home">
              <img src="/icon.png" alt="Logo" className="h-8 w-auto" />
            </Link>

            <h1 className="text-lg font-semibold text-black dark:text-white">
              {t("dashboard:sidebar.title")}
            </h1>
          </div>
        </Header>

        <Layout hasSider>
          <Sider
            breakpoint="md"
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            className="hidden md:block"
            theme={isDark ? "dark" : "light"}
            width={220}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={[selectedPage || "home"]}
              items={menuItems}
              className="h-full"
            />
          </Sider>

          <Drawer
            title="Menú"
            placement="left"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={[selectedPage || "home"]}
              items={menuItems}
              onClick={() => setDrawerVisible(false)}
            />
          </Drawer>

          <Layout style={{ background: "transparent" }}>
            <Content className="p-6 bg-white dark:bg-neutral-800 dark:text-white dark:border-neutral-700 border">
              {children}
            </Content>
            <Footer className="text-center bg-white dark:bg-neutral-800 dark:text-white">
              © {new Date().getFullYear()} Asterki MiApps
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
