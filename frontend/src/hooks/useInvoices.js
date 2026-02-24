import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export function useInvoices() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      if (!token) {
        throw new Error("Not authenticated");
      }
      const res = await api.get("/invoices");
      return res.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000
  });
}
