import { z } from "zod";
import dayjs from "dayjs";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import type { RootState } from "../../store";

import HomeLayout from "../../layouts/HomeLayout";
import { FaExchangeAlt, FaTrash, FaPencilAlt } from "react-icons/fa";

import {
  Button,
  Typography,
  App,
  Table,
  Collapse,
  DatePicker,
  Modal,
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

import TransactionFeature from "../../features/transactions";
import WalletFeature from "../../features/wallets";

export const Route = createFileRoute("/home/transactions")({
  component: RouteComponent,
});

function RouteComponent() {
  // const _navigate = useNavigate();
  // const _dispatch = useDispatch<typeof import("../../store").store.dispatch>();
  const { account } = useSelector((state: RootState) => state.auth);
  const { message } = App.useApp();
  const { t } = useTranslation(["main"]);

  const [wallets, setWallets] = useState<
    {
      name: string;
      currency: string;
      _id: string;
      color: string;
    }[]
  >([]);
  const fetchWallets = async () => {
    const result = await WalletFeature.walletAPI.list({
      count: 100,
      page: 0,
      fields: ["_id", "name", "color", "currency"],
    });

    if (result.status === "success") {
      setWallets(
        result.wallets!.map((wallet) => ({
          _id: wallet._id.toString(),
          name: wallet.name,
          currency: wallet.currency || "USD",
          color: wallet.color || "#000000",
        })),
      );
    } else {
      message.error(t(`error-messages:${result.status}`));
    }
  };

  interface ListTransaction {
    wallet: string;
    _id: string;
    type: "income" | "expense" | "transfer";
    amount: number;
    currency: string;
    category: string;
    isRecurring: boolean;
    date: Date;
    subcategory?: string;
    recurrence?: {
      frequency:
        | "daily"
        | "weekly"
        | "biweekly"
        | "monthly"
        | "quarterly"
        | "yearly";
      endDate?: string;
      interval?: number;
    };
  }
  const [transactions, setTransactions] = useState<{
    totalTransactions: number;
    transactions: ListTransaction[];
  }>({
    totalTransactions: 0,
    transactions: [],
  });
  const [transactionListState, setTransactionListState] = useState<{
    loading: boolean;
    page: number;
    count: number;
    filters?: {
      walletId?: string;
      type?: "income" | "expense" | "transfer";
      category?: string;
      dateStart?: string;
      dateEnd?: string;
    };
    search?: {
      query: string;
      searchIn: Array<
        "category" | "subcategory" | "description" | "tags" | "notes"
      >;
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
  type NullableTransactionListState = {
    [K in keyof typeof transactionListState]?:
      | (typeof transactionListState)[K]
      | null;
  };
  const fetchTransactions = async ({
    count = transactionListState.count,
    page = transactionListState.page,
    includeDeleted = transactionListState.includeDeleted,
    search = transactionListState.search,
    filters = transactionListState.filters,
  }: NullableTransactionListState) => {
    setTransactionListState((prev) => ({ ...prev, loading: true }));

    const result = await TransactionFeature.transactionAPI.list({
      count: count as number,
      page: page as number,
      search: search == null ? undefined : search,
      filters: filters == null ? undefined : filters,
      fields: [
        "_id",
        "wallet",
        "type",
        "amount",
        "currency",
        "subcategory",
        "recurrence",
        "date",
        "category",
        "isRecurring",
      ],
      includeDeleted: includeDeleted == null ? undefined : includeDeleted,
    });

    if (result.status === "success") {
      setTransactionListState({
        count: count as number,
        page: page as number,
        filters: filters == null ? undefined : filters,
        search: search == null ? undefined : search,
        includeDeleted: includeDeleted == null ? false : includeDeleted,
        loading: false,
      });

      // Map the transactions to the desired format
      setTransactions({
        totalTransactions: result.totalTransactions!,
        transactions: result.transactions!.map((tx) => ({
          wallet: tx.wallet.toString(),
          _id: tx._id.toString(),
          type: tx.type,
          amount: tx.amount,
          currency: tx.currency,
          category: tx.category,
          isRecurring: tx.isRecurring ?? false,
          date: new Date(tx.date),
          subcategory: tx.subcategory,
          recurrence: tx.recurrence
            ? {
                frequency: tx.recurrence.frequency,
                endDate: tx.recurrence.endDate?.toString(),
                interval: tx.recurrence.interval,
              }
            : undefined,
        })),
      });
    } else {
      message.error(t(`error-messages:${result.status}`));
    }
  };

  // --- Create Transaction ---
  const [createTransactionState, setCreateTransactionState] = useState<{
    open: boolean;
    loading: boolean;
    walletId: string;
    type: "income" | "expense" | "transfer";
    amount: number;
    currency: string;
    category: string;
    subcategory?: string;
    date: string;
    description?: string;
    paymentMethod?:
      | "cash"
      | "credit_card"
      | "debit_card"
      | "bank_transfer"
      | "crypto"
      | "other";
    isRecurring: boolean;
    recurrence?: {
      frequency:
        | "daily"
        | "weekly"
        | "biweekly"
        | "monthly"
        | "quarterly"
        | "yearly";
      endDate?: string;
      interval?: number;
    };
    tags?: string[];
    notes?: string;
    attachments?: {
      fileUrl: string;
      fileName?: string;
      uploadedAt?: string;
    }[];
  }>({
    open: false,
    loading: false,
    walletId: "",
    type: "expense",
    amount: 0,
    currency: "USD",
    category: "",
    subcategory: "",
    date: new Date().toISOString(),
    description: "",
    paymentMethod: undefined,
    isRecurring: false,
    recurrence: undefined,
    tags: [],
    notes: "",
    attachments: [],
  });
  const recurrenceSchema = z.object({
    frequency: z.enum(
      ["daily", "weekly", "biweekly", "monthly", "quarterly", "yearly"],
      { message: "invalid-recurrence-frequency" },
    ),
    endDate: z.string({ message: "invalid-end-date" }).datetime().optional(),
    interval: z
      .number({ message: "invalid-recurrence-interval" })
      .int()
      .min(1)
      .default(1),
  });

  const attachmentSchema = z.object({
    fileUrl: z.string({ message: "invalid-file-url" }).url(),
    fileName: z.string({ message: "invalid-file-name" }).optional(),
    uploadedAt: z
      .string({ message: "invalid-uploadedAt" })
      .datetime()
      .optional(),
  });

  const createTransactionSchema = z.object({
    walletId: z.string({ message: "wallet-id-required" }).min(1, "wallet-id-required"),
    type: z.enum(["income", "expense", "transfer"], {
      message: "invalid-transaction-type",
    }),
    amount: z
      .number({ message: "invalid-amount" })
      .min(0, { message: "invalid-amount" }),
    currency: z.string({ message: "invalid-currency" }).trim().min(3).max(5),
    category: z
      .string({ message: "invalid-category" })
      .trim()
      .min(1, "invalid-category"),
    subcategory: z
      .string({ message: "invalid-subcategory" })
      .trim()
      .min(1, "invalid-subcategory")
      .optional(),
    date: z.string({ message: "invalid-date" }).datetime(),
    description: z
      .string({ message: "invalid-description" })
      .trim()
      .max(500)
      .optional(),
    paymentMethod: z
      .enum(
        [
          "cash",
          "credit_card",
          "debit_card",
          "bank_transfer",
          "crypto",
          "other",
        ],
        {
          message: "invalid-payment-method",
        },
      )
      .optional(),
    isRecurring: z.boolean().optional().default(false),
    recurrence: recurrenceSchema.optional(),
    tags: z
      .array(z.string({ message: "invalid-tag" }).trim().min(1).max(30), {
        message: "invalid-tags",
      })
      .max(10)
      .optional(),
    notes: z.string({ message: "invalid-notes" }).trim().max(500).optional(),
    attachments: z
      .array(attachmentSchema, {
        message: "invalid-attachments",
      })
      .max(5)
      .optional(),
  });
  const createTransaction = async () => {
    if (createTransactionState.loading) return;

    setCreateTransactionState((prev) => ({
      ...prev,
      loading: true,
    }));

    const parsedData = createTransactionSchema.safeParse(
      createTransactionState,
    );

    if (!parsedData.success) {
      for (const issue of parsedData.error.issues) {
        message.warning(
          t(`dashboard:transactions.modals.create.messages.${issue.message}`),
        );
      }

      setCreateTransactionState((prev) => ({
        ...prev,
        loading: false,
      }));
      return;
    }

    const result = await TransactionFeature.transactionAPI.create(
      parsedData.data,
    );

    if (result.status === "success") {
      message.success(
        t("dashboard:transactions.modals.create.messages.success"),
      );
      setCreateTransactionState({
        open: false,
        loading: false,
        walletId: "",
        type: "expense",
        amount: 0,
        currency: "USD",
        category: "",
        isRecurring: false,
        date: new Date().toISOString(),
      });
      fetchTransactions({});
    } else {
      message.error(t(`error-messages:${result.status}`));
      setCreateTransactionState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const [deleteTransactionState, setDeleteTransactionState] = useState<{
    open: boolean;
    loading: boolean;
    transactionId: string;
  }>({
    open: false,
    loading: false,
    transactionId: "",
  });
  const deleteTransaction = async () => {
    if (deleteTransactionState.loading) return;

    setDeleteTransactionState((prev) => ({
      ...prev,
      loading: true,
    }));

    const result = await TransactionFeature.transactionAPI.delete({
      transactionId: deleteTransactionState.transactionId,
    });

    if (result.status === "success") {
      message.success(
        t("dashboard:transactions.modals.delete.messages.success"),
      );
      setDeleteTransactionState({
        open: false,
        loading: false,
        transactionId: "",
      });
      fetchTransactions({});
    } else {
      message.error(t(`error-messages:${result.status}`));
      setDeleteTransactionState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchTransactions({});
    fetchWallets();
  }, []);

  return (
    <HomeLayout selectedPage="transactions">
      <Drawer
        title={t("dashboard:transactions.modals.create.title")}
        open={createTransactionState.open}
        onClose={() =>
          setCreateTransactionState((prev) => ({
            ...prev,
            open: false,
          }))
        }
        width={1000}
        destroyOnClose
        footer={
          <div className="flex justify-end gap-2">
            <Button
              onClick={() =>
                setCreateTransactionState((prev) => ({ ...prev, open: false }))
              }
            >
              {t("dashboard:transactions.modals.create.cancel")}
            </Button>
            <Button
              type="primary"
              loading={createTransactionState.loading}
              onClick={createTransaction}
            >
              {t("dashboard:transactions.modals.create.confirm")}
            </Button>
          </div>
        }
      >
        <Form layout="vertical">
          <Collapse defaultActiveKey={["basic"]}>
            <Collapse.Panel
              header={t("dashboard:transactions.modals.create.sections.basic")}
              key="basic"
            >
              <Form.Item
                label={t("dashboard:transactions.modals.create.type")}
                required
              >
                <Select
                  value={createTransactionState.type}
                  onChange={(type) =>
                    setCreateTransactionState((prev) => ({ ...prev, type }))
                  }
                  options={[
                    {
                      label: t("dashboard:transactions.types.income"),
                      value: "income",
                    },
                    {
                      label: t("dashboard:transactions.types.expense"),
                      value: "expense",
                    },
                    {
                      label: t("dashboard:transactions.types.transfer"),
                      value: "transfer",
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label={t("dashboard:transactions.modals.create.amount")}
                required
              >
                <InputNumber
                  value={createTransactionState.amount}
                  onChange={(val) =>
                    setCreateTransactionState((prev) => ({
                      ...prev,
                      amount: val ?? 0,
                    }))
                  }
                  min={0}
                  addonBefore={createTransactionState.currency}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label={t("dashboard:transactions.modals.create.wallet")}
                required
              >
                <Select
                  value={createTransactionState.walletId}
                  onChange={(walletId) =>
                    setCreateTransactionState((prev) => ({
                      ...prev,
                      walletId: walletId ?? "",
                      currency:
                        wallets.find((w) => w._id === walletId)?.currency ||
                        "USD",
                    }))
                  }
                  options={wallets.map((wallet) => ({
                    label: (
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-full"
                          style={{ backgroundColor: "#" + wallet.color }}
                        />
                        {wallet.name} ({wallet.currency})
                      </div>
                    ),
                    value: wallet._id,
                  }))}
                  placeholder={t(
                    "dashboard:transactions.modals.create.selectWallet",
                  )}
                  allowClear
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label={t("dashboard:transactions.modals.create.category")}
                required
              >
                <Select
                  value={createTransactionState.category}
                  onChange={(e) =>
                    setCreateTransactionState((prev) => ({
                      ...prev,
                      category: e,
                    }))
                  }
                  options={TransactionFeature.transactionCategories.map(
                    (category) => {
                      return {
                        label: t(
                          `dashboard:transactions.categories.${category}`,
                        ),
                        value: category,
                      };
                    },
                  )}
                />
              </Form.Item>

              <Form.Item
                label={t("dashboard:transactions.modals.create.subcategory")}
              >
                <Select
                  value={createTransactionState.subcategory}
                  onChange={(e) =>
                    setCreateTransactionState((prev) => ({
                      ...prev,
                      subcategory: e,
                    }))
                  }
                  options={
                    createTransactionState.category
                      ? TransactionFeature.transactionSubcategories[
                          createTransactionState.category
                        ].map((subcategory: string) => ({
                          label: t(
                            `dashboard:transactions.subcategories.${createTransactionState.category}-${subcategory}`,
                          ),
                          value: subcategory,
                        }))
                      : []
                  }
                />
              </Form.Item>

              <Form.Item
                label={t("dashboard:transactions.modals.create.date")}
                required
              >
                <DatePicker
                  value={dayjs(createTransactionState.date)}
                  onChange={(date) =>
                    setCreateTransactionState((prev) => ({
                      ...prev,
                      date: date?.toISOString() ?? new Date().toISOString(),
                    }))
                  }
                  showTime
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Collapse.Panel>

            <Collapse.Panel
              header={t(
                "dashboard:transactions.modals.create.sections.advanced",
              )}
              key="advanced"
            >
              <Form.Item
                label={t("dashboard:transactions.modals.create.description")}
              >
                <Input.TextArea
                  rows={3}
                  maxLength={500}
                  value={createTransactionState.description}
                  onChange={(e) =>
                    setCreateTransactionState((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </Form.Item>

              <Form.Item
                label={t("dashboard:transactions.modals.create.paymentMethod")}
              >
                <Select
                  value={createTransactionState.paymentMethod}
                  onChange={(val) =>
                    setCreateTransactionState((prev) => ({
                      ...prev,
                      paymentMethod: val,
                    }))
                  }
                  allowClear
                  options={[
                    {
                      value: "cash",
                      label: t("dashboard:transactions.payment.cash"),
                    },
                    {
                      value: "credit_card",
                      label: t("dashboard:transactions.payment.credit_card"),
                    },
                    {
                      value: "debit_card",
                      label: t("dashboard:transactions.payment.debit_card"),
                    },
                    {
                      value: "bank_transfer",
                      label: t("dashboard:transactions.payment.bank_transfer"),
                    },
                    {
                      value: "crypto",
                      label: t("dashboard:transactions.payment.crypto"),
                    },
                    {
                      value: "other",
                      label: t("dashboard:transactions.payment.other"),
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item label={t("dashboard:transactions.modals.create.tags")}>
                <Select
                  mode="tags"
                  value={createTransactionState.tags}
                  onChange={(tags) =>
                    setCreateTransactionState((prev) => ({ ...prev, tags }))
                  }
                  tokenSeparators={[","]}
                  maxTagCount={5}
                />
              </Form.Item>

              <Form.Item
                label={t("dashboard:transactions.modals.create.notes")}
              >
                <Input.TextArea
                  value={createTransactionState.notes}
                  onChange={(e) =>
                    setCreateTransactionState((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  maxLength={500}
                />
              </Form.Item>
            </Collapse.Panel>

            <Collapse.Panel
              header={t(
                "dashboard:transactions.modals.create.sections.recurrence",
              )}
              key="recurrence"
            >
              <Form.Item>
                <Checkbox
                  checked={createTransactionState.isRecurring}
                  onChange={(e) =>
                    setCreateTransactionState((prev) => ({
                      ...prev,
                      isRecurring: e.target.checked,
                      recurrence: e.target.checked
                        ? { frequency: "monthly", interval: 1 }
                        : undefined,
                    }))
                  }
                >
                  {t("dashboard:transactions.modals.create.isRecurring")}
                </Checkbox>
              </Form.Item>

              {createTransactionState.isRecurring && (
                <>
                  <Form.Item
                    label={t(
                      "dashboard:transactions.modals.create.recurrence.frequency",
                    )}
                  >
                    <Select
                      value={createTransactionState.recurrence?.frequency}
                      onChange={(frequency) =>
                        setCreateTransactionState((prev) => ({
                          ...prev,
                          recurrence: {
                            ...prev.recurrence!,
                            frequency,
                          },
                        }))
                      }
                      options={[
                        {
                          value: "daily",
                          label: t("dashboard:transactions.recurrence.daily"),
                        },
                        {
                          value: "weekly",
                          label: t("dashboard:transactions.recurrence.weekly"),
                        },
                        {
                          value: "biweekly",
                          label: t(
                            "dashboard:transactions.recurrence.biweekly",
                          ),
                        },
                        {
                          value: "monthly",
                          label: t("dashboard:transactions.recurrence.monthly"),
                        },
                        {
                          value: "quarterly",
                          label: t(
                            "dashboard:transactions.recurrence.quarterly",
                          ),
                        },
                        {
                          value: "yearly",
                          label: t("dashboard:transactions.recurrence.yearly"),
                        },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    label={t(
                      "dashboard:transactions.modals.create.recurrence.interval",
                    )}
                  >
                    <InputNumber
                      min={1}
                      value={createTransactionState.recurrence?.interval}
                      onChange={(interval) =>
                        setCreateTransactionState((prev) => ({
                          ...prev,
                          recurrence: {
                            ...prev.recurrence!,
                            interval: interval ?? 1,
                          },
                        }))
                      }
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item
                    label={t(
                      "dashboard:transactions.modals.create.recurrence.endDate",
                    )}
                  >
                    <DatePicker
                      value={
                        createTransactionState.recurrence?.endDate
                          ? dayjs(createTransactionState.recurrence.endDate)
                          : undefined
                      }
                      onChange={(date) =>
                        setCreateTransactionState((prev) => ({
                          ...prev,
                          recurrence: {
                            ...prev.recurrence!,
                            endDate: date?.toISOString(),
                          },
                        }))
                      }
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </>
              )}
            </Collapse.Panel>
          </Collapse>
        </Form>
      </Drawer>

      <Modal
        title={t("dashboard:transactions.modals.delete.title")}
        open={deleteTransactionState.open}
        onCancel={() =>
          setDeleteTransactionState((prev) => ({
            ...prev,
            open: false,
          }))
        }
        okText={t("dashboard:transactions.modals.delete.confirm")}
        cancelText={t("dashboard:transactions.modals.delete.cancel")}
        onOk={deleteTransaction}
        confirmLoading={deleteTransactionState.loading}
        okButtonProps={{ danger: true }}
        cancelButtonProps={{ disabled: deleteTransactionState.loading }}
      >
        <Text>
          {t("dashboard:transactions.modals.delete.confirmation", {
            transactionId: deleteTransactionState.transactionId,
          })}
        </Text>
      </Modal>

      <div className="mb-2">
        {t("dashboard:common.loggedInAs", {
          name: account?.profile.name,
          email: account?.email.value,
        })}
      </div>

      <Title level={1} className="flex items-center gap-2">
        <FaExchangeAlt />
        {t("dashboard:transactions.page.title")}
      </Title>

      <Text>{t("dashboard:transactions.page.description")}</Text>

      <div className="my-2 flex items-center gap-2">
        <Button
          variant="solid"
          type="primary"
          onClick={() => {
            setCreateTransactionState((prev) => ({
              ...prev,
              open: true,
              loading: false,
              walletId: "",
              type: "expense",
              amount: 0,
              currency: "USD",
              category: "",
              subcategory: "",
              date: new Date().toISOString(),
              description: "",
              paymentMethod: undefined,
              isRecurring: false,
              recurrence: undefined,
              tags: [],
              notes: "",
              attachments: [],
            }));
          }}
        >
          {t("dashboard:transactions.page.createTransaction")}
        </Button>
      </div>

      <Table
        className="mt-4 overflow-x-scroll w-full"
        dataSource={transactions.transactions}
        loading={transactionListState.loading}
        rowKey={(record) => record._id.toString()} // or use a unique _id if available later
        pagination={{
          pageSize: transactionListState.count,
          total: transactions.totalTransactions,
          current: transactionListState.page + 1,
          showTotal: (total, range) =>
            t("dashboard:transactions.table.total", {
              total,
              range: `${range[0]}-${range[1]}`,
            }),
          showSizeChanger: true,
          onChange: (current, size) => {
            fetchTransactions({
              count: size,
              page: current - 1,
            });
          },
        }}
        columns={[
          {
            title: t("dashboard:transactions.table.wallet"),
            key: "wallet",
            render: (_, record) => (
              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-full"
                  style={{
                    backgroundColor:
                      wallets.find((w) => w._id === record.wallet)?.color ||
                      "#000000",
                  }}
                />
                {wallets.find((w) => w._id === record.wallet)?.name ||
                  t("dashboard:transactions.table.unknownWallet")}
              </div>
            ),
          },
          {
            title: t("dashboard:transactions.table.type"),
            dataIndex: "type",
            key: "type",
            render: (type) => (
              <Tag
                color={
                  type === "income"
                    ? "green"
                    : type === "expense"
                      ? "red"
                      : "blue"
                }
              >
                {t(`dashboard:transactions.types.${type}`)}
              </Tag>
            ),
          },
          {
            title: t("dashboard:transactions.table.amount"),
            dataIndex: "amount",
            key: "amount",
            render: (amount, record) =>
              `${record.currency} ${amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
          },
          {
            title: t("dashboard:transactions.table.date"),
            dataIndex: "date",
            key: "date",
            render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            title: t("dashboard:transactions.table.category"),
            dataIndex: "category",
            key: "category",
            render: (category) => (
              <Tag>{t(`dashboard:transactions.categories.${category}`)}</Tag>
            ),
            responsive: ["lg"],
          },
          {
            title: t("dashboard:transactions.table.subcategory"),
            dataIndex: "subcategory",
            key: "subcategory",
            render: (subcategory, record) =>
              subcategory ? (
                <Tag>
                  {t(
                    `dashboard:transactions.subcategories.${record.category}-${record.subcategory}`,
                  )}
                </Tag>
              ) : null,
            responsive: ["lg"],
          },
          {
            title: t("dashboard:transactions.table.recurrence"),
            render: (_, record) =>
              record.isRecurring ? (
                <Tag color="orange">
                  {t(
                    `dashboard:transactions.recurrence.${record.recurrence?.frequency}`,
                  )}
                </Tag>
              ) : (
                <Tag color="gray">
                  {t("dashboard:transactions.recurrence.none")}
                </Tag>
              ),
            responsive: ["lg"],
          },
          {
            title: t("dashboard:transactions.table.actions"),
            key: "actions",
            fixed: "right",
            render: (record) => (
              <div className="flex items-center gap-2">
                <Tooltip title={t("dashboard:transactions.table.editTooltip")}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      // Fetch and set edit transaction state
                      // similar to setUpdateWalletState
                    }}
                  >
                    <FaPencilAlt />
                  </Button>
                </Tooltip>

                <Tooltip
                  title={t("dashboard:transactions.table.deleteTooltip")}
                >
                  <Button
                    variant="outlined"
                    danger
                    onClick={() => {
                      setDeleteTransactionState({
                        open: true,
                        loading: false,
                        transactionId: record._id,
                      });
                    }}
                  >
                    <FaTrash />
                  </Button>
                </Tooltip>
              </div>
            ),
          },
        ]}
      />
    </HomeLayout>
  );
}
