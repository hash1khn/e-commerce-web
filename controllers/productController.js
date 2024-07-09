const Product=require('../model/productModel')
const Category = require('../model/categoryModel');

// Create product
const createProduct = async (req, res) => {
    try {
      const { name, description, quantity, price } = req.body;
      const photos = req.files ? req.files.map(file => file.path) : []; 
      const product = new Product({ name, description, quantity, price, photos });
      await product.save();
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: 'Error creating product', error: err.message });
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
// Update a product by ID
const updateProductById = async (req, res) => {
    try {
        const { name, description, quantity, price, photoIndex } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update product details
        if (name) product.name = name;
        if (description) product.description = description;
        if (quantity) product.quantity = quantity;
        if (price) product.price = price;

        // Update specific photo by index and filename
        if (req.file && photoIndex !== undefined && photoIndex >= 0 && photoIndex < product.photos.length) {
            const newPhoto = req.file.path;
            product.photos[photoIndex] = newPhoto; // Replace the photo at the specified index
        }

        await product.save();
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
