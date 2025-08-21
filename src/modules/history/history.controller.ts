import { NextFunction, Request, Response } from "express";

import Logger from "../../provider/logger.ts";

import { SearchHistoryService } from "./history.service.ts";

export default class HistoryController {
  static context = HistoryController.name;

  static async lastSearch(req: Request, res: Response, next: NextFunction) {
    Logger.info(HistoryController.context, "Fetching last 5 searches", req.method);

    try {
      const searches = await SearchHistoryService.getLast(5);
      Logger.info(HistoryController.context, `Found ${searches.length} searches`);
      res.status(200).json(searches);
    } catch (error) {
      Logger.error(
        HistoryController.context,
        "Error fetching last searches",
        req.method,
        JSON.parse(JSON.stringify(error)),
      );
      next(error);
    }
  }
}
