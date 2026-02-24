import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export function useInvoice(id) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      if (!token) {
        throw new Error("Not authenticated");
      }
      const res = await api.get(`/invoices/${id}/details`);
      return res.data;
    },
    enabled: !!token && !!id
  });
}