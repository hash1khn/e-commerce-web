const express = require('express');
const {
    createCategory,
    getAllcategoriesbyParentId,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById
} = require('../controllers/categoryController');
const router = express.Router();

// Create a new category
router.post('/create', createCategory);

// Get all categories
router.get('/get-all-categories', getAllCategories);

//Get all categories by parent ID
router.get('/get-all-categories-by-parent/:parentId', getAllcategoriesbyParentId)

// Get, update, and delete a category by ID
router.get('/get-single-category/:id', getCategoryById);

router.put('/update-single-category/:id', updateCategoryById);

router.delete('/delete-single-category/:id', deleteCategoryById);

module.exports = router;
