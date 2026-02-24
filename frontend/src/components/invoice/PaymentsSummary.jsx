import { formatCurrency } from "../../utils/formatCurrency";

export default function PaymentsSummary({ payments }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-semibold mb-4">Payments</h2>

      {payments.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          💳 No payments yet
          <p className="text-sm mt-1">
            Add a payment to update invoice status
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map(p => (
            <div
              key={p.id}
              className="flex justify-between text-sm border-b pb-2 last:border-none"
            >
              <span>
                {new Date(
                  p.paymentDate
                ).toLocaleDateString()}
              </span>

              <span className="font-medium text-green-600">
                {formatCurrency(p.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
