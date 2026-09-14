function IncomeCard({
  title,
  date,
  category,
  amount,
  onDelete,
}) {

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="income-card">

      {/* Delete Button */}
      <button
        type="button"
        className="delete-income-btn"
        onClick={onDelete}
        title="Delete income"
        aria-label="Delete income"
      >
        ❌
      </button>

      {/* Income Information */}
      <div className="income-card-content">

        <h5>{title}</h5>

        <p className="income-date">
          {formattedDate}
        </p>

        <span className="income-category">
          {category}
        </span>

        <strong className="income-amount">
          ${amount}
        </strong>

      </div>

    </div>
  );
}

export default IncomeCard;
