
export const investmentStatus = {
    PENDING: "PENDING",
    REJECTED: "REJECTED",
    ACCEPTED: "ACCEPTED",
};

// Export the type based on the object's VALUES ("PENDING" | "REJECTED" | "ACCEPTED")
export type TInvestmentStatus = (typeof investmentStatus)[keyof typeof investmentStatus];

export const investmentStatusEnum: TInvestmentStatus[] = [
    investmentStatus.ACCEPTED,
    investmentStatus.PENDING,
    investmentStatus.REJECTED
];