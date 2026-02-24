import { useParams, useNavigate } from "react-router-dom";
import { useInvoice } from "../../hooks/useInvoice";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import { updateInvoice } from "../../services/invoice.services";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/formatCurrency";

export default function EditInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useInvoice(id);

  const [form, setForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize editable state
  useEffect(() => {
    if (data) {
      setForm({
        customerName: data.customerName,
        issueDate: new Date(data.issueDate),
        dueDate: new Date(data.dueDate),
        taxPercent: data.totals.taxAmount
          ? (data.totals.taxAmount /
              (data.totals.total - data.totals.taxAmount)) *
            100
          : 0,
        lines: data.lines.map((l) => ({
          description: l.description,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        })),
      });
    }
  }, [data]);

  if (isLoading || !form) return <p>Loading...</p>;

  // ===== Totals =====
  const calculateTotals = () => {
    const subtotal = form.lines.reduce(
      (sum, l) => sum + l.quantity * l.unitPrice,
      0
    );

    const taxAmount = subtotal * (form.taxPercent / 100);

    return {
      subtotal,
      taxAmount,
      total: subtotal + taxAmount,
    };
  };

  const totals = calculateTotals();

  // ===== Line handlers =====
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
        { description: "", quantity: 1, unitPrice: 0 },
      ],
    });
  };

  const removeLine = (index) => {
    setForm({
      ...form,
      lines: form.lines.filter((_, i) => i !== index),
    });
  };

  // ===== Save =====
  const saveInvoice = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const invoiceData = {
        customerName: form.customerName,
        issueDate: format(form.issueDate, "yyyy-MM-dd"),
        dueDate: format(form.dueDate, "yyyy-MM-dd"),
        taxPercent: form.taxPercent,
        currency: "INR",
        lines: form.lines,
      };

      await updateInvoice(id, invoiceData);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries(["invoice", id]);
      queryClient.invalidateQueries(["invoices"]);

      toast.success("Invoice updated successfully");
      navigate(`/invoices/${id}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update invoice";
      toast.error(errorMessage);
      console.error("Update invoice error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // ===== JSX =====
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-semibold">Edit Invoice</h1>

      {/* META */}
      <div className="grid grid-cols-3 gap-4">
        <input
          value={form.customerName}
          onChange={(e) =>
            setForm({ ...form, customerName: e.target.value })
          }
          className="border rounded-lg p-2"
        />

        <DatePicker
          selected={form.issueDate}
          onChange={(date) =>
            setForm({ ...form, issueDate: date })
          }
        />

        <DatePicker
          selected={form.dueDate}
          onChange={(date) =>
            setForm({ ...form, dueDate: date })
          }
        />
      </div>

      {/* LINE ITEMS */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl">
        {form.lines.map((line, i) => (
          <div key={i} className="grid grid-cols-4 gap-3 mb-3">
            <input
              value={line.description}
              onChange={(e) =>
                updateLine(i, "description", e.target.value)
              }
              placeholder="Description"
              className="border p-2 rounded"
            />

            <input
              type="number"
              value={line.quantity}
              onChange={(e) =>
                updateLine(i, "quantity", Number(e.target.value))
              }
              className="border p-2 rounded"
            />

            <input
              type="number"
              min={0}
              step="0.01"
              value={line.unitPrice === 0 ? "" : line.unitPrice}
              onChange={(e) => {
                const val = e.target.value;
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
                if (e.target.value === "" || e.target.value === "0") {
                  updateLine(i, "unitPrice", 0);
                }
              }}
              placeholder="0.00"
              className="border p-2 rounded"
            />

            <button
              onClick={() => removeLine(i)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={addLine}
          className="mt-3 text-primary"
        >
          + Add Line
        </button>
      </div>

      {/* TOTALS */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl">
        <p>Subtotal: {formatCurrency(totals.subtotal)}</p>
        <p>Tax: {formatCurrency(totals.taxAmount)}</p>
        <p className="font-semibold">
          Total: {formatCurrency(totals.total)}
        </p>
      </div>

      {/* SAVE */}
      <button
        disabled={isSaving}
        onClick={saveInvoice}
        className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </motion.div>
  );
}