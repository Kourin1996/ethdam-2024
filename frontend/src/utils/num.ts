export const toWei = (x: string, decimals: number) => {
  const parsed = Number.parseFloat(x);

  const amount = parsed * Math.pow(10, decimals);

  return Math.floor(amount);
};
