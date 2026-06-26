const Product = require('../Models/ProductModel');

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Product create nahi hua', error: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Products fetch nahi hue', error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product nahi mila' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Product fetch nahi hua', error: error.message });
    }
};


const loginProduct = async (req, res) => {
    try {
        const { email, password } = req.body;
        const product = await Product.findOne({ where: { email } });

        if (!product || product.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', product });
    } catch (error) {
        res.status(500).json({ message: 'Login nahi hua', error: error.message });
    }
};


const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product nahi mila' });
        }

        await product.update(req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Product update nahi hua', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product nahi mila' });
        }

        await product.destroy();
        res.status(200).json({ message: 'Product delete ho gaya' });
    } catch (error) {
        res.status(500).json({ message: 'Product delete nahi hua', error: error.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    loginProduct
};