import { SITE_INFO } from "../constants/siteInfo.js";

export function generateOrderCode(date = new Date()) {
  const timestamp = date.getTime().toString(36).toUpperCase();
  return `${SITE_INFO.bankTransferNotePrefix}${timestamp}`;
}
