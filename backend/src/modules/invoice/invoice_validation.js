const {z} = require("zod");


const lineSchema = z.object({
    description: z.string(),
    quantity:z.number().positive(),
    unitPrice: z.number().positive()
});

const createInvoiceSchema = z.object({
    customerName: z.string(),
    issueDate: z.string(),
    dueDate: z.string(),
    taxPercent: z.number().min(0).default(0),
    currency: z.string().default("INR"),
    lines: z.array(lineSchema).min(1)

});

module.exports = {
    createInvoiceSchema,
    lineSchema
}



