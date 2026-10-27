import { Inject, Injectable } from "@nestjs/common";
import { TelegramService } from "@/infrastructure/telegram/telegram.service.js";
import { LoggingService } from "@/infrastructure/logging/logging.service.js";
import { NOTIFICATION_JOB_NAMES, type NotificationJobData, type CustomerRegisteredNotificationJobData, type OrderPaidNotificationJobData, type OrderCancelledNotificationJobData, type OrderShippingAddressUpdatedNotificationJobData } from "@/infrastructure/queues/types/notification.type.js";

@Injectable()
export class NotificationProcessor {
  constructor(@Inject(TelegramService) private readonly telegram: TelegramService, @Inject(LoggingService) private readonly logging: LoggingService) {}

  async process(job: { name: string; data: NotificationJobData }) {
    switch (job.name) {
      case NOTIFICATION_JOB_NAMES.CUSTOMER_REGISTERED:
        await this.telegram.notifyCustomerRegistered(job.data as CustomerRegisteredNotificationJobData); return;
      case NOTIFICATION_JOB_NAMES.ORDER_PAID:
        await this.telegram.notifyOrderPaid(job.data as OrderPaidNotificationJobData); return;
      case NOTIFICATION_JOB_NAMES.ORDER_CANCELLED:
        await this.telegram.notifyOrderCancelled(job.data as OrderCancelledNotificationJobData); return;
      case NOTIFICATION_JOB_NAMES.ORDER_SHIPPING_ADDRESS_UPDATED:
        await this.telegram.notifyOrderShippingAddressUpdated(job.data as OrderShippingAddressUpdatedNotificationJobData); return;
      default:
        this.logging.logger.warn({ jobName: job.name }, "Unknown notification job skipped");
    }
  }
}
