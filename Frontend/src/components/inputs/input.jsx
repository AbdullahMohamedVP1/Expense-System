import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = ({ value, onChange, placeholder, label, type = "text" }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-3 text-start">
      {label && <label className="form-label small text-secondary">{label}</label>}
      
      <div className="input-group">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="form-control"
          value={value}
          onChange={(e) => onChange(e)}
        />
        
        {type === "password" && (
          <span 
            className="input-group-text bg-white border-start-0 cursor-pointer text-primary"
            onClick={toggleShowPassword}
            style={{ cursor: "pointer" }}
          >
            {showPassword ? (
              <FaRegEye size={20} />
            ) : (
              <FaRegEyeSlash size={20} className="text-secondary" />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;