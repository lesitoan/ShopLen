import { getRedisClient } from "@/config/redisClient.js";
import type {
  RefreshSession,
  RefreshSessionActorType,
} from "@/types/refreshSession.type.js";
import { AppError } from "@/utils/appError.js";

const REFRESH_SESSION_KEY_PREFIX = "auth:refresh-session";
const ACCOUNT_SESSION_INDEX_KEY_PREFIX = "auth:refresh-sessions";

function getRefreshSessionKey(actorType: RefreshSessionActorType, jti: string) {
  return `${REFRESH_SESSION_KEY_PREFIX}:${actorType}:${jti}`;
}

function getRefreshSessionKeyPrefix(actorType: RefreshSessionActorType) {
  return `${REFRESH_SESSION_KEY_PREFIX}:${actorType}:`;
}

function getAccountSessionIndexKey(
  actorType: RefreshSessionActorType,
  accountId: string,
) {
  return `${ACCOUNT_SESSION_INDEX_KEY_PREFIX}:${actorType}:${accountId}`;
}

function parseRefreshSession(rawValue: string | null): RefreshSession | null {
  if (!rawValue) {
    return null;
  }

  try {
    const value = JSON.parse(rawValue) as Partial<RefreshSession>;

    if (
      typeof value.accountId !== "string" ||
      (value.actorType !== "CUSTOMER" && value.actorType !== "ADMIN") ||
      typeof value.jti !== "string"
    ) {
      return null;
    }

    return {
      accountId: value.accountId,
      actorType: value.actorType,
      jti: value.jti,
    };
  } catch {
    return null;
  }
}

function invalidRefreshToken() {
  return new AppError(
    "Refresh token không hợp lệ hoặc đã hết hạn.",
    401,
    "REFRESH_TOKEN_INVALID",
  );
}

export const refreshSessionService = {
  async create(
    session: RefreshSession,
    ttlSeconds: number,
    maxSessions: number,
  ) {
    if (!Number.isInteger(ttlSeconds) || ttlSeconds <= 0) {
      throw invalidRefreshToken();
    }

    const redis = await getRedisClient();
    const indexKey = getAccountSessionIndexKey(
      session.actorType,
      session.accountId,
    );

    await redis.eval(
      `redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[2])
       redis.call('ZADD', KEYS[2], ARGV[3], ARGV[4])
       redis.call('EXPIRE', KEYS[2], ARGV[2])
       while redis.call('ZCARD', KEYS[2]) > tonumber(ARGV[5]) do
         local removed = redis.call('ZPOPMIN', KEYS[2], 1)
         if removed[1] then redis.call('DEL', ARGV[6] .. removed[1]) end
       end
       return 1`,
      {
        keys: [getRefreshSessionKey(session.actorType, session.jti), indexKey],
        arguments: [
          JSON.stringify(session),
          String(ttlSeconds),
          String(Date.now()),
          session.jti,
          String(maxSessions),
          getRefreshSessionKeyPrefix(session.actorType),
        ],
      },
    );
  },

  async consume(session: RefreshSession) {
    const redis = await getRedisClient();
    const sessionKey = getRefreshSessionKey(session.actorType, session.jti);
    const rawSession = (await redis.sendCommand(["GETDEL", sessionKey])) as
      | string
      | null;
    const storedSession = parseRefreshSession(rawSession);

    if (
      !storedSession ||
      storedSession.accountId !== session.accountId ||
      storedSession.actorType !== session.actorType ||
      storedSession.jti !== session.jti
    ) {
      throw invalidRefreshToken();
    }

    await redis.zRem(
      getAccountSessionIndexKey(session.actorType, session.accountId),
      session.jti,
    );
  },

  async revoke(session: RefreshSession) {
    const redis = await getRedisClient();

    await redis.del(getRefreshSessionKey(session.actorType, session.jti));
    await redis.zRem(
      getAccountSessionIndexKey(session.actorType, session.accountId),
      session.jti,
    );
  },

  async revokeAll(actorType: RefreshSessionActorType, accountId: string) {
    const redis = await getRedisClient();
    const indexKey = getAccountSessionIndexKey(actorType, accountId);
    const jtis = await redis.zRange(indexKey, 0, -1);

    if (jtis.length > 0) {
      await redis.del(
        jtis.map((jti) => getRefreshSessionKey(actorType, jti)),
      );
    }

    await redis.del(indexKey);
  },
};
