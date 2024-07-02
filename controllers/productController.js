const Product=require('../model/productModel')
const Category = require('../model/categoryModel');

// Create product
const createProduct = async (req, res) => {
    try {
        const { name, description, quantity, price, photo, categoryId } = req.body;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }
        const product = new Product({ name, description, quantity, price, photo, category: categoryId });
        await product.save();
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: "incorrect input" });
    }
};

// Get a product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// get all products
const getAllProducts = async (req, res) => {
    try{
        const getAll=await Product.find({})
        if(!getAllProducts){
            return res.status(404).json({message:'Product not found'});
        }
        res.json(getAll);

    }
    catch(err){
        res.status(500).json({ error: 'cannot get all produts' });
    }
}


// Update a product by ID
const updateProductById = async (req, res) => {
    try {
        const { name, description, quantity, price, photo } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, quantity, price, photo },
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a product by ID
const deleteProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports={
    createProduct,
    getProductById,
    updateProductById,
    deleteProductById,
    getAllProducts
}
