function IncomeOverview({ totalIncome, onAddIncome, onExport }) {
  return (
    <div className="overview-section">
      <div className="overview-header">
        <div>
          <h3>Overview</h3>
          <p>Manage your income and revenue streams.</p>
        </div>

        <div className="overview-buttons">
          <button type="button" className="btn btn-outline-secondary" onClick={onExport}>
            Export CSV
          </button>

          <button type="button" className="btn btn-primary" onClick={onAddIncome}>
            + Add Income
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomeOverview;
