import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/formatCurrency";

export default function PaymentModal({
  open,
  onClose,
  onSubmit,
  balanceDue,
  loading
}) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!open) return undefined;

    const handler = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = () => {
    const value = Number(amount);

    if (!value || value <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (value > balanceDue) {
      alert("Cannot exceed balance due");
      return;
    }

    onSubmit(value);
    setAmount("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-96 shadow-xl">

        <h2 className="text-lg font-semibold mb-4">
          Add Payment
        </h2>

        <p className="text-sm text-gray-500 mb-3">
          Balance Due: {formatCurrency(balanceDue)}
        </p>

        <input
          autoFocus
          disabled={loading}
          type="number"
          placeholder="Enter amount"
          className="w-full border rounded-lg px-3 py-2 mb-4 dark:bg-slate-700"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <div className="flex justify-end gap-3">

        <button
          disabled={loading}
          onClick={onClose}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          disabled={loading}
          onClick={handleSubmit}
          className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 disabled:opacity-60"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}

          {loading ? "Processing..." : "Pay"}
        </button>

      </div>

      </div>
    </div>
  );
}
