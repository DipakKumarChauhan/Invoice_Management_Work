import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInvoices } from "../../hooks/useInvoices";
import { useArchivedInvoices } from "../../hooks/useArchivedInvoices";
import { useSearch } from "../../context/SearchContext";
import StatusBadge from "../../components/invoice/StatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";
import { restoreInvoice } from "../../services/invoice.services";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const { data: invoices = [], isLoading, error } = useInvoices();
  const { data: archivedInvoices = [], isLoading: isLoadingArchived } = useArchivedInvoices();
  const [showArchived, setShowArchived] = useState(false);
  const queryClient = useQueryClient();

  const { invoiceSearch } = useSearch();

  const normalizedSearch = invoiceSearch.trim().toLowerCase();

  const filteredInvoices = normalizedSearch
    ? invoices.filter((inv) => {
        const invoiceNo = String(inv.invoiceNumber ?? "").toLowerCase();
        const customer = String(inv.customerName ?? "").toLowerCase();
        return (
          invoiceNo.includes(normalizedSearch) ||
          customer.includes(normalizedSearch)
        );
      })
    : invoices;

  // Calculate totals from invoices (all, not filtered)
  const totalAmount = invoices.reduce(
    (sum, inv) => sum + (inv.totals?.total || 0),
    0
  );
  const pendingAmount = invoices.reduce((sum, inv) => {
    if (inv.status !== "PAID") {
      return sum + (inv.totals?.balanceDue || 0);
    }
    return sum;
  }, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading invoices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading invoices: {error.message}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary/80 uppercase">
            Overview
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Invoices
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Monitor issued invoices, cash flow, and outstanding balances.
          </p>
        </div>
        <Link
          to="/invoices/new"
          className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:shadow-md hover:bg-green-600 transition"
        >
          <span className="text-lg">➕</span>
          <span>Create invoice</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-100/10 pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-medium text-gray-500 flex items-center gap-2">
              Total invoices
            </p>
            <p className="text-3xl font-semibold mt-2">{invoices.length}</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-200/20 pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-medium text-gray-500">Total revenue</p>
            <p className="text-3xl font-semibold mt-2">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-rose-200/20 pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-medium text-gray-500">Pending amount</p>
            <p className="text-3xl font-semibold mt-2 text-red-600">
              {formatCurrency(pendingAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Toggle Archived */}
      {archivedInvoices.length > 0 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
          >
            {showArchived ? "← Show active invoices" : `Show archived (${archivedInvoices.length})`}
          </button>
        </div>
      )}

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {showArchived ? (
          isLoadingArchived ? (
            <div className="p-6 text-center text-gray-500">Loading archived invoices...</div>
          ) : archivedInvoices.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No archived invoices found</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide text-gray-500">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide text-gray-500">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide text-gray-500">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {archivedInvoices.map(invoice => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors opacity-60"
                  >
                    <td className="px-6 py-4 font-medium">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4">{invoice.customerName}</td>
                    <td className="px-6 py-4 font-semibold">
                      {formatCurrency(invoice.totals?.total || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-6 py-4">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/invoices/${invoice.id}`}
                          className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                        >
                          View
                          <span>↗</span>
                        </Link>
                        <button
                          onClick={async () => {
                            try {
                              await restoreInvoice(invoice.id);
                              toast.success("Invoice restored successfully");
                              queryClient.invalidateQueries(["invoices"]);
                              queryClient.invalidateQueries(["archived-invoices"]);
                              setShowArchived(false);
                            } catch (err) {
                              const errorMessage = err.response?.data?.message || "Failed to restore invoice";
                              toast.error(errorMessage);
                            }
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          Restore
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : filteredInvoices.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No invoices found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide text-gray-500">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide text-gray-500">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left font-semibold text-xs uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filteredInvoices.map(invoice => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4">{invoice.customerName}</td>
                  <td className="px-6 py-4 font-semibold">
                    {formatCurrency(invoice.totals?.total || 0)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-6 py-4">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/invoices/${invoice.id}`}
                      className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                    >
                      View
                      <span>↗</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
