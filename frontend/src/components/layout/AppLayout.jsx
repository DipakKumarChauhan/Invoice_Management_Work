import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { SearchProvider } from "../../context/SearchContext";

export default function AppLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen">
        <SearchProvider>
          <Topbar />

          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </SearchProvider>
      </div>
    </div>
  );
}
