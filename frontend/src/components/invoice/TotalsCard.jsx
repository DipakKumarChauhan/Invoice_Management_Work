import { formatCurrency } from "../../utils/formatCurrency";

function Row({ label, value, bold, highlight }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span
        className={`
          ${bold ? "font-semibold" : ""}
          ${highlight ? "text-red-500 font-semibold" : ""}
        `}
      >
        {formatCurrency(value)}
      </span>
    </div>
  );
}

export default function TotalsCard({ totals }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-semibold mb-4">Summary</h2>

      <div className="space-y-3 text-sm">
        <Row label="Subtotal" value={totals.total - totals.taxAmount} />
        <Row label="Tax" value={totals.taxAmount} />

        <div className="border-t pt-3">
          <Row label="Total" value={totals.total} bold />
        </div>

        <Row label="Amount Paid" value={totals.amountPaid} />

        <div className="border-t pt-3">
          <Row
            label="Balance Due"
            value={totals.balanceDue}
            highlight
          />
        </div>
      </div>
    </div>
  );
}
