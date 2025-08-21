import mongoose, { Schema, Document } from "mongoose";

export interface ISearchHistory extends Document {
  query: string;
  createdAt: Date;
}

const SearchHistorySchema = new Schema<ISearchHistory>({
  query: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const SearchHistory = mongoose.model<ISearchHistory>("SearchHistory", SearchHistorySchema);
