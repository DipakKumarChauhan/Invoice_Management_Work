import { useNavigate } from "react-router-dom";
// import useTheme from "../../hooks/useTheme"; // Theme toggle temporarily disabled
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  // const { theme, setTheme } = useTheme();
  const { invoiceSearch, setInvoiceSearch } = useSearch();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Theme toggle is temporarily disabled
  // const handleThemeToggle = () => {
  //   const newTheme = theme === "dark" ? "light" : "dark";
  //   setTheme(newTheme);
  // };

  const userName = user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6">
      {/* Left: Search */}
      <div className="max-w-md w-full">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
            🔍
          </span>
          <input
            placeholder="Search invoices, customers..."
            value={invoiceSearch}
            onChange={(e) => setInvoiceSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Theme toggle temporarily removed */}
        <button
          onClick={handleLogout}
          className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"
        >
          <span>⏻</span>
          <span>Sign out</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500">Logged in as</p>
            <p className="text-sm font-medium">{userName}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
            {userInitial}
          </div>
        </div>
      </div>
    </header>
  );
}
