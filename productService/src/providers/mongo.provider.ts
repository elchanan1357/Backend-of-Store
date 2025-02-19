import mongoose from "mongoose";
import { config } from "../utils/config";

class MongoProvider {
  private static instance: MongoProvider;
  private dbConnection?: typeof mongoose;

  private constructor() {}

  public static getInstance(): MongoProvider {
    if (!MongoProvider.instance) {
      MongoProvider.instance = new MongoProvider();
    }
    return MongoProvider.instance;
  }

  public async connect(): Promise<void> {
    if (!this.dbConnection) {
      try {
        this.dbConnection = await mongoose.connect(config.db.connectionString);
        console.log('Mongo connected!!');
      } catch (error) {
        console.error('Failed to connect to Mongo: ', error);
        throw error;
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.dbConnection) {
      try {
        await mongoose.connection.close();
        this.dbConnection = undefined;
        console.log('Disconnected from Mongo');
      } catch (error) {
        console.error('Failed to disconnecting from Mongo: ', error);
      }
    }
  }

  public getConnection(): typeof mongoose | undefined {
    return this.dbConnection;
  }
}

export const mongoProvider = MongoProvider.getInstance();
