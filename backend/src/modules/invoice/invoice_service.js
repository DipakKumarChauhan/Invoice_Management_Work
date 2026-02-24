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
            archived: value
        }
    })
}

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


module.exports = {
    archiveInvoice,
    createInvoice,
    getInvoice,
    getInvoiceDetails
} 