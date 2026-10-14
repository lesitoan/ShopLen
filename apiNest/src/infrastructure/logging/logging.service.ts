import { Inject, Injectable, type LoggerService } from "@nestjs/common";
import { EnvService } from "@/config/env.service.js";
import { createLogger } from "@/infrastructure/logging/logger.factory.js";

@Injectable()
export class LoggingService implements LoggerService {
  readonly logger;

  constructor(@Inject(EnvService) config: EnvService) {
    this.logger = createLogger(config.values);
  }

  log(message: unknown) { this.logger.info(message); }
  error(message: unknown) { this.logger.error(message); }
  warn(message: unknown) { this.logger.warn(message); }
  debug(message: unknown) { this.logger.debug(message); }
  verbose(message: unknown) { this.logger.trace(message); }
  fatal(message: unknown) { this.logger.fatal(message); }
}
