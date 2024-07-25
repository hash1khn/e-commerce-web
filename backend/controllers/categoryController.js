const Category = require('../model/categoryModel');

// Create category
const createCategory = async (req, res) => {
    try {
        const { name, parentId } = req.body;
        const category = new Category({ name, parentId });
        await category.save();
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ message: "incorrect input" });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//get categories of all from parent id

const getAllcategoriesbyParentId = async (req, res) => {
    try{
        const categoriesbyParentID= await Category.find({parentId: req.params.parentId});
        res.status(200).json(categoriesbyParentID);

    } catch(err){
        res.status(500).json({err: err.message});

    }

};

// Get a category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update category by ID
const updateCategoryById = async (req, res) => {
    try {
        const { name, parentId } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, parentId },
            { new: true, runValidators: true }
        );
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete category by ID
const deleteCategoryById = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createCategory,
    getAllcategoriesbyParentId,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById
};
