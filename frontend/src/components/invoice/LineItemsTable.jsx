import { formatCurrency } from "../../utils/formatCurrency";

export default function LineItemsTable({ lines }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-semibold mb-4">Invoice Items</h2>

      <table className="w-full text-sm">
        <thead className="text-left text-gray-500 border-b">
          <tr>
            <th className="pb-3">Description</th>
            <th className="pb-3">Qty</th>
            <th className="pb-3">Unit Price</th>
            <th className="pb-3 text-right">Total</th>
          </tr>
        </thead>

        <tbody>
          {lines.map(line => (
            <tr
              key={line.id}
              className="border-b last:border-none"
            >
              <td className="py-3">{line.description}</td>
              <td>{line.quantity}</td>
              <td>
                {formatCurrency(line.unitPrice)}
              </td>
              <td className="text-right font-medium">
                {formatCurrency(line.lineTotal)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
