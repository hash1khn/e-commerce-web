const fs = require("fs");
const Product = require("../model/productModel");
const Category = require("../model/categoryModel");

// Create product
const createProduct = async (req, res) => {
  try {
    const { name, description, quantity, price } = req.body;
    const photos = req.files ? req.files.map((file) => file.path) : [];
    const product = new Product({ name, description, quantity, price, photos });
    await product.save();
    res.status(200).json(product);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating product", error: err.message });
  }
};

// Get a product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all products
const getAllProducts = async (req, res) => {
  try {
    const getAll = await Product.find({});
    if (!getAllProducts) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(getAll);
  } catch (err) {
    res.status(500).json({ error: "cannot get all produts" });
  }
};

// Update a product by ID
const updateProductById = async (req, res) => {
  try {
      const { name, description, quantity, price, newFileNames, oldFileNames } =
      req.body;
      console.log("🚀 ~ updateProductById ~ oldFileNames:", oldFileNames)
      
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Update product details
    if (name) product.name = name;
    if (description) product.description = description;
    if (quantity) product.quantity = quantity;
    if (price) product.price = price;

    // Handle photo updates
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map((file, index) => ({
        fileName:file.originalname,
        filePath: file.path,
      }));


      if (oldFileNames && oldFileNames.length > 0) {
        oldFileNames.forEach((oldFileName, index) => {
          const photoIndex = product.photos.findIndex(
            (photo) => photo.fileName === oldFileName
          );
          console.log("🚀 ~ oldFileNames.forEach ~ photoIndex:", photoIndex)
          if (photoIndex >= 0) {
            const oldPhotoPath = product.photos[photoIndex].filePath
            // Replace the photo at the specified index
            product.photos[photoIndex] = newPhotos[index];

            // Delete the old photo file
            fs.unlink(oldPhotoPath, (err) => {
              if (err) {
                console.error("Failed to delete old photo:", err);
              } else {
                console.log("Old photo deleted:", oldPhotoPath);
              }
            });
          } else {
            product.photos.push(newPhotos[index]); // Add new photo if old photo not found
          }
        });
      } else {
        // Add all new photos if no old filenames are provided
        newPhotos.forEach((photo) => product.photos.push(photo));
      }
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
      return res.status(404).json({ message: "Product not found" });
    }
    // Delete all photo files associated with the product
    product.photos.forEach((photo) => {
      fs.unlink(photo.filePath, (err) => {
        if (err) {
          console.error("Failed to delete photo:", err);
        } else {
          console.log("Photo deleted:", photo.filePath);
        }
      });
    });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getAllProducts,
};
