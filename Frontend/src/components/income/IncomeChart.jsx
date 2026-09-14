function IncomeChart({ totalIncome, incomeList }) {
  // Group by the full date, not just the day-of-month — grouping by day-of-month
  // alone (the original behavior) merged e.g. Oct 5 and Nov 5 into a single bar.
  const dailyIncome = {};

  incomeList.forEach((income) => {
    if (!income.date) return;
    dailyIncome[income.date] = (dailyIncome[income.date] || 0) + (Number(income.amount) || 0);
  });

  const data = Object.entries(dailyIncome)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const maxValue = Math.max(...data.map((item) => item.value), 1);

  // If every entry falls in the same month, keep the compact "day number" label.
  // Otherwise disambiguate with "5 Nov" style labels so bars aren't misread.
  const sameMonth =
    data.length > 0 &&
    data.every((item) => {
      const d = new Date(item.date);
      const first = new Date(data[0].date);
      return d.getFullYear() === first.getFullYear() && d.getMonth() === first.getMonth();
    });

  const formatLabel = (dateStr) => {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return sameMonth
      ? String(d.getDate())
      : new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(d);
  };

  return (
    <div className="income-chart-card">
      <div className="income-chart-header">
        <div>
          <h4>Daily Income Overview</h4>
          <p>{sameMonth ? 'Current Month' : 'All recorded income'}</p>
        </div>

        <div className="total-income">
          <span>TOTAL INCOME</span>

          <strong>
            $
            {Number(totalIncome).toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}
          </strong>
        </div>
      </div>

      <div className="bar-chart">
        <div className="bar-y-axis">
          <span>{Math.ceil(maxValue)}</span>
          <span>{Math.ceil(maxValue * 0.75)}</span>
          <span>{Math.ceil(maxValue * 0.5)}</span>
          <span>{Math.ceil(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        <div className="bar-chart-content">
          <div className="bars">
            {data.length > 0 ? (
              data.map((item) => {
                const height = (item.value / maxValue) * 100;

                return (
                  <div className="bar-item" key={item.date}>
                    <div
                      className="bar"
                      style={{ height: `${height}%` }}
                      title={`$${item.value.toFixed(2)}`}
                    />
                    <span className="bar-label">{formatLabel(item.date)}</span>
                  </div>
                );
              })
            ) : (
              <p>No income data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeChart;
