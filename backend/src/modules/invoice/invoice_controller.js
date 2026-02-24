const service = require("./invoice_service");
const { createInvoiceSchema } = require("./invoice_validation");
const {
  buildInvoiceResponse
} = require("./invoice_presenter");


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

async function getDetails(req, res, next) {
  try {
    const invoice =
      await service.getInvoiceDetails(
        req.user.userId,
        req.params.id
      );

    const response =
      buildInvoiceResponse(invoice);

    res.json(response);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  get,
  getDetails
};