export const calcCommitmentDays = (startDate: Date): number => {
  startDate.setHours(0, 0, 0, 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diff = now.getTime() - startDate.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return days;
};

export const calcCommitmentActivityExpirationDate = (renewalDate: Date, renewalPeriodDays: number): Date => {
  const expirationDate = new Date(renewalDate);
  expirationDate.setDate(renewalDate.getDate() + renewalPeriodDays);

  expirationDate.setHours(23, 59, 59, 999);

  return expirationDate;
};
