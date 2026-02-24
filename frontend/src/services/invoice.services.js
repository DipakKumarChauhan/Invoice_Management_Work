import api from "./api";

/**
 * Create a new invoice
 */
export async function createInvoice(invoiceData) {
  const res = await api.post("/invoices", invoiceData);
  return res.data;
}

/**
 * Update an existing invoice
 */
export async function updateInvoice(invoiceId, invoiceData) {
  const res = await api.put(`/invoices/${invoiceId}`, invoiceData);
  return res.data;
}

/**
 * Archive an invoice
 */
export async function archiveInvoice(invoiceId) {
  const res = await api.post(`/invoices/${invoiceId}/archive`);
  return res.data;
}

/**
 * Restore an archived invoice
 */
export async function restoreInvoice(invoiceId) {
  const res = await api.post(`/invoices/${invoiceId}/restore`);
  return res.data;
}
