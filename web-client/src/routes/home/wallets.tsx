import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import cc from "currency-codes";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import type { RootState } from "../../store";

import HomeLayout from "../../layouts/HomeLayout";
import { FaWallet, FaSearch, FaTrash, FaPencilAlt } from "react-icons/fa";

import {
  Button,
  Typography,
  App,
  Table,
  ColorPicker,
  Modal,
  Space,
  Tooltip,
  Tag,
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Drawer,
} from "antd";
const { Title, Text } = Typography;

import WalletFeature, { IWallet } from "../../features/wallets";

export const Route = createFileRoute("/home/wallets")({
  component: RouteComponent,
});

function RouteComponent() {
  const { account } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation(["main"]);
  const { message } = App.useApp();

  interface ListWallet {
    _id: string;
    name: string;
    description: string;
    balance: number;
    currency: string;
    type: "cash" | "bank" | "credit" | "investment" | "other";
    institution: string;
    color: string;
    icon: string;
    isPrimary: boolean;
  }
  const [walletListState, setWalletListState] = useState<{
    loading: boolean;
    page: number;
    count: number;
    filters?: {
      type?: IWallet["type"];
      currency?: string;
      isPrimary?: boolean;
    };
    search?: {
      query: string;
      searchIn: Array<"name" | "description" | "institution">;
    };
    includeDeleted: boolean;
  }>({
    loading: true,
    page: 0,
    count: 10,
    filters: undefined,
    search: undefined,
    includeDeleted: false,
  });
  const [wallets, setWallets] = useState<{
    totalWallets: number;
    wallets: ListWallet[];
  }>({
    totalWallets: 0,
    wallets: [],
  });
  type NullableCategoriesListState = {
    [K in keyof typeof walletListState]?: (typeof walletListState)[K] | null;
  };
  const fetchWallets = async ({
    count = walletListState.count,
    page = walletListState.page,
    includeDeleted = walletListState.includeDeleted,
    search = walletListState.search,
    filters = walletListState.filters,
  }: NullableCategoriesListState) => {
    setWalletListState((prev) => ({ ...prev, loading: true }));

    const result = await WalletFeature.walletAPI.list({
      count: count as number,
      page: page as number,
      search: search == null ? undefined : search,
      fields: [
        "_id",
        "name",
        "description",
        "institution",
        "isPrimary",
        "icon",
        "color",
        "currency",
        "balance",
        "type",
        "deleted",
      ],
      // sort: sort == null ? undefined : sort,
      includeDeleted: includeDeleted == null ? undefined : includeDeleted,
    });

    if (result.status == "success") {
      setWalletListState({
        count: count as number,
        page: page as number,
        // sort: sort == null ? undefined : sort,
        search: search == null ? undefined : search,
        filters: filters == null ? undefined : filters,
        includeDeleted: includeDeleted == null ? false : includeDeleted,
        loading: false,
      });

      setWallets({
        wallets: result.wallets!.map((wallet) => ({
          _id: wallet._id.toString(),
          isPrimary: wallet.isPrimary,
          institution: wallet.institution ?? "",
          color: wallet.color ?? "",
          icon: wallet.icon ?? "",
          description: wallet.description ?? "",
          name: wallet.name,
          type: wallet.type,
          currency: wallet.currency,
          balance: wallet.balance,
        })),
        totalWallets: result.totalWallets!,
      });
    } else {
      message.error(t(`error-messages:${result.status}`));
    }
  };

  const [createWalletState, setCreateWalletState] = useState<{
    open: boolean;
    loading: boolean;
    name: string;
    description: string;
    balance: number;
    currency: string;
    type: IWallet["type"];
    institution: string;
    isPrimary: boolean;
    color: string;
    icon: string;
  }>({
    open: false,
    loading: false,
    name: "",
    description: "",
    balance: 0,
    currency: "USD",
    type: "cash",
    institution: "",
    isPrimary: false,
    color: "",
    icon: "",
  });
  const createWalletSchema = z.object({
    name: z
      .string({ message: "name-too-short" })
      .trim()
      .min(1, { message: "name-too-short" })
      .max(100, { message: "name-too-long" }),
    description: z
      .string({ message: "description-too-long" })
      .max(500, { message: "description-too-long" })
      .optional(),
    balance: z
      .number({ message: "balance-negative" })
      .min(0, { message: "balance-negative" }),
    currency: z
      .string({ message: "currency-required" })
      .trim()
      .length(3, { message: "currency-invalid-length" }),
    type: z.enum(["cash", "bank", "credit", "investment", "other"]),
    institution: z
      .string({ message: "institution-too-long" })
      .max(100, { message: "institution-too-long" })
      .optional(),
    isPrimary: z.boolean().optional(),
    color: z
      .string({ message: "color-too-long" })
      .max(16, { message: "color-too-long" })
      .optional(),
    icon: z
      .string({ message: "icon-too-long" })
      .max(64, { message: "icon-too-long" })
      .optional(),
  });
  const createWallet = async () => {
    if (createWalletState.loading) return;

    setCreateWalletState((prev) => ({
      ...prev,
      loading: true,
    }));

    const parsedData = createWalletSchema.safeParse(createWalletState);
    if (!parsedData.success) {
      const errors = parsedData.error.flatten();
      for (const field in errors.fieldErrors) {
        message.warning(t(`dashboard:wallets.modals.create.messages.${field}`));
      }

      setCreateWalletState((prev) => ({
        ...prev,
        loading: false,
      }));

      return;
    }

    const result = await WalletFeature.walletAPI.create({
      ...createWalletState,
    });

    if (result.status == "success") {
      message.success(t("dashboard:wallets.modals.create.messages.success"));
      setCreateWalletState({
        open: false,
        loading: false,
        name: "",
        description: "",
        balance: 0,
        currency: "USD",
        type: "cash",
        institution: "",
        isPrimary: false,
        color: "",
        icon: "",
      });
      fetchWallets({
        count: walletListState.count,
        page: walletListState.page,
      });
    } else {
      message.error(t(`error-messages:${result.status}`));
      setCreateWalletState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const [updateWalletState, setUpdateWalletState] = useState<{
    walletId?: string;
    name: string;
    description: string;
    balance: number;
    currency: string;
    type: IWallet["type"];
    institution: string;
    isPrimary: boolean;
    color: string;
    icon: string;
  }>({
    walletId: undefined,
    name: "",
    description: "",
    balance: 0,
    currency: "USD",
    type: "cash",
    institution: "",
    isPrimary: false,
    color: "",
    icon: "",
  });
  const updateWalletSchema = z.object({
    name: z
      .string({ message: "name-too-short" })
      .trim()
      .min(1, { message: "name-too-short" })
      .max(100, { message: "name-too-long" }),
    description: z
      .string({ message: "description-too-long" })
      .max(500, { message: "description-too-long" })
      .optional(),
    balance: z
      .number({ message: "balance-negative" })
      .min(0, { message: "balance-negative" }),
    currency: z
      .string({ message: "currency-required" })
      .trim()
      .length(3, { message: "currency-invalid-length" }),
    type: z.enum(["cash", "bank", "credit", "investment", "other"]),
    institution: z
      .string({ message: "institution-too-long" })
      .max(100, { message: "institution-too-long" })
      .optional(),
    isPrimary: z.boolean().optional(),
    color: z
      .string({ message: "color-too-long" })
      .max(16, { message: "color-too-long" })
      .optional(),
    icon: z
      .string({ message: "icon-too-long" })
      .max(64, { message: "icon-too-long" })
      .optional(),
  });
  const updateWallet = async () => {
    if (
      updateWalletState.walletId == null ||
      updateWalletState.walletId === ""
    ) {
      message.error(t("dashboard:wallets.modals.update.messages.noWalletId"));
      return;
    }

    const parsedData = updateWalletSchema.safeParse(updateWalletState);
    if (!parsedData.success) {
      const errors = parsedData.error.flatten();
      for (const field in errors.fieldErrors) {
        message.warning(t(`dashboard:wallets.modals.update.messages.${field}`));
      }
      return;
    }

    const result = await WalletFeature.walletAPI.update({
      walletId: updateWalletState.walletId,
      ...updateWalletState,
    });

    if (result.status == "success") {
      message.success(t("dashboard:wallets.modals.update.messages.success"));
      setUpdateWalletState({
        walletId: undefined,
        name: "",
        description: "",
        balance: 0,
        currency: "USD",
        type: "cash",
        institution: "",
        isPrimary: false,
        color: "",
        icon: "",
      });
      fetchWallets({
        count: walletListState.count,
        page: walletListState.page,
      });
    } else {
      message.error(t(`error-messages:${result.status}`));
    }
  };

  const [deleteWalletState, setDeleteWalletState] = useState<{
    walletId?: string;
    loading: boolean;
  }>({
    walletId: undefined,
    loading: false,
  });
  const deleteWallet = async () => {
    if (deleteWalletState.walletId == null) {
      message.error(t("dashboard:wallets.modals.delete.messages.noWalletId"));
      return;
    }

    setDeleteWalletState((prev) => ({
      ...prev,
      loading: true,
    }));

    const result = await WalletFeature.walletAPI.delete({
      walletId: deleteWalletState.walletId,
    });

    if (result.status == "success") {
      message.success(t("dashboard:wallets.modals.delete.messages.success"));
      setDeleteWalletState({
        walletId: undefined,
        loading: false,
      });
      fetchWallets({
        count: walletListState.count,
        page: walletListState.page,
      });
    } else {
      message.error(t(`error-messages:${result.status}`));
    }
    setDeleteWalletState((prev) => ({
      ...prev,
      loading: false,
    }));
  };

  useEffect(() => {
    fetchWallets({
      count: 10,
      page: 0,
    });
  }, []);

  return (
    <HomeLayout selectedPage="wallets">
      <Modal
        title={t("dashboard:wallets.modals.create.title")}
        open={createWalletState.open}
        onOk={createWallet}
        onCancel={() => {
          setCreateWalletState((prev) => ({
            ...prev,
            open: false,
          }));
        }}
        confirmLoading={createWalletState.loading}
        okText={t("dashboard:wallets.modals.create.ok")}
        cancelText={t("dashboard:wallets.modals.create.cancel")}
        destroyOnClose
      >
        <Form layout="vertical" initialValues={createWalletState}>
          <Form.Item
            label={t("dashboard:wallets.modals.create.name")}
            name="name"
            required
          >
            <Input
              maxLength={100}
              value={createWalletState.name}
              onChange={(e) =>
                setCreateWalletState((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              autoFocus
            />
          </Form.Item>

          <Form.Item
            label={t("dashboard:wallets.modals.create.description")}
            name="description"
          >
            <Input.TextArea
              maxLength={500}
              rows={3}
              value={createWalletState.description}
              onChange={(e) =>
                setCreateWalletState((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </Form.Item>

          <Form.Item
            label={t("dashboard:wallets.modals.create.balance")}
            name="balance"
            required
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              addonBefore={createWalletState.currency}
              value={createWalletState.balance}
              onChange={(val) =>
                setCreateWalletState((prev) => ({ ...prev, balance: val ?? 0 }))
              }
            />
          </Form.Item>

          <Form.Item
            label={t("dashboard:wallets.modals.create.currency")}
            name="currency"
            required
          >
            <Select
              value={createWalletState.currency}
              options={cc.codes().map((code) => ({
                label: `${code} - ${cc.code(code)!.currency}`,
                value: code,
              }))}
              showSearch
              onChange={(e) =>
                setCreateWalletState((prev) => ({
                  ...prev,
                  currency: e.toUpperCase(),
                }))
              }
            />
          </Form.Item>

          <Form.Item
            label={t("dashboard:wallets.modals.create.type")}
            name="type"
            required
          >
            <Select
              value={createWalletState.type}
              onChange={(val) =>
                setCreateWalletState((prev) => ({ ...prev, type: val }))
              }
            >
              {["cash", "bank", "credit", "investment", "other"].map((wt) => (
                <Select.Option key={wt} value={wt}>
                  {t(`dashboard:wallets.modals.create.type.${wt}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={t("dashboard:wallets.modals.create.institution")}
            name="institution"
          >
            <Input
              maxLength={100}
              value={createWalletState.institution}
              onChange={(e) =>
                setCreateWalletState((prev) => ({
                  ...prev,
                  institution: e.target.value,
                }))
              }
            />
          </Form.Item>

          <Form.Item name="isPrimary" valuePropName="checked">
            <Checkbox
              checked={createWalletState.isPrimary}
              onChange={(e) =>
                setCreateWalletState((prev) => ({
                  ...prev,
                  isPrimary: e.target.checked,
                }))
              }
            >
              {t("dashboard:wallets.modals.create.isPrimary")}
            </Checkbox>
          </Form.Item>

          <Form.Item
            label={t("dashboard:wallets.modals.create.color")}
            name="color"
          >
            <ColorPicker
              value={createWalletState.color}
              onChange={(e) =>
                setCreateWalletState((prev) => ({
                  ...prev,
                  color: e.toHex(),
                }))
              }
              showText
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label={t("dashboard:wallets.modals.create.icon")}
            name="icon"
          >
            <Input
              maxLength={64}
              value={createWalletState.icon}
              onChange={(e) =>
                setCreateWalletState((prev) => ({
                  ...prev,
                  icon: e.target.value,
                }))
              }
              placeholder={t(
                "dashboard:wallets.modals.create.icon-placeholder",
              )}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={t("dashboard:wallets.modals.update.title")}
        open={updateWalletState.walletId != null}
        onClose={() => {
          setUpdateWalletState({
            walletId: undefined,
            name: "",
            description: "",
            balance: 0,
            currency: "USD",
            type: "cash",
            institution: "",
            isPrimary: false,
            color: "",
            icon: "",
          });
        }}
        width={1400}
        destroyOnClose
        footer={
          <Button
            type="primary"
            onClick={updateWallet}
            loading={!updateWalletState.walletId ? false : undefined}
          >
            {t("dashboard:wallets.modals.update.ok")}
          </Button>
        }
      >
        <Form layout="vertical" initialValues={updateWalletState}>
          <Form.Item
            label={t("dashboard:wallets.modals.update.name")}
            name="name"
            required
          >
            <Input
              maxLength={100}
              value={updateWalletState.name}
              onChange={(e) =>
                setUpdateWalletState((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              autoFocus
            />
          </Form.Item>

          <Form.Item
            label={t("dashboard:wallets.modals.update.description")}
            name="description"
          >
            <Input.TextArea
              maxLength={500}
              rows={3}
              value={updateWalletState.description}
              onChange={(e) =>
                setUpdateWalletState((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </Form.Item>

          <Form.Item
            label={t("dashboard:wallets.modals.update.balance")}
            name="balance"
            required
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              addonBefore={updateWalletState.currency}
              value={updateWalletState.balance}
              onChange={(val) =>
                setUpdateWalletState((prev) => ({
                  ...prev,
                  balance: val ?? 0,
                }))
              }
            />
          </Form.Item>

          <Form.Item
            label={t("dashboard:wallets.modals.update.currency")}
            name="currency"
            required
          >
            <Select
              value={updateWalletState.currency}
              options={cc.codes().map((code) => ({
                label: `${code} - ${cc.code(code)!.currency}`,
                value: code,
              }))}
              showSearch
              onChange={(e) =>
                setUpdateWalletState((prev) => ({
                  ...prev,
                  currency: e.toUpperCase(),
                }))
              }
            />
          </Form.Item>

          <Form.Item
            label={t("dashboard:wallets.modals.update.type")}
            name="type"
            required
          >
            <Select
              value={updateWalletState.type}
              onChange={(val) =>
                setUpdateWalletState((prev) => ({ ...prev, type: val }))
              }
            >
              {["cash", "bank", "credit", "investment", "other"].map((wt) => (
                <Select.Option key={wt} value={wt}>
                  {t(`dashboard:wallets.modals.update.type.${wt}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={t("dashboard:wallets.modals.update.institution")}
            name="institution"
          >
            <Input
              maxLength={100}
              value={updateWalletState.institution}
              onChange={(e) =>
                setUpdateWalletState((prev) => ({
                  ...prev,
                  institution: e.target.value,
                }))
              }
            />
          </Form.Item>
          <Form.Item name="isPrimary" valuePropName="checked">
            <Checkbox
              checked={updateWalletState.isPrimary}
              onChange={(e) =>
                setUpdateWalletState((prev) => ({
                  ...prev,
                  isPrimary: e.target.checked,
                }))
              }
            >
              {t("dashboard:wallets.modals.update.isPrimary")}
            </Checkbox>
          </Form.Item>
          <Form.Item
            label={t("dashboard:wallets.modals.update.color")}
            name="color"
          >
            <ColorPicker
              value={updateWalletState.color}
              onChange={(e) =>
                setUpdateWalletState((prev) => ({
                  ...prev,
                  color: e.toHex(),
                }))
              }
              showText
              className="w-full"
            />
          </Form.Item>
          <Form.Item
            label={t("dashboard:wallets.modals.update.icon")}
            name="icon"
          >
            <Input
              maxLength={64}
              value={updateWalletState.icon}
              onChange={(e) =>
                setUpdateWalletState((prev) => ({
                  ...prev,
                  icon: e.target.value,
                }))
              }
              placeholder={t(
                "dashboard:wallets.modals.update.icon-placeholder",
              )}
            />
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title={t("dashboard:wallets.modals.delete.title")}
        open={deleteWalletState.walletId != null}
        onOk={deleteWallet}
        onCancel={() => {
          setDeleteWalletState((prev) => ({
            ...prev,
            walletId: undefined,
          }));
        }}
        confirmLoading={deleteWalletState.loading}
        okButtonProps={{
          danger: true,
        }}
        okText={t("dashboard:wallets.modals.delete.ok")}
        cancelText={t("dashboard:wallets.modals.delete.cancel")}
        destroyOnClose
      >
        <Text>{t("dashboard:wallets.modals.delete.description")}</Text>
      </Modal>

      <div className="mb-2">
        {t("dashboard:common.loggedInAs", {
          name: account?.profile.name,
          email: account?.email.value,
        })}
      </div>

      <Title level={1} className="flex items-center gap-2">
        <FaWallet />
        {t("dashboard:wallets.page.title")}
      </Title>

      <Text>{t("dashboard:wallets.page.description")}</Text>

      <div className="my-2 flex items-center gap-2">
        <Button
          variant="solid"
          type="primary"
          onClick={() => {
            setCreateWalletState((prev) => ({
              ...prev,
              open: true,
            }));
          }}
        >
          {t("dashboard:wallets.page.createWallet")}
        </Button>
      </div>

      <Table
        className="mt-4 overflow-x-scroll"
        dataSource={wallets.wallets}
        loading={walletListState.loading}
        rowKey={(record) => record._id}
        pagination={{
          pageSize: walletListState.count,
          total: wallets.totalWallets,
          current: walletListState.page + 1,
          showTotal: (total, range) =>
            t("dashboard:wallets.table.total", {
              total: total,
              range: `${range[0]}-${range[1]}`,
            }),
          showSizeChanger: true,
          onChange: (current, size) => {
            fetchWallets({
              count: size,
              page: current - 1,
            });
          },
        }}
        columns={[
          {
            title: t("dashboard:wallets.table.colorIcon"),
            key: "colorIcon",
            render: (_, record) => (
              <div className="flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: "#" + record.color || "#ccc" }}
                />
                <span className="text-xl">{record.icon}</span>
              </div>
            ),
          },
          {
            title: t("dashboard:wallets.table.name"),
            dataIndex: "name",
            key: "name",
            render: (value, record) => (
              <div className="flex items-center gap-2">
                <span>{value}</span>
                {record.isPrimary && (
                  <Tag color="green">
                    {t("dashboard:wallets.table.primary")}
                  </Tag>
                )}
              </div>
            ),
            filterIcon: () => {
              const isFiltered =
                walletListState.search?.searchIn.includes("name");
              return <FaSearch className={isFiltered ? "text-blue-500" : ""} />;
            },
            filterDropdown: () => (
              <Space className="p-2 flex gap-2 items-center">
                <Input
                  placeholder={t("dashboard:common.search")}
                  value={walletListState.search?.query}
                  onChange={(e) => {
                    setWalletListState((prev) => ({
                      ...prev,
                      search: {
                        query: e.target.value,
                        searchIn: ["name"],
                      },
                    }));
                  }}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    fetchWallets({
                      search: {
                        query: walletListState.search?.query || "",
                        searchIn: ["name"],
                      },
                    });
                  }}
                >
                  {t("dashboard:common.search")}
                </Button>
                {walletListState.search?.query && (
                  <Button
                    type="text"
                    onClick={() => {
                      fetchWallets({
                        page: 0,
                        search: null,
                      });
                    }}
                  >
                    {t("dashboard:common.reset")}
                  </Button>
                )}
              </Space>
            ),
          },
          {
            title: t("dashboard:wallets.table.description"),
            dataIndex: "description",
            key: "description",
            ellipsis: true,
          },
          {
            title: t("dashboard:wallets.table.institution"),
            dataIndex: "institution",
            key: "institution",
          },
          {
            title: t("dashboard:wallets.table.currency"),
            dataIndex: "currency",
            key: "currency",
          },
          {
            title: t("dashboard:wallets.table.balance"),
            dataIndex: "balance",
            key: "balance",
            render: (value, record) =>
              `${record.currency} ${value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
          },
          {
            title: t("dashboard:wallets.table.type"),
            dataIndex: "type",
            key: "type",
            render: (type) => (
              <Tag color="blue">
                {t(`dashboard:wallets.table.type.${type}`)}
              </Tag>
            ),
          },
          {
            title: t("dashboard:wallets.table.actions"),
            key: "actions",
            fixed: "right",
            render: (_, record) => {
              return (
                <div className="flex items-center gap-2">
                  <Tooltip
                    placement="top"
                    title={t("dashboard:wallets.table.editTooltip")}
                  >
                    <Button
                      variant="outlined"
                      onClick={async () => {
                        const result = await WalletFeature.walletAPI.get({
                          walletIds: [record._id],
                        });

                        if (result.status === "success") {
                          const wallet = result.wallets![0];
                          setUpdateWalletState({
                            walletId: wallet._id.toString(),
                            name: wallet.name,
                            description: wallet.description ?? "",
                            balance: wallet.balance,
                            currency: wallet.currency,
                            type: wallet.type,
                            institution: wallet.institution ?? "",
                            color: wallet.color ?? "",
                            icon: wallet.icon ?? "",
                            isPrimary: wallet.isPrimary,
                          });
                        } else {
                          message.error(t(`error-messages:${result.status}`));
                        }
                      }}
                    >
                      <FaPencilAlt />
                    </Button>
                  </Tooltip>

                  <Tooltip
                    placement="top"
                    title={t("dashboard:wallets.table.deleteTooltip")}
                  >
                    <Button
                      variant="outlined"
                      danger
                      onClick={() => {
                        setDeleteWalletState({
                          loading: false,
                          walletId: record._id,
                        });
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </Tooltip>
                </div>
              );
            },
          },
        ]}
      />
    </HomeLayout>
  );
}
