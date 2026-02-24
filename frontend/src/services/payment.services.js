
import api from "./api";

export async function addPayment(invoiceId, amount) {
  const res = await api.post(
    `/payments/${invoiceId}`,
    { amount }
  );

  return res.data;
}