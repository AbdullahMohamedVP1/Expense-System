import React from "react";
import CARD_2 from "../../assets/images/card2.png";
import { LuTrendingUpDown } from "react-icons/lu";

export const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="d-flex align-items-center gap-3 bg-white p-3 rounded-4 shadow-sm border border-light">
      <div 
        className={`d-flex align-items-center justify-content-center text-white rounded-3 ${color}`}
        style={{ width: "48px", height: "48px", fontSize: "24px" }}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-secondary mb-1 small fw-normal">{label}</h6>
        <span className="fw-bold fs-5 text-dark">{value}</span>
      </div>
    </div>
  );
};

const AuthLayout = ({ children }) => {
  const baseShapeStyle = {
    position: "absolute",
    backgroundColor: "#0d6efd", 
    borderRadius: "28px",
    opacity: 0.85
  };

  return (
    <div className="d-flex min-vh-100 overflow-hidden">
      <div className="w-50 px-5 pt-4 pb-5 d-flex flex-column justify-content-between bg-white">
        <div>
          <h2 className="fs-5 fw-bold text-dark mb-4">Expense Tracker</h2>
          {children}
        </div>
      </div>

      <div 
        className="w-50 d-none d-md-flex flex-column align-items-center justify-content-center position-relative overflow-hidden p-5"
        style={{ backgroundColor: "#f3f6f9" }}
      >
      
        <div style={{ ...baseShapeStyle, width: "200px", height: "160px", top: "50px", right: "-30px" }} />
        <div style={{ ...baseShapeStyle, width: "130px", height: "220px", top: "35%", right: "-20px" }} />
        <div style={{ ...baseShapeStyle, width: "160px", height: "160px", bottom: "30px", left: "30px" }} />

      
        <div className="position-relative w-100 mb-4" style={{ zIndex: 20, maxWidth: "420px" }}>
          <StatsInfoCard
            icon={<LuTrendingUpDown />}
            label="Track Your Income & Expenses"
            value="$430,000"
            color="bg-primary"
          />
        </div>

  
        <div className="position-relative w-100 d-flex justify-content-center" style={{ zIndex: 20 }}>
          <img
            src={CARD_2}
            className="img-fluid rounded-4 shadow-lg"
            style={{ maxWidth: "420px", width: "100%" }}
            alt="card"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;