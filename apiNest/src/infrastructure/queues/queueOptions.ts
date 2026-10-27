export const queueJobOptions = {
  attempts: 3,
  backoff: { type: "exponential", delay: 10_000 },
  removeOnComplete: { age: 86400, count: 500 },
  removeOnFail: { age: 86400 * 7, count: 1000 },
};

export const ORDER_EXPIRY_QUEUE_NAME = "orderExpiryQueue";
export const ORDER_EXPIRY_JOB_NAME = "EXPIRE_PENDING_ORDERS";
