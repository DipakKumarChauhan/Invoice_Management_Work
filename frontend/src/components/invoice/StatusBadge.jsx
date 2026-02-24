export default function StatusBadge({ status }) {
  const styles = {
    PAID: "bg-green-100 text-green-700",
    OVERDUE: "bg-red-100 text-red-700",
    DRAFT: "bg-gray-200 text-gray-700",
    SENT: "bg-blue-100 text-blue-700",
    PENDING: "bg-yellow-100 text-yellow-700"
  };

  return (
    <span
        className={`
            px-3 py-1 text-sm rounded-full font-medium
            transition-all duration-300 ease-in-out
            ${styles[status] || "bg-gray-100 text-gray-700"}
        `}
    >
      {status}
    </span>
  );
}