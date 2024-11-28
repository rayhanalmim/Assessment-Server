import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interfaces for TypeScript
interface IAnimalContent {
  name: string;
  image: string;
}

interface IAnimalCategory extends Document {
  label: string;
  content: IAnimalContent[];
}

// Define the schema for AnimalContent
const AnimalContentSchema = new Schema<IAnimalContent>({
  name: { type: String, required: true },
  image: { type: String, required: true },
});

// Define the schema for AnimalCategory
const AnimalCategorySchema = new Schema<IAnimalCategory>({
  label: { type: String, required: true },
  content: { type: [AnimalContentSchema], required: true },
});

// Create the model
const AnimalCategory: Model<IAnimalCategory> = mongoose.model<IAnimalCategory>(
  "AnimalCategory",
  AnimalCategorySchema
);

export default AnimalCategory;
