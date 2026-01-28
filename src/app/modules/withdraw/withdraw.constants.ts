export const withdrawStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type TWithdrawStatus =
  (typeof withdrawStatus)[keyof typeof withdrawStatus];