const router = require("express").Router();
const controller = require("./pdf_controller");
const auth = require("../../middleware/auth_middleware");

router.get(
  "/invoice/:invoiceId",
  auth,
  controller.downloadInvoice
);

module.exports = router;