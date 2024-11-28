// src/routes/user.route.ts
import express from "express";
import { AnimalController } from "./animal.controller";

const router = express.Router();

router.post("/add-category", AnimalController.AddCategory);
router.post("/add-item", AnimalController.AddItem);

export const AnimalRoute = router;
