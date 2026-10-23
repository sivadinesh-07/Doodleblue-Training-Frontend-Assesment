
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { fetchProducts } from "../redux/productsSlice";
import { addToCart } from "../redux/cartSlice";
import Loader from "../components/Loader";

import "../styles/ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { items, status, error } = useSelector(
    (state) => state.products
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedMessage, setAddedMessage] = useState("");

  // Fetch products if they are not loaded
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  // Find selected product
  const product = items.find(
    (item) => String(item.id) === String(id)
  );

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
    setAddedMessage("");
  }, [id]);

  // Loading
  if (status === "idle" || status === "loading") {
    return (
      <main className="product-details-page">
        <Loader />
      </main>
    );
  }

  // Error
  if (status === "failed") {
    return (
      <main className="product-details-page">
        <div className="details-message">
          <h2>Unable to load product</h2>
          <p>{error || "Please try again."}</p>

          <button
            className="details-btn"
            onClick={() => dispatch(fetchProducts())}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // Product not found
  if (!product) {
    return (
      <main className="product-details-page">
        <div className="details-message">
          <h2>Product not found</h2>
          <p>This product may no longer be available.</p>

          <Link to="/" className="details-btn">
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  // Product images
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.filter(
          (image) => typeof image === "string" && image.trim()
        )
      : product.image
        ? [product.image]
        : [];

  const image =
    images[selectedImage] || images[0] || "";

  // Category
  const category =
    typeof product.category === "object"
      ? product.category?.name
      : product.category;

  // Add product to cart
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity,
      })
    );

    setAddedMessage("Added to cart successfully!");
  };

  return (
    <main className="product-details-page">
      {/* Breadcrumb */}
      <nav className="details-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Products</span>
        <span>/</span>
        <span className="breadcrumb-current">
          {product.title}
        </span>
      </nav>

      {/* Product Details */}
      <section className="product-details-container">
        {/* Image Section */}
        <div className="details-image-section">
          <div className="details-main-image">
            {image ? (
              <img
                src={image}
                alt={product.title}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="details-image-placeholder">
                Image unavailable
              </div>
            )}
          </div>

          {/* Image thumbnails */}
          {images.length > 1 && (
            <div className="details-thumbnails">
              {images.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  className={`thumbnail-btn ${
                    selectedImage === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`View product image ${index + 1}`}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Information Section */}
        <div className="details-info">
          <p className="details-category">
            {category || "General"}
          </p>

          <h1>{product.title}</h1>

          <div className="details-price">
            ${Number(product.price).toFixed(2)}
          </div>

          <div className="details-divider"></div>

          <h3>Product Description</h3>

          <p className="details-description">
            {product.description ||
              "No description available for this product."}
          </p>

          {/* Quantity */}
          <div className="details-quantity">
            <span>Quantity</span>

            <div className="quantity-control">
              <button
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                onClick={() =>
                  setQuantity((q) => q + 1)
                }
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            className="details-btn add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart · $
            {(Number(product.price) * quantity).toFixed(2)}
          </button>

          {addedMessage && (
            <p className="added-message" role="status">
              {addedMessage}{" "}
              <Link to="/cart">View Cart</Link>
            </p>
          )}

          <p className="details-shipping">
            Shipping calculated at checkout.
          </p>
        </div>
      </section>

      {/* Back Link */}
      <div className="details-back">
        <Link to="/">← Continue Shopping</Link>
      </div>
    </main>
  );
};

export default ProductDetails;
