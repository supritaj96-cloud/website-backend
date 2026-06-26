require('../Config/env');
const crypto = require('crypto');
const Payment = require('../Models/PaymentModel');
const Order = require('../Models/OrderModel');

const getRazorpayConfig = () => {
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_ID || process.env.RAZORPAY_API_KEY;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET || process.env.RAZORPAY_API_SECRET;

    if (!keyId || !keySecret) {
        throw new Error('Razorpay keys .env me set nahi hain');
    }

    return { keyId, keySecret };
};

const createRazorpayOrder = async (req, res) => {
    try {
        const { keyId, keySecret } = getRazorpayConfig();
        const amount = Math.round(Number(req.body.amount || 0) * 100);
        const currency = req.body.currency || 'INR';

        if (!amount || amount < 100) {
            return res.status(400).json({ message: 'Valid amount required hai' });
        }

        const authToken = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount,
                currency,
                receipt: req.body.receipt || `receipt_${Date.now()}`,
                notes: req.body.notes || {},
            }),
        });
        const razorpayOrder = await razorpayResponse.json();

        if (!razorpayResponse.ok) {
            return res.status(razorpayResponse.status).json({
                message: razorpayOrder.error?.description || 'Razorpay order create nahi hua',
                error: razorpayOrder.error,
            });
        }

        res.status(201).json({
            keyId,
            order: razorpayOrder,
        });
    } catch (error) {
        res.status(500).json({ message: 'Razorpay order create nahi hua', error: error.message });
    }
};

const verifyRazorpayPayment = async (req, res) => {
    try {
        const { keySecret } = getRazorpayConfig();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            customerId,
            cartItems = [],
            paymentMethod = 'card',
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Razorpay payment details missing hain' });
        }

        if (!customerId || !Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ message: 'Customer aur cart details required hain' });
        }

        const generatedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        const signatureBuffer = Buffer.from(generatedSignature);
        const razorpaySignatureBuffer = Buffer.from(razorpay_signature);

        if (
            signatureBuffer.length !== razorpaySignatureBuffer.length ||
            !crypto.timingSafeEqual(signatureBuffer, razorpaySignatureBuffer)
        ) {
            return res.status(400).json({ message: 'Payment signature invalid hai' });
        }

        const createdOrders = [];

        for (const item of cartItems) {
            const order = await Order.create({
                customerId,
                productId: item.id,
                quantity: item.quantity,
            });
            const amount = Number(item.amount || 0) * Number(item.quantity || 0);

            await Payment.create({
                orderId: order.id,
                amount,
                paymentMethod,
                paymentStatus: 'success',
                transactionId: `${razorpay_payment_id}_${order.id}`,
            });

            const orderWithDetails = await Order.findByPk(order.id, { include: Payment });
            createdOrders.push(orderWithDetails);
        }

        res.status(200).json({
            message: 'Payment verified and order placed',
            razorpayPaymentId: razorpay_payment_id,
            orders: createdOrders,
        });
    } catch (error) {
        res.status(500).json({ message: 'Payment verify nahi hua', error: error.message });
    }
};

const createPayment = async (req, res) => {
    try {
        const payment = await Payment.create(req.body);
        const paymentWithOrder = await Payment.findByPk(payment.id, { include: Order });
        res.status(201).json(paymentWithOrder);
    } catch (error) {
        res.status(500).json({ message: 'Payment create nahi hua', error: error.message });
    }
};

const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({ include: Order });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Payments fetch nahi hue', error: error.message });
    }
};

const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findByPk(req.params.id, { include: Order });

        if (!payment) {
            return res.status(404).json({ message: 'Payment nahi mila' });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Payment fetch nahi hua', error: error.message });
    }
};

const updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findByPk(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment nahi mila' });
        }

        await payment.update(req.body);
        const updatedPayment = await Payment.findByPk(payment.id, { include: Order });
        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(500).json({ message: 'Payment update nahi hua', error: error.message });
    }
};

const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByPk(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment nahi mila' });
        }

        await payment.destroy();
        res.status(200).json({ message: 'Payment delete ho gaya' });
    } catch (error) {
        res.status(500).json({ message: 'Payment delete nahi hua', error: error.message });
    }
};

module.exports = {
    createRazorpayOrder,
    verifyRazorpayPayment,
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
};
