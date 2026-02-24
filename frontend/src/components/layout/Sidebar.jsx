import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-6">

      {/* Logo */}
      <div className="text-xl font-semibold mb-10">
        💰 InvoicePro
      </div>

      {/* Navigation */}
      <nav className="space-y-3">

        <NavLink
          to="/dashboard"
          className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/invoices/1"
          className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          Invoices
        </NavLink>

      </nav>
    </aside>
  );
}