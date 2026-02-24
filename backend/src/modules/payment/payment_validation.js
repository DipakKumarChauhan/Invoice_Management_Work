const {z} = require("zod");

const createPaymentSchema = z.object({
    amount: z.number().positive(),
});
module.exports = {
    createPaymentSchema
};
