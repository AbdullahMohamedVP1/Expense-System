import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#10B981', '#EF4444'];

export default function FinancialOverview({ data }) {
  return (
    <article className="dashboard-card dashboard-chart-card">
      <div className="dashboard-card-heading">
        <div>
          <h2>Financial Overview</h2>
          <span>Income vs. expenses</span>
        </div>
      </div>
      <div className="dashboard-chart dashboard-pie-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={4}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
