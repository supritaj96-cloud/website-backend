const express = require('express');
const {
    createRazorpayOrder,
    verifyRazorpayPayment,
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
} = require('../Controller/PaymentController');

const router = express.Router();

router.post('/razorpay/order', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);
router.post('/register', createPayment);
router.get('/', getAllPayments);
router.get('/:id', getPaymentById);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);

module.exports = router;
