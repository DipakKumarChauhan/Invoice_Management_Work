const prisma = require("../../config/db");
const simulationProvider =
  require("./providers/simulation_provider");

async function addPayment(userId, invoiceId, amount) {
  return prisma.$transaction(async (tx) => {

    // 1️⃣ Fetch invoice WITH LOCK INTENT
    const invoice = await tx.invoice.findFirst({
      where: {
        id: invoiceId,
        userId
      }
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    if (invoice.status === "PAID") {
      throw new Error("Invoice already fully paid");
    }

    // 2️⃣ Prevent overpayment
    if (amount > invoice.balanceDue) {
      throw new Error("Payment exceeds balance due");
    }

    // 3️⃣ Call provider (simulation gateway)
    const result = await simulationProvider.processPayment({
      amount
    });

    if (!result.success) {
      throw new Error("Payment failed");
    }

    // 4️⃣ Create payment record
    await tx.payment.create({
      data: {
        invoiceId,
        amount,
        provider: "SIMULATION",
        status: "SUCCESS",
        gatewayOrderId: result.gatewayOrderId,
        gatewayPaymentId: result.gatewayPaymentId
      }
    });

    // 5️⃣ Recalculate invoice safely
    const newAmountPaid = invoice.amountPaid + amount;
    const newBalanceDue = invoice.total - newAmountPaid;

    let newStatus = invoice.status;

    if (newBalanceDue <= 0) {
      newStatus = "PAID";
    }

    // overdue logic inline
    const today = new Date();
    if (newBalanceDue > 0 && today > invoice.dueDate) {
      newStatus = "OVERDUE";
    }

    const updatedInvoice = await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        amountPaid: newAmountPaid,
        balanceDue: newBalanceDue,
        status: newStatus
      },
      include: {
        payments: true,
        lines: true
      }
    });

    return updatedInvoice;
  });
}

module.exports = {
  addPayment
};