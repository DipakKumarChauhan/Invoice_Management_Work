const router =  require('express').Router();
const controller = require('./invoice_controller');
const auth = require('../../middleware/auth_middleware');

router.post("/", auth, controller.create);
router.get("/:id", auth, controller.get);
router.get("/:id/details", auth,controller.getDetails);
router.put("/:id", auth, controller.update);

module.exports = router;