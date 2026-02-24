import StatusBadge from "./StatusBadge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentModal from "./PaymentModal";
import { useAddPayment } from "../../hooks/useAddPayment";
import { downloadInvoicePDF } from "../../services/pdf.service";
import { archiveInvoice, restoreInvoice } from "../../services/invoice.services";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function InvoiceHeader({ invoice }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [openPayment, setOpenPayment] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const paymentMutation = useAddPayment(invoice.id);
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">

      {/* Top Row */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-semibold">
            Invoice #{invoice.invoiceNumber}
          </h1>

          <p className="text-gray-500 mt-1">
            {invoice.customerName}
          </p>
        </div>

        <StatusBadge status={invoice.status} />
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-10 mt-6 text-sm text-gray-600 dark:text-gray-300">

        <div>
          <p className="font-medium">Issue Date</p>
          <p>
            {new Date(invoice.issueDate).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="font-medium">Due Date</p>
          <p>
            {new Date(invoice.dueDate).toLocaleDateString()}
          </p>
        </div>

      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-6">

        <button
          disabled={invoice.status === "PAID" || paymentMutation.isPending}
          onClick={() => setOpenPayment(true)}
          className={`px-4 py-2 rounded-lg text-white ${
            invoice.status === "PAID" || paymentMutation.isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:opacity-90"
          }`}
        >
          {paymentMutation.isPending ? "Processing..." : "Add Payment"}
        </button>

        <button
          onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
          className="px-4 py-2 rounded-lg border text-sm"
        >
          Edit Invoice
        </button>

        <button
          disabled={downloading}
          onClick={async () => {
            try {
              setDownloading(true);
              await downloadInvoicePDF(invoice.id);
            } finally {
              setDownloading(false);
            }
          }}
          className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-sm ${
            downloading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {downloading && (
            <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
          )}

          {downloading ? "Downloading..." : "Download PDF"}
        </button>

        <button
          disabled={archiving}
          onClick={async () => {
            try {
              setArchiving(true);
              if (invoice.isArchived) {
                await restoreInvoice(invoice.id);
                toast.success("Invoice restored successfully");
              } else {
                await archiveInvoice(invoice.id);
                toast.success("Invoice archived successfully");
              }
              // Invalidate queries to refresh data
              queryClient.invalidateQueries(["invoice", invoice.id]);
              queryClient.invalidateQueries(["invoices"]);
              queryClient.invalidateQueries(["archived-invoices"]);
            } catch (err) {
              const errorMessage = err.response?.data?.message || "Action failed";
              toast.error(errorMessage);
            } finally {
              setArchiving(false);
            }
          }}
          className={`px-4 py-2 rounded-lg border text-sm ${
            archiving ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {archiving
            ? "Updating..."
            : invoice.isArchived
            ? "Restore invoice"
            : "Archive invoice"}
        </button>

      </div>

      {/* Payment Modal */}
      <PaymentModal
            open={openPayment}
            onClose={() => setOpenPayment(false)}
            balanceDue={invoice.totals.balanceDue}
            loading={paymentMutation.isPending}
            onSubmit={(amount) => {
                paymentMutation.mutate(amount, {
                onSuccess: () => setOpenPayment(false)
                });
            }}
        />

    </div>
  );
}