import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export function useArchivedInvoices() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["archived-invoices"],
    queryFn: async () => {
      if (!token) {
        throw new Error("Not authenticated");
      }
      const res = await api.get("/invoices/archived");
      return res.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000
  });
}
