const Order = require('../Models/OrderModel');
const Customer = require('../Models/CustomerModel');
const Product = require('../Models/ProductModel');
const Payment = require('../Models/PaymentModel');

const orderIncludes = [Customer, Product, Payment];

const createOrder = async (req, res) => {
    try {
        const order = await Order.create(req.body);
        const orderWithDetails = await Order.findByPk(order.id, { include: orderIncludes });
        res.status(201).json(orderWithDetails);
    } catch (error) {
        res.status(500).json({ message: 'Order create nahi hua', error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: orderIncludes,
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Orders fetch nahi hue', error: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, { include: orderIncludes });

        if (!order) {
            return res.status(404).json({ message: 'Order nahi mila' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Order fetch nahi hua', error: error.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order nahi mila' });
        }

        await order.update(req.body);
        const updatedOrder = await Order.findByPk(order.id, { include: orderIncludes });
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Order update nahi hua', error: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order nahi mila' });
        }

        await order.destroy();
        res.status(200).json({ message: 'Order delete ho gaya' });
    } catch (error) {
        res.status(500).json({ message: 'Order delete nahi hua', error: error.message });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};
