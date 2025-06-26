// components/TimeToggle.js
import React from "react";
import "./TimeToggle.css";

const TimeToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="time-range-toggle">
      {["monthly", "daily"].map((mode) => (
        <div
          key={mode}
          className="time-option"
          onClick={() => setViewMode(mode)}
        >
          <div className={`time-circle-outer ${viewMode === mode ? "active" : ""}`}>
            {viewMode === mode && <div className="time-circle-inner" />}
          </div>
          <span className={viewMode === mode ? "active-label" : "inactive-label"}>
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TimeToggle;
