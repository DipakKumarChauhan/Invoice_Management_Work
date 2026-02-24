function buildInvoiceResponse(invoice) {
  const today = new Date();

  const isOverdue =
    invoice.balanceDue > 0 &&
    today > invoice.dueDate;

  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,

    customerName: invoice.customerName,
    currency: invoice.currency,

    status: isOverdue ? "OVERDUE" : invoice.status,
    isArchived: invoice.isArchived,

    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,

    totals: {
      total: invoice.total,
      taxAmount: invoice.taxAmount,
      amountPaid: invoice.amountPaid,
      balanceDue: invoice.balanceDue
    },

    lines: invoice.lines.map(l => ({
      id: l.id,
      description: l.description,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      lineTotal: l.lineTotal
    })),

    payments: invoice.payments.map(p => ({
      id: p.id,
      amount: p.amount,
      status: p.status,
      provider: p.provider,
      paymentDate: p.paymentDate
    }))
  };
}

module.exports = {
  buildInvoiceResponse
};