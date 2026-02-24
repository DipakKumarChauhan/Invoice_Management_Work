const service = require("./invoice_service");
const { createInvoiceSchema } = require("./invoice_validation");

async function create(req, res, next) {
  try {
    const data = createInvoiceSchema.parse(req.body);

    const invoice = await service.createInvoice(
      req.user.userId,
      data
    );

    res.json(invoice);
  } catch (err) {
    next(err);
  }
}

async function get(req, res, next) {
  try {
    const invoice = await service.getInvoice(
      req.user.userId,
      req.params.id
    );

    res.json(invoice);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  get
};