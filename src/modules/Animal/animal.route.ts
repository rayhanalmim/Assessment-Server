// src/routes/user.route.ts
import express from "express";
import { AnimalController } from "./animal.controller";

const router = express.Router();

router.post("/add-category", AnimalController.AddCategory);
router.post("/add-item", AnimalController.AddItem);
router.get("/items", AnimalController.GetAllItems);

export const AnimalRoute = router;
