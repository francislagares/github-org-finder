import mongoose from 'mongoose';

import logger from '@/utils/logger';

import { DATABASE_URL } from './environment';

export class MongoDBInstance {
  private static instance: MongoDBInstance;

  private constructor() {
    this.getDbConnection();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new MongoDBInstance();
    }
    return this.instance;
  }

  private async getDbConnection() {
    try {
      if (mongoose.connection.readyState === 0) {
        // checks if mongoose is not connected
        await mongoose.connect(DATABASE_URL as string);
        logger.info('Successfully connected to database!');
      }
    } catch (error) {
      logger.error('UsersService databaseConnection() method error:', error);
    }
  }
}
