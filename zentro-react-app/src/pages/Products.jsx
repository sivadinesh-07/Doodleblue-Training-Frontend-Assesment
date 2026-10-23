
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { fetchProducts } from "../redux/productsSlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

import "../styles/Products.css";

const PRODUCTS_PER_PAGE = 12;

// Get category name
const getCategoryName = (product) => {
  if (typeof product.category === "string") {
    return product.category.trim();
  }

  return product.category?.name?.trim() || "Other";
};

function Products() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { items, status, error } = useSelector(
    (state) => state.products
  );

  const searchTerm = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  // Keep only usable products
  const validProducts = useMemo(() => {
    return items.filter((product) => {
      return (
        product.id &&
        product.title?.trim() &&
        Number.isFinite(Number(product.price)) &&
        product.images?.length > 0
      );
    });
  }, [items]);

  // Get valid categories
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(validProducts.map(getCategoryName)),
    ];

    const cleanCategories = uniqueCategories
      .filter(
        (name) =>
          name &&
          name !== "Other" &&
          !/updated|config|string|new category/i.test(name)
      )
      .sort((a, b) => a.localeCompare(b));

    return ["All", ...cleanCategories];
  }, [validProducts]);

  // Reset category if it is no longer available
  useEffect(() => {
    if (
      selectedCategory !== "All" &&
      !categories.includes(selectedCategory)
    ) {
      setSelectedCategory("All");
    }
  }, [categories, selectedCategory]);

  // Search, filter and sort
  const filteredProducts = useMemo(() => {
    let result = [...validProducts];

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          getCategoryName(product) === selectedCategory
      );
    }

    // Search
    const search = searchTerm.trim().toLowerCase();

    if (search) {
      result = result.filter((product) => {
        const title = product.title.toLowerCase();
        const description =
          product.description?.toLowerCase() || "";
        const category =
          getCategoryName(product).toLowerCase();

        return (
          title.includes(search) ||
          description.includes(search) ||
          category.includes(search)
        );
      });
    }

    // Price sorting
    if (sortOrder === "low-high") {
      result.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    } else if (sortOrder === "high-low") {
      result.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    return result;
  }, [validProducts, selectedCategory, searchTerm, sortOrder]);

  // Reset page on filters
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );

  // Keep current page valid
  useEffect(() => {
    setCurrentPage((page) =>
      Math.min(page, Math.max(totalPages, 1))
    );
  }, [totalPages]);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  const goToPage = (page) => {
    setCurrentPage(
      Math.max(1, Math.min(page, Math.max(totalPages, 1)))
    );
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedCategory("All");
    setSortOrder("featured");
    setCurrentPage(1);
    setSearchParams({});
  };

  // Loading
  if (status === "loading" || status === "idle") {
    return (
      <section className="products-container">
        <Loader />
      </section>
    );
  }

  // Error
  if (status === "failed") {
    return (
      <section className="products-container">
        <div className="products-error">
          <h2>Unable to load products</h2>
          <p>{error || "Please try again later."}</p>

          <button
            className="retry-btn"
            onClick={() => dispatch(fetchProducts())}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="products-container">
      {/* Heading */}
      <div className="products-heading">
        <span className="eyebrow">DISCOVER ZENTRO</span>

        <h1>Find your favorites.</h1>

        <p>
          Explore products picked for your everyday life.
        </p>
      </div>

      {/* Toolbar */}
      <div className="products-toolbar">
        <p className="product-count">
          {filteredProducts.length} products
        </p>

        <div className="sort-container">
          <label htmlFor="sort-products">Sort by:</label>

          <select
            id="sort-products"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div
        className="category-filters"
        aria-label="Filter products by category"
      >
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`category-btn ${
              selectedCategory === category ? "active" : ""
            }`}
            aria-pressed={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 ? (
        <div className="products-empty">
          <h2>No products found</h2>

          <p>
            Try another search or choose a different category.
          </p>

          <button
            className="retry-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="products-grid">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

          {/* Pagination Info */}
          <div className="pagination-info">
            <p>
              Showing {startIndex + 1} -{" "}
              {Math.min(
                startIndex + PRODUCTS_PER_PAGE,
                filteredProducts.length
              )}{" "}
              of {filteredProducts.length} products
            </p>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="pagination"
              aria-label="Product pagination"
            >
              <button
                type="button"
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`page-btn ${
                    currentPage === page ? "active" : ""
                  }`}
                  aria-current={
                    currentPage === page ? "page" : undefined
                  }
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}

export default Products;
