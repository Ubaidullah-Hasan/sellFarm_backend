export const depositStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type TDepositStatus =
  (typeof depositStatus)[keyof typeof depositStatus];


export const paymentType = {
  BKASH: "BKASH",
  NAGAD: "NAGAD",
} as const;

export type TPaymentType =
  (typeof paymentType)[keyof typeof paymentType];