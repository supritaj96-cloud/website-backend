const { DataTypes } = require('sequelize');
const db = require('../Config/db');
const Customer = require('./CustomerModel');
const Product = require('./ProductModel');
const Payment = require('./PaymentModel');

const Order = db.sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Customer,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

Customer.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

Product.hasMany(Order, { foreignKey: 'productId' });
Order.belongsTo(Product, { foreignKey: 'productId' });

Order.hasOne(Payment, { foreignKey: 'orderId' });
Payment.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = Order;