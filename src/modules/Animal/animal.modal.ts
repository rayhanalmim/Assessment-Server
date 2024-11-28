import mongoose, { Schema, Document, Model } from "mongoose";

interface IAnimalContent {
  name: string;
  image: string;
}

interface IAnimalCategory extends Document {
  label: string;
  content: IAnimalContent[];
}

const AnimalContentSchema = new Schema<IAnimalContent>({
  name: { type: String, required: true },
  image: { type: String, required: true },
});

const AnimalCategorySchema = new Schema<IAnimalCategory>({
  label: { type: String, required: true },
  content: { type: [AnimalContentSchema] },
});

// Create the model
const AnimalCategory: Model<IAnimalCategory> = mongoose.model<IAnimalCategory>(
  "AnimalCategory",
  AnimalCategorySchema
);

export default AnimalCategory;
