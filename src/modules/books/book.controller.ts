import { NextFunction, Request, Response } from "express";

import Logger from "../../provider/logger";
import { SearchHistoryService } from "../history/history.service";

import { BookService } from "./book.service";
import { IBookObject } from "./interface/book.interface";

export class BookController {
  static context: string = BookController.name;
  constructor() {}
  static async search(req: Request, res: Response) {
    Logger.info(BookController.context, "Retrieving books", req.method);

    const { q, limit } = req.query;
    SearchHistoryService.add(String(q));
    const books: Partial<IBookObject>[] = await BookService.searchBooks(
      String(q),
      Number(limit || 10),
    );
    Logger.info(BookController.context, `Search query: "${q}", results found: ${books.length}`);
    res.status(200).json(books);
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    Logger.info(BookController.context, "Creating a new book", req.method);
    try {
      Logger.info(
        BookController.context,
        `Payload received for create: ${JSON.stringify({ ...req.body, coverBase64: undefined })}`,
        req.method,
      );
      const book = await BookService.create(req.body);
      res.status(201).json(book);
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      Logger.info(BookController.context, `Searching book by _id: ${req.params.id}`, req.method);
      const book = await BookService.findById(req.params.id);
      Logger.info(
        BookController.context,
        `Book found: ${book.title} by ${book.author} _id: ${book._id}`,
      );
      res.status(200).json(book);
    } catch (error) {
      Logger.error(
        BookController.context,
        "An error occurred",
        null,
        JSON.parse(JSON.stringify(error)),
      );

      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      Logger.info(BookController.context, `Updating book with _id: ${req.params.id}`, req.method);
      Logger.info(
        BookController.context,
        `Payload received for update: ${JSON.stringify({ ...req.body, coverBase64: undefined })}`,
      );
      const book = await BookService.update(req.params.id, req.body);
      Logger.info(
        BookController.context,
        `Book updated successfully: ${book.title} (_id: ${book._id})`,
      );
      res.status(200).json(book);
    } catch (error: unknown) {
      Logger.error(
        BookController.context,
        "An error occurred while updating the book",
        null,
        JSON.parse(JSON.stringify(error)),
      );

      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      Logger.info(
        BookController.context,
        `Attempting to delete book with _id: ${req.params.id}`,
        req.method,
      );

      const deletedBook = await BookService.delete(req.params.id);
      if (deletedBook) {
        Logger.info(
          BookController.context,
          `Book deleted: ${deletedBook.title} _id: ${deletedBook._id}`,
        );
        res.status(200).json({
          id: deletedBook._id,
          message: `Book deleted: ${deletedBook.title}`,
        });
      } else {
        Logger.warn(BookController.context, `Book not found to delete _id: ${req.params.id}`);
      }
    } catch (error: unknown) {
      Logger.error(
        BookController.context,
        "An error occurred while updating the book",
        null,
        JSON.parse(JSON.stringify(error)),
      );

      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    const filters = req.query;
    Logger.info(
      BookController.context,
      `Searching book list with filter: ${JSON.stringify(filters)}`,
      req.method,
    );
    try {
      const books = await BookService.search(filters);

      res.status(200).json(books);
    } catch (error) {
      Logger.error(
        BookController.context,
        "An error occurred",
        null,
        JSON.parse(JSON.stringify(error)),
      );

      next(error);
    }
  }

  static async getFrontCover(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    Logger.info(BookController.context, `Fetching front cover for book ID: ${id}`);

    try {
      const coverBase64 = await BookService.getFrontCoverById(id);

      res.status(200).json({
        coverBase64,
      });
      Logger.info(BookController.context, `Returned front cover for book ID: ${id}`);
    } catch (error: unknown) {
      Logger.error(
        BookController.context,
        `Error fetching front cover for book ID: ${id}`,
        null,
        JSON.parse(JSON.stringify(error)),
      );
      next(error);
    }
  }
}
