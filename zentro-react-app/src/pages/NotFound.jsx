
import React from "react";
import { Link } from "react-router-dom";

import "../styles/NotFound.css";

const NotFound = () => {
  return (
    <main className="not-found-page">
      <div className="not-found-content">
        <p className="not-found-brand">ZENTRO</p>

        <h1>404</h1>

        <h2>Oops! Page not found.</h2>

        <p className="not-found-description">
          The page you're looking for doesn't exist or may
          have been moved.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-primary">
            Back to Home
          </Link>

          <Link to="/cart" className="not-found-secondary">
            View Cart
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
