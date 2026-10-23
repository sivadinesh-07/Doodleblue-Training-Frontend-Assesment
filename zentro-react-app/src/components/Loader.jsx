
import React from "react";

const Loader = ({ message = "Loading products..." }) => {
  return (
    <div
      className="loader-container"
      role="status"
      aria-live="polite"
    >
      <div className="loader-spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default Loader;
