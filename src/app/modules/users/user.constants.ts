export const enum userRole {
  ADMIN = "ADMIN",
  INVESTOR = "INVESTOR",
  //   "ADMIN", => ACCESS userRole[0]  ======== (ব্যাকওয়ার্ড এক্সেস)
  //   "INVESTOR", => ACCESS userRole[0]
}

export const enum userStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}
