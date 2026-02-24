const pdfService = require("./pdf_service");

async function downloadInvoice(req, res, next) {
  try {
    await pdfService.generateInvoicePdf(
      req.user.userId,
      req.params.invoiceId,
      res
    );
  } catch (err) {
    next(err);
  }
}

module.exports = {
  downloadInvoice
};