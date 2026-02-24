import { NavLink, Link } from "react-router-dom";

export default function Sidebar() {
  const linkBaseClasses =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors";

  return (
    <aside className="w-64 h-screen bg-white/80 dark:bg-slate-900/80 backdrop-blur border-r border-gray-200 dark:border-slate-800 p-6 flex flex-col">
      {/* Logo */}
      <Link
        to="/dashboard"
        className="flex items-center gap-2 mb-10 group"
      >
        <div className="h-9 w-9 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl group-hover:scale-105 transition-transform">
          ₹
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide uppercase text-gray-500">
            Invoice
          </p>
          <p className="text-lg font-semibold">Pro</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="space-y-1 text-sm flex-1">
        <p className="px-4 text-[11px] font-semibold tracking-[0.18em] text-gray-400 mb-2 uppercase">
          Overview
        </p>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            [
              linkBaseClasses,
              isActive
                ? "bg-primary/10 text-primary"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800",
            ].join(" ")
          }
        >
          <span className="text-base">📊</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/invoices/new"
          className={({ isActive }) =>
            [
              linkBaseClasses,
              isActive
                ? "bg-primary/10 text-primary"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800",
            ].join(" ")
          }
        >
          <span className="text-base">➕</span>
          <span>New Invoice</span>
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-400">
        <p>© {new Date().getFullYear()} Invoice Pro</p>
      </div>
    </aside>
  );
}