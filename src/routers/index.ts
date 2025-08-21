import { Router } from "express";

import { BookController } from "../modules/books/book.controller.ts";
import { validateDto } from "../middleware/dto.validation.ts";
import { CreateBookDto, UpdateBookDto } from "../modules/books/book.dto.ts";
import HistoryController from "../modules/history/history.controller.ts";
const router = Router();
router.get("/", (req, res) => {
  res.json({ message: "OK" });
});
router.get("/books/search", BookController.search);
router.post("/books/my-library", validateDto(CreateBookDto), BookController.create);
router.get("/books/my-library", BookController.list);
router.get("/books/my-library/:id", BookController.findById);
router.put("/books/my-library/:id", validateDto(UpdateBookDto), BookController.update);
router.delete("/books/my-library/:id", BookController.delete);
router.get("/books/library/front-cover/:id", BookController.getFrontCover);
router.get("/books/last-search", HistoryController.lastSearch);
export default router;
