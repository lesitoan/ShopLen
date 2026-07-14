export const auditLogService = {
  async writeLog(action: string) {
    return { action };
  },
};
