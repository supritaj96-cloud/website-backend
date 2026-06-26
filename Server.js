const express = require('express');
const cors = require('cors');
require('./Config/env');
const db = require('./Config/db');

require('./Models/OrderModel');

const adminRoutes = require('./Routes/AdminRoutes');
const customerRoutes = require('./Routes/CustomerRoutes');
const productRoutes = require('./Routes/ProductRoutes');
const orderRoutes = require('./Routes/OrderRoutes');
const paymentRoutes = require('./Routes/PaymentRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Backend server is running' });
});

app.use('/api/admins', adminRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

const startServer = async () => {
    try {
        await db.initialize();
        await db.sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server start nahi hua:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = app;
