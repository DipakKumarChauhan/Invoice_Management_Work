import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { createInvoice } from "../../services/invoice.services";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/formatCurrency";

export default function CreateInvoice() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    issueDate: new Date(),
    dueDate: new Date(),
    status: "DRAFT",
    taxPercent: 0,
    lines: [{ description: "", quantity: 1, unitPrice: 0 }]
  });

  const calculateTotals = () => {
    const subtotal = form.lines.reduce(
      (sum, l) => sum + l.quantity * l.unitPrice,
      0
    );
    const taxAmount = subtotal * (form.taxPercent / 100);

    return {
      subtotal,
      taxAmount,
      total: subtotal + taxAmount
    };
  };

  const totals = calculateTotals();

  const updateLine = (index, field, value) => {
    const updated = [...form.lines];
    updated[index][field] = value;
    setForm({ ...form, lines: updated });
  };

  const addLine = () => {
    setForm({
      ...form,
      lines: [
        ...form.lines,
        { description: "", quantity: 1, unitPrice: 0 }
      ]
    });
  };

  const removeLine = (index) => {
    setForm({
      ...form,
      lines: form.lines.filter((_, i) => i !== index)
    });
  };

  const saveInvoice = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const invoiceData = {
        customerName: form.customerName,
        issueDate: format(form.issueDate, "yyyy-MM-dd"),
        dueDate: format(form.dueDate, "yyyy-MM-dd"),
        status: form.status,
        taxPercent: form.taxPercent,
        currency: "INR",
        lines: form.lines
      };

      const result = await createInvoice(invoiceData);
      
      // Invalidate invoices list to refresh dashboard
      queryClient.invalidateQueries(["invoices"]);
      
      toast.success("Invoice created successfully");
      navigate(`/invoices/${result.id}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to create invoice";
      toast.error(errorMessage);
      console.error("Create invoice error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary/80 uppercase">
            Billing
          </p>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
            Create invoice
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Capture customer details, line items, and tax to generate a new
            invoice.
          </p>
        </div>
      </div>

      {/* META */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Customer name
            </label>
            <input
              value={form.customerName}
              onChange={(e) =>
                setForm({ ...form, customerName: e.target.value })
              }
              placeholder="Acme Corporation"
              className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Issue date
            </label>
            <div className="border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-800">
              <DatePicker
                selected={form.issueDate}
                onChange={(date) => setForm({ ...form, issueDate: date })}
                className="w-full bg-transparent px-1 py-1 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Due date
            </label>
            <div className="border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-800">
              <DatePicker
                selected={form.dueDate}
                onChange={(date) => setForm({ ...form, dueDate: date })}
                className="w-full bg-transparent px-1 py-1 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
            >
              <option value="DRAFT">Save as draft</option>
              <option value="SENT">Mark as sent</option>
            </select>
          </div>
        </div>
      </div>

      {/* LINE ITEMS */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-200 uppercase">
            Line items
          </h2>
          <button
            onClick={addLine}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <span className="text-base">＋</span>
            <span>Add line</span>
          </button>
        </div>

        {form.lines.map((line, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start bg-gray-50/60 dark:bg-slate-800/80 rounded-lg p-3"
          >
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Description
              </label>
              <input
                value={line.description}
                onChange={(e) =>
                  updateLine(i, "description", e.target.value)
                }
                placeholder="Consulting services"
                className="w-full border border-gray-200 dark:border-slate-700 p-2 rounded-md text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min={1}
                value={line.quantity}
                onChange={(e) =>
                  updateLine(i, "quantity", Number(e.target.value))
                }
                className="w-full border border-gray-200 dark:border-slate-700 p-2 rounded-md text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Unit price
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={line.unitPrice === 0 ? "" : line.unitPrice}
                onChange={(e) => {
                  const val = e.target.value;
                  // Allow empty string for clearing, or parse as number
                  if (val === "") {
                    updateLine(i, "unitPrice", 0);
                  } else {
                    const num = parseFloat(val);
                    if (!isNaN(num) && num >= 0) {
                      updateLine(i, "unitPrice", num);
                    }
                  }
                }}
                onBlur={(e) => {
                  // Ensure we have a valid number on blur
                  if (e.target.value === "" || e.target.value === "0") {
                    updateLine(i, "unitPrice", 0);
                  }
                }}
                placeholder="0.00"
                className="w-full border border-gray-200 dark:border-slate-700 p-2 rounded-md text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <button
              type="button"
              onClick={() => removeLine(i)}
              className="mt-5 text-xs font-medium text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* TOTALS */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1 text-sm">
          <p className="text-gray-500">
            Subtotal:{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatCurrency(totals.subtotal)}
            </span>
          </p>
          <p className="text-gray-500">
            Tax:{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatCurrency(totals.taxAmount)}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Total due
          </p>
          <p className="text-2xl font-semibold">
            {formatCurrency(totals.total)}
          </p>
        </div>
      </div>

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          disabled={isSaving}
          onClick={saveInvoice}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-60 shadow-sm hover:shadow-md hover:bg-green-600 transition"
        >
          {isSaving ? "Creating..." : "Create invoice"}
        </button>
      </div>
    </motion.div>
  );
}
