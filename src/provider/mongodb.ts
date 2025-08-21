import mongoose, { Connection } from "mongoose";

import { DB_CONFIG } from "../config/mongodb/db.config";

import Logger from "./logger";

export default class Database {
  static context: string = Database.name;
  private static instance: Connection | null = null;

  private constructor() {}

  public static async getInstance(): Promise<Connection> {
    const db = mongoose.connection;

    // Eventos globales
    db.on("connecting", () => {
      Logger.info(this.context, "🔄 Mongoose connecting...");
    });

    db.on("open", () => {
      Logger.info(this.context, `✅ Mongoose connected to ${db.db?.databaseName}`);
    });

    db.on("error", (err) => {
      Logger.error(this.context, `❌ Mongoose connection error: ${err.message}`);
    });

    db.on("disconnected", () => {
      Logger.warn(this.context, "⚠️ Mongoose disconnected");
    });

    db.on("reconnected", () => {
      Logger.info(this.context, "🔄 Mongoose reconnected");
    });
    if (!Database.instance) {
      const conn = await mongoose.connect(DB_CONFIG.MONGO_URI, {
        dbName: DB_CONFIG.MONGO_DB_NAME,
        tls: true,
        retryWrites: true,
        serverSelectionTimeoutMS: 10000,
      });
      Database.instance = conn.connection;
    }

    return Database.instance;
  }
}
