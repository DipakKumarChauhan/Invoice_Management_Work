import api from "./api";

export async function downloadInvoicePDF(invoiceId) {
  const response = await api.get(
    `/pdf/invoice/${invoiceId}`,
    {
      responseType: "blob" // IMPORTANT
    }
  );

  // Create downloadable file
  const url = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `invoice-${invoiceId}.pdf`
  );

  document.body.appendChild(link);
  link.click();
  link.remove();
}