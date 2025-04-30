export function getMonthlyData(transactions) {
  const monthlyTotals = {};

  if (!Array.isArray(transactions)) {
    console.log("Expected transactions to be an array:", transactions);
    return [];
  }

  transactions.forEach(({ amount, date }) => {
    const d = new Date(date);
    const month = d.toLocaleString("default", { month: "short" });
    monthlyTotals[month] = (monthlyTotals[month] || 0) + Number(amount);
  });

  return Object.entries(monthlyTotals).map(([month, total]) => ({
    month,
    total,
  }));
}
