const express = require('express');
const {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
} = require('../Controller/OrderController');

const router = express.Router();

router.post('/register', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;