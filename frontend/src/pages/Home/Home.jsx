import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full grid md:grid-cols-2 gap-10 items-center"
      >
        {/* Left: Hero Text */}
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-primary/80 uppercase mb-3">
            Invoice Pro
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Simple, modern invoicing for growing businesses.
          </h1>
          <p className="mt-4 text-sm md:text-base text-gray-600 dark:text-gray-400">
            Create professional invoices, track payments, and stay on top of your
            cash flow with a clean, focused dashboard.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium shadow-sm hover:shadow-md hover:bg-green-600 transition"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              Sign in
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
            No complicated setup. Just log in, create your first invoice, and start tracking payments.
          </p>
        </div>

        {/* Right: Simple Stats Preview */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm">
            <p className="text-xs font-medium text-gray-500 mb-1">
              Today&apos;s snapshot
            </p>
            <p className="text-2xl font-semibold">Manage invoices in minutes.</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Create, send, and track invoices with a streamlined workflow and real-time totals.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-3">
              <p className="text-xs text-gray-500">Invoices</p>
              <p className="mt-1 text-lg font-semibold">All in one place</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-3">
              <p className="text-xs text-gray-500">Payments</p>
              <p className="mt-1 text-lg font-semibold">Track status</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-3">
              <p className="text-xs text-gray-500">Theme</p>
              <p className="mt-1 text-lg font-semibold">Light / Dark</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

