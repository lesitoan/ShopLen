export type AuditLogModel = {
  id: string;
  actorId?: string;
  action: string;
  entityName: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
};
