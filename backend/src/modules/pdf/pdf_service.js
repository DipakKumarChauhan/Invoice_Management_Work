const PDFDocument = require("pdfkit");
const prisma = require("../../config/db");
const { tr } = require("zod/v4/locales");


async function generateInvoicePdf(userId, invoiceID, res) {

    const invoice =  await prisma.invoice.findFirst({
        where:{
            id: invoiceID,
            userId
        },
        include: {
            lines:true,
            payments: true,
        }
    });

    if(!invoice) throw new Error('Invoice not found');

    //  Create a new Pdf
    const doc =  new PDFDocument({margin:50});

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice_${invoice.invoiceNumber}.pdf`
    )
    doc.pipe(res);

    // Add the header
    doc
    .fontSize(22)
    .text("Invoice", {align: "center"});

    doc.moveDown();

    doc.fontSize(12).text(`Invoice #: ${invoice.invoiceNumber}`);
    doc.text(`Customer: ${invoice.customerName}`);
  doc.text(`Issue Date: ${invoice.issueDate.toDateString()}`);
  doc.text(`Due Date: ${invoice.dueDate.toDateString()}`);

  doc.moveDown();

//    Lines in Table

 doc.fontSize(14).text("Items", { underline: true });
  doc.moveDown(0.5);

  invoice.lines.forEach(line => {
    doc.fontSize(11).text(
      `${line.description} | Qty: ${line.quantity} | Unit: ${line.unitPrice} | Total: ${line.lineTotal}`
    );
  });

  doc.moveDown();

  //total

  doc.fontSize(14).text("Summary", { underline: true });

  doc.moveDown(0.5);

  doc.text(`Subtotal: ${invoice.total - invoice.taxAmount}`);
  doc.text(`Tax: ${invoice.taxAmount}`);
  doc.text(`Total: ${invoice.total}`);
  doc.text(`Amount Paid: ${invoice.amountPaid}`);
  doc.text(`Balance Due: ${invoice.balanceDue}`);

  doc.moveDown();

  // Status

  doc
    .fontSize(16)
    .fillColor(invoice.status === "PAID" ? "green" : "red")
    .text(`Status: ${invoice.status}`);

  doc.end();

}


module.exports = {
    generateInvoicePdf
}