import Logger from "../../provider/logger";

import { SearchHistory, ISearchHistory } from "./history.model";

export class SearchHistoryService {
  static context = SearchHistoryService.name;

  static async add(query: string): Promise<ISearchHistory> {
    Logger.info(this.context, `Adding search query: ${query}`);
    try {
      const search = new SearchHistory({ query });
      const saved = await search.save();
      Logger.info(this.context, `Search query saved with _id: ${saved._id}`);
      return saved;
    } catch (error) {
      Logger.error(
        this.context,
        `Error saving search query: ${query}`,
        null,
        JSON.parse(JSON.stringify(error)),
      );
      throw error;
    }
  }

  static async getLast(limit = 5): Promise<ISearchHistory[]> {
    Logger.info(this.context, `Fetching last ${limit} searches`);
    try {
      const searches = await SearchHistory.find().sort({ createdAt: -1 }).limit(limit);
      Logger.info(this.context, `Fetched ${searches.length} searches`);
      return searches;
    } catch (error) {
      Logger.error(
        this.context,
        `Error fetching last ${limit} searches`,
        null,
        JSON.parse(JSON.stringify(error)),
      );
      throw error;
    }
  }
}
