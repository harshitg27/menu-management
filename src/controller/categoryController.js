const CategoryModel = require("../models/CategoryModel");

const createCategory = async (req, res) => {
    try {
        const { name, image, description, taxApplicability, tax, taxType } = req.body;

        // Input validation
        if (!name || !image || !description || taxApplicability === undefined) {
            return res.status(400).json({ error: "All required fields must be filled" });
        }

        const category = await CategoryModel.create({
            name,
            image,
            description,
            taxApplicability,
            tax: taxApplicability ? tax : null,
            taxType: taxApplicability ? taxType : null,
        });

        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        // Validation Error 
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: 'Validation error',
                details: error.errors.map((err) => err.message),
            });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}
const getAllCategory = async (req, res) => {
    try {
        const categories = await CategoryModel.findAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const findCataegory = async (req, res) => {
    const { identifier } = req.params;

    try {
        let category;

        // Check if identifier is numeric (ID) or string (Name)
        if (!isNaN(identifier)) {
            // Find by ID
            category = await CategoryModel.findByPk(identifier);
        } else {
            // Find by Name
            category = await CategoryModel.findOne({ where: { name: identifier } });
        }

        // If category not found
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Return the category
        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { name, image, description, taxApplicability, tax, taxType } = req.body;

    try {
        // Find the category
        const category = await CategoryModel.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Update category attributes
        await category.update({
            name: name || category.name,
            image: image || category.image,
            description: description || category.description,
            taxApplicability: taxApplicability !== undefined ? taxApplicability : category.taxApplicability,
            tax: tax !== undefined ? tax : category.tax,
            taxType: taxType || category.taxType,
        });

        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createCategory,
    getAllCategory,
    findCataegory,
    updateCategory
}