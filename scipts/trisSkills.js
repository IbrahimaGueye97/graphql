export function GetMaxAmounts(transactions) {
  const maxAmounts = {};

  transactions.forEach((transaction) => {
    const { type, amount } = transaction;
    if (!maxAmounts[type] || amount > maxAmounts[type].amount) {
      maxAmounts[type] = { type, amount };
    }
  });

  return Object.values(maxAmounts);
}
