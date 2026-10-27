-- AlterEnum
ALTER TYPE "order_status" ADD VALUE 'CANCELLATION_REQUESTED';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "cancellation_request_reason" TEXT,
ADD COLUMN     "cancellation_requested_at" TIMESTAMPTZ(6),
ADD COLUMN     "cancellation_requested_from" "order_status";
