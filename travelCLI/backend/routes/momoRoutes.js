const express = require("express");
const router = express.Router();
const momoPaymentController = require("../controllers/momoPaymentController");

router.post("/payment", momoPaymentController.momoPayment);
router.post("/callback", momoPaymentController.momoCallback);
module.exports = router;