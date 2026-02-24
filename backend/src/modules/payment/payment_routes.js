const router = require("express").Router();
const controller = require("./payment_controller");
const auth = require("../../middleware/auth_middleware");

router.post(
  "/:invoiceId",
  auth,
  controller.addPayment
);

module.exports = router;