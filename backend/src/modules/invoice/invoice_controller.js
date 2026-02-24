const service = require("./invoice_service");
const { createInvoiceSchema, updateInvoiceSchema } = require("./invoice_validation");
const { buildInvoiceResponse} = require("./invoice_presenter");


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

async function list(req, res, next) {
  try {
    const invoices = await service.listInvoices(req.user.userId);
    const response = invoices.map(buildInvoiceResponse);
    res.json(response);
  } catch (err) {
    next(err);
  }
}

async function update(req, res,next) {
    try {
        const data  = updateInvoiceSchema.parse(req.body);

        const invoice = await service.updateInvoice(
            req.user.userId,
            req.params.id,
            data
        );

        res.json(invoice);
    } catch (error) {
        next(error);
    }
}

async function archive(req, res, next) {
  try {
    await service.archiveInvoice(
      req.user.userId,
      req.params.id,
      true
    );
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

async function restore(req, res, next) {
  try {
    await service.archiveInvoice(
      req.user.userId,
      req.params.id,
      false
    );
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

async function listArchived(req, res, next) {
  try {
    const invoices = await service.listArchivedInvoices(req.user.userId);
    const response = invoices.map(buildInvoiceResponse);
    res.json(response);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  get,
  getDetails,
  update,
  list,
  archive,
  restore,
  listArchived
};