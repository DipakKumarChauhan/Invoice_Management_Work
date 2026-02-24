import useTheme from "../../hooks/useTheme";

export default function Topbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-6">

      {/* Search */}
      <input
        placeholder="Search..."
        className="px-4 py-2 rounded-lg border dark:bg-slate-700"
      />

      {/* Right Section */}
      <div className="flex items-center gap-4">

        <button
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
          className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-700"
        >
          {theme === "dark" ? "🌞" : "🌙"}
        </button>

        <div className="font-medium">
          Dipak
        </div>

      </div>
    </header>
  );
}