
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="zentro-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            Zentro<span>.</span>
          </Link>

          <p>
            Discover products you'll love.
            Shop smarter with Zentro.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/">Products</Link>
          <Link to="/cart">Your Cart</Link>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Zentro.
            Frontend assessment project.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
