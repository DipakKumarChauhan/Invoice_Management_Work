const prisma = require('../../config/db');
const {calculateInvoice} =  require ('./invoice_utils');

const createInvoice = async(userId, data) => {

    // if(!userId) throw new Error('UserId is required' );

    // if(!data.lines || data.lines.length === 0) throw new Error('At least one line item is required');  
    
    // //  User Id cerification


    // Calculate total amount
    const {computedLines,  total , taxAmount} = calculateInvoice(data.lines, data.taxPercent);
    // Create invoice in DB

    const invoiceNumber  =  `INV-${Date.now()}`;

    const invoice = await prisma.invoice.create({
        data: {
            invoiceNumber,
            userId,
            customerName: data.customerName,
            issueDate: new Date(data.issueDate),
            dueDate: new Date(data.dueDate),
            taxPercent: data.taxPercent,
            currency: data.currency,
            status: data.status,

            taxAmount,
            total,
            balanceDue: total,

            lines: {
                create: computedLines
            }
            
            
        },
        include: {
            lines: true
        }
    });

    return invoice;



}

const getInvoice = async(userId, invoiceId) => {

    const invoice =  await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
            userId
        },
        include: {
            lines: true,
            payments: true
        }
    });

    if(!invoice) throw new Error('Invoice not found');

    return invoice;


}

const archiveInvoice = async(userId, invoiceId, value) => {
    return prisma.invoice.updateMany({
        where:{
            id:invoiceId,
            userId
        },
        data:{
      isArchived: value
        }
    })
}

const listInvoices = async (userId) => {
  return prisma.invoice.findMany({
    where: {
      userId,
      isArchived: false
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      lines: true,
      payments: true
    }
  });
};

const listArchivedInvoices = async (userId) => {
  return prisma.invoice.findMany({
    where: {
      userId,
      isArchived: true
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      lines: true,
      payments: true
    }
  });
};

async function getInvoiceDetails(userId, invoiceId) {
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      userId
    },
    include: {
      lines: true,
      payments: {
        orderBy: {
          paymentDate: "desc"
        }
      }
    }
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  return invoice;
}

async function updateInvoice(userId, invoiceId, data) {

  return prisma.$transaction(async (tx) => {

    const existing = await tx.invoice.findFirst({
      where: {
        id: invoiceId,
        userId
      },
      include: { lines: true }
    });

    if (!existing) {
      throw new Error("Invoice not found");
    }

    if (existing.status === "PAID") {
      throw new Error("Cannot edit a fully paid invoice");
    }

    // Recalculate totals
    const { computedLines, total, taxAmount } =
      calculateInvoice(data.lines, data.taxPercent);

    const newBalanceDue = total - existing.amountPaid;

    let newStatus = existing.status;

    if (newBalanceDue <= 0) {
      newStatus = "PAID";
    }

    const today = new Date();
    if (newBalanceDue > 0 && today > new Date(data.dueDate)) {
      newStatus = "OVERDUE";
    }

    // Delete old lines
    await tx.invoiceLine.deleteMany({
      where: { invoiceId }
    });

    // Update invoice
    const updatedInvoice = await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        customerName: data.customerName,
        issueDate: new Date(data.issueDate),
        dueDate: new Date(data.dueDate),
        taxPercent: data.taxPercent,
        currency: data.currency,
        total,
        taxAmount,
        balanceDue: newBalanceDue,
        status: newStatus,
        lines: {
          create: computedLines
        }
      },
      include: {
        lines: true,
        payments: true
      }
    });

    return updatedInvoice;
  });
}

module.exports = {
  archiveInvoice,
  createInvoice,
  getInvoice,
  listInvoices,
  listArchivedInvoices,
  getInvoiceDetails,
  updateInvoice
};