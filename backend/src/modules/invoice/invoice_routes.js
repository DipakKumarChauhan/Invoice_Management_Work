const router =  require('express').Router();
const controller = require('./invoice_controller');
const auth = require('../../middleware/auth_middleware');

router.post("/", auth, controller.create);
router.get("/:id", auth, controller.get);

module.exports = router;