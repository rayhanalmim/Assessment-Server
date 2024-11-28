import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import AnimalCategory from "./animal.modal";

const AddCategory = catchAsync(async (req: Request, res: Response) => {
    const { label } = req.body;

    if (!label) {
        return res.status(400).json({ error: "Category label is required." });
    }

    try {
        const existingCategory = await AnimalCategory.findOne({ label });

        if (existingCategory) {
            return res.status(400).json({ error: "Category already exists." });
        }

        const newCategory = await AnimalCategory.create({ label, content: [] });
        res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
        res.status(500).json({ error: "Failed to create category" });
    }
});

const AddItem = catchAsync(async (req: Request, res: Response) => {
    const { categoryId, name, image } = req.body;

    if (!categoryId || !name || !image) {
        return res.status(400).json({ error: "Category ID, name, and image are required." });
    }

    try {
        const category = await AnimalCategory.findById(categoryId);

        if (!category) {
            return res.status(404).json({ error: "Category not found." });
        }

        category.content.push({ name, image });
        await category.save();

        res.status(200).json({ message: "Item added successfully", category });
    } catch (error) {
        res.status(500).json({ error: "Failed to add item" });
    }
});

const GetAllItems = catchAsync(async (req: Request, res: Response) => {
    try {
        const categories = await AnimalCategory.find();

        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch items" });
    }
});

export const AnimalController = {
    AddCategory,
    AddItem,
    GetAllItems
};
