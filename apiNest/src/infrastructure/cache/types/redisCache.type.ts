export type RememberJsonOptions = {
  ttlSeconds: number;
  useLock?: boolean;
  lockTtlSeconds?: number;
  lockWaitMilliseconds?: number;
};
