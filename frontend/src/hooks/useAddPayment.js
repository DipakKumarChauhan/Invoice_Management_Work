import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPayment } from "../services/payment.services";
import toast from "react-hot-toast";

export function useAddPayment(invoiceId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount) =>
      addPayment(invoiceId, amount),

    onSuccess: () => {
      // Invalidate queries to refresh invoice and list
      queryClient.invalidateQueries(["invoice", invoiceId]);
      queryClient.invalidateQueries(["invoices"]);
      toast.success("Payment added successfully");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to add payment";
      toast.error(errorMessage);
    }
  });
}