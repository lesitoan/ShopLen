import { getRedisClient } from "@/config/redisClient.js";
import { logger } from "@/config/logger.js";

type RememberJsonOptions = {
  ttlSeconds: number;
  useLock?: boolean;
  lockTtlSeconds?: number;
  lockWaitMilliseconds?: number;
};

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function readJson<Value>(key: string): Promise<Value | undefined> {
  try {
    const redis = await getRedisClient();
    const rawValue = await redis.get(key);

    if (!rawValue) {
      return undefined;
    }

    try {
      return JSON.parse(rawValue) as Value;
    } catch {
      await redis.del(key);
      return undefined;
    }
  } catch (error) {
    logger.warn({ err: error, key }, "Redis cache read failed");
    return undefined;
  }
}

async function writeJson<Value>(key: string, value: Value, ttlSeconds: number) {
  try {
    const redis = await getRedisClient();
    await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (error) {
    logger.warn({ err: error, key }, "Redis cache write failed");
  }
}

export async function rememberJson<Value>(
  key: string,
  options: RememberJsonOptions,
  loader: () => Promise<Value>,
): Promise<Value> {
  const cachedValue = await readJson<Value>(key);

  if (cachedValue !== undefined) {
    return cachedValue;
  }

  if (!options.useLock) {
    const value = await loader();
    await writeJson(key, value, options.ttlSeconds);
    return value;
  }

  const lockKey = `${key}:lock`;
  const lockTtlSeconds = options.lockTtlSeconds ?? 5;
  const lockWaitMilliseconds = options.lockWaitMilliseconds ?? 75;
  let lockAcquired = false;

  try {
    const redis = await getRedisClient();
    lockAcquired = Boolean(
      await redis.set(lockKey, "1", { NX: true, EX: lockTtlSeconds }),
    );

    if (!lockAcquired) {
      await wait(lockWaitMilliseconds);
      const cachedValueCreatedByAnotherRequest = await readJson<Value>(key);

      if (cachedValueCreatedByAnotherRequest !== undefined) {
        return cachedValueCreatedByAnotherRequest;
      }
    }
  } catch (error) {
    logger.warn({ err: error, key }, "Redis cache lock failed");
    return loader();
  }

  try {
    const value = await loader();
    await writeJson(key, value, options.ttlSeconds);
    return value;
  } finally {
    if (lockAcquired) {
      try {
        const redis = await getRedisClient();
        await redis.del(lockKey);
      } catch (error) {
        logger.warn({ err: error, lockKey }, "Redis cache lock release failed");
      }
    }
  }
}

export async function deleteCacheKeys(keys: string[]) {
  if (keys.length === 0) {
    return;
  }

  try {
    const redis = await getRedisClient();
    await redis.del(keys);
  } catch (error) {
    logger.warn({ err: error, keys }, "Redis cache invalidation failed");
  }
}
