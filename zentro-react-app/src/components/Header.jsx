
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTotalItems } from "../redux/cartSlice";
import "../styles/Header.css";

const Header = () => {
  const totalItems = useSelector(selectTotalItems);
  const navigate = useNavigate();

  const [search, setSearch] = React.useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) return;

    navigate(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="zentro-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="brand-logo">
          Zentro<span>.</span>
        </Link>

        {/* Search */}
        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
          />

          <button type="submit" aria-label="Search">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
          </button>
        </form>

        {/* Navigation */}
        <nav className="header-nav">
          <NavLink to="/" className="nav-link">
            Products
          </NavLink>

          <Link to="/cart" className="cart-link">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M3 3h2l2.4 11.5a2 2 0 0 0 2 1.5h8.8a2 2 0 0 0 2-1.6L22 7H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>

            <span>Cart</span>

            <span className="cart-badge">
              {totalItems}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
