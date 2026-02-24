const service = require("./payment_service");
const { createPaymentSchema } =
  require("./payment_validation");

async function addPayment(req, res, next) {
  try {
    const { amount } =
      createPaymentSchema.parse(req.body);

    const invoice = await service.addPayment(
      req.user.userId,
      req.params.invoiceId,
      amount
    );

    res.json(invoice);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addPayment
};