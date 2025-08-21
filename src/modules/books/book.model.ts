import mongoose, { Schema } from "mongoose";

export interface IBook {
  _id?: string;
  title: string;
  author: string;
  year: number;
  isbn: string;
  coverBase64: string;
  review: string | null;
  rating: number | null;

  createdAt?: Date;
  updatedAt?: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    isbn: { type: String, required: true, unique: true },
    coverBase64: { type: String, required: true },
    review: { type: String, maxlength: 500 },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true },
);

export const Book = mongoose.model<IBook>("Book", BookSchema);
