export type RefreshSessionActorType = "CUSTOMER" | "ADMIN";

export type RefreshSession = {
  accountId: string;
  actorType: RefreshSessionActorType;
  jti: string;
};
