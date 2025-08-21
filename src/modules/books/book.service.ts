import axios from "axios";
import mongoose from "mongoose";

import { APP_CONFIG } from "../../config/app/app.config";
import Logger from "../../provider/logger";
import { NotFoundException } from "../../exceptions/not-found.exception";
import { BadRequestException } from "../../exceptions/bad-request.exception";

import { Book, IBook } from "./book.model";
import { CreateBookDto, UpdateBookDto } from "./book.dto";
import { IBookFilter, IBookObject, IBookQuery } from "./interface/book.interface";
import { parseBoolean } from "./utils/parseBoolean";

export class BookService {
  static context: string = BookService.name;

  static async searchBooks(query: string, limit: number): Promise<Partial<IBookObject>[]> {
    try {
      Logger.info(this.context, "Start searching books in Open Library");
      const queryParams = query && limit ? { q: query, limit } : { limit };
      const response = await axios.get(APP_CONFIG.OPEN_LIBRARY, {
        params: queryParams,
      });

      const docs: IBookObject[] = response.data.docs;

      Logger.info(this.context, "Mapping book results");
      const results: Partial<IBookObject>[] = await Promise.all(
        docs.map(async (doc: IBookObject) => {
          const title = doc.title || "Untitled";
          const author = doc.author_name?.[0] || "Unknown";
          const year = doc.first_publish_year || 0;
          const coverId = doc.cover_i;
          let coverBase64: string | undefined;

          Logger.info(this.context, "Checking if book exists in DB");
          const existingBook: IBook | null = await Book.findOne({ title, author });

          if (existingBook && existingBook.coverBase64) {
            coverBase64 = existingBook.coverBase64;
          } else if (doc.cover_i) {
            const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
            const imageResp = await axios.get(coverUrl, { responseType: "arraybuffer" });
            coverBase64 = Buffer.from(imageResp.data, "binary").toString("base64");
          }

          return { coverId, title, author, year, coverBase64 };
        }),
      );
      Logger.info(this.context, "Returning book results");
      return results;
    } catch (error) {
      Logger.error(this.context, "An error occurred", null, JSON.parse(JSON.stringify(error)));
      throw error;
    }
  }

  static async create(data: CreateBookDto): Promise<IBook> {
    Logger.info(this.context, "Creating a new book in DB");
    const book = new Book(data);

    const savedBook = await book.save();
    Logger.info(this.context, `Book created with _id: ${savedBook._id}`);
    return savedBook;
  }

  static async search(query: IBookQuery): Promise<IBook[]> {
    Logger.info(this.context, `Searching books in DB with query: ${JSON.stringify(query)}`);

    const filter: IBookFilter = {};

    if (query.title) {
      filter.title = { $regex: query.title, $options: "i" };
    }

    if (query.author) {
      filter.author = { $regex: query.author, $options: "i" };
    }
    const hasReview = parseBoolean(query.hasReview);
    if (hasReview !== undefined) {
      filter.review = hasReview ? { $exists: true, $ne: "" } : { $in: [null, ""] };
    }

    const sortField = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;

    const books = await Book.find(filter).sort({ [sortField]: sortOrder });

    Logger.info(this.context, `Found ${books.length} books matching query`);
    return books;
  }

  static async findById(id: string): Promise<Partial<IBook>> {
    Logger.info(this.context, `Start searching book by _id: ${id}`);
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        Logger.warn(this.context, `Invalid book ID: ${id}`);
        throw new BadRequestException("ID parameter is not a valid MongoDB ObjectId");
      }
      const book: IBookObject | null = await Book.findById(id);
      if (!book) {
        const notFoundError = new NotFoundException("Book not found");
        throw notFoundError;
      }
      return book;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        const badRequestError = new BadRequestException("Id param is not compatible");
        throw badRequestError;
      }
      throw error;
    }
  }

  static async update(id: string, data: UpdateBookDto): Promise<IBook> {
    Logger.info(this.context, `Start updating book with _id: ${id}`);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      Logger.warn(this.context, `Invalid book ID: ${id}`);
      throw new BadRequestException("ID parameter is not a valid MongoDB ObjectId");
    }
    try {
      const book: IBook | null = await Book.findByIdAndUpdate(id, data, { new: true });

      if (!book) {
        const notFoundError = new NotFoundException("Book not found");
        throw notFoundError;
      }
      return book;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        const badRequestError = new BadRequestException("ID parameter is invalid");
        throw badRequestError;
      }
      throw error;
    }
  }

  static async delete(id: string): Promise<IBook | null> {
    Logger.info(this.context, `Deleting book with _id: ${id}`);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      Logger.warn(this.context, `Invalid book ID: ${id}`);
      throw new BadRequestException("ID parameter is not a valid MongoDB ObjectId");
    }
    try {
      const deletedBook = await Book.findByIdAndDelete(id);

      if (!deletedBook) {
        const notFoundError = new NotFoundException("Book not found");
        throw notFoundError;
      }

      Logger.info(this.context, `Book successfully deleted: ${id}`);
      return deletedBook;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        const badRequestError = new BadRequestException("ID parameter is invalid");
        throw badRequestError;
      }
      throw error;
    }
  }

  static async getFrontCoverById(id: string): Promise<string> {
    Logger.info(this.context, `Fetching front cover for book ID: ${id}`);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      Logger.warn(this.context, `Invalid book ID: ${id}`);
      throw new BadRequestException("ID parameter is not a valid MongoDB ObjectId");
    }
    const book = await Book.findById(id, { coverBase64: 1 });
    if (!book || !book.coverBase64) {
      throw new NotFoundException("Book or cover not found");
    }

    return book.coverBase64;
  }
}
