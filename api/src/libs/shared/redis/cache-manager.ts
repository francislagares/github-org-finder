import Redis from 'ioredis';

import { serverSchema } from '@/config/environment';

export class CacheManager {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: serverSchema.REDIS_HOST,
      port: serverSchema.REDIS_PORT,
      commandTimeout: serverSchema.REDIS_TTL,
    });
  }

  public async getCache(key: string) {
    try {
      const cacheData = await this.redis.get(key);
      return cacheData;
    } catch (err) {
      return null;
    }
  }

  public setCache(key: string, data: unknown, ttl = serverSchema.REDIS_TTL) {
    try {
      return this.redis.set(key, JSON.stringify(data), 'EX', ttl);
    } catch (err) {
      return null;
    }
  }

  public async removeCache(key: string) {
    try {
      return await this.redis.del(key);
    } catch (err) {
      return null;
    }
  }
}

export const cacheManager = new CacheManager();
