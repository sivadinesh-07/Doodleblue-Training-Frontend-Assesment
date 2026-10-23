
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  addToCart,
  increase,
  decrease,
} from "../redux/cartSlice";

import QuantitySelector from "./QuantitySelector";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItem = useSelector((state) =>
    state.cart.items.find(
      (item) => item.id === product.id
    )
  );

  const quantity = cartItem?.quantity || 0;

  // Get the first available product image
  const image =
    product.images?.find(
      (img) => typeof img === "string" && img.trim() !== ""
    ) ||
    product.image ||
    "";

  // Get category name
  const category =
    typeof product.category === "object"
      ? product.category?.name
      : product.category;

  // Open product details
  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Add product to cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  // Increase quantity
  const handleIncrease = (e) => {
    e.stopPropagation();
    dispatch(increase(product.id));
  };

  // Decrease quantity
  const handleDecrease = (e) => {
    e.stopPropagation();
    dispatch(decrease(product.id));
  };

  return (
    <article className="product-card">
      {/* Product Image */}
      <button
        type="button"
        className="product-image-container"
        onClick={handleProductClick}
        aria-label={`View ${product.title}`}
      >
        {image ? (
          <img
            src={image}
            alt={product.title}
            className="product-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="product-image-fallback">
            Image unavailable
          </div>
        )}
      </button>

      {/* Product Information */}
      <div className="product-card-content">
        <span className="product-category">
          {category || "Other"}
        </span>

        <button
          type="button"
          className="product-title"
          onClick={handleProductClick}
        >
          {product.title}
        </button>

        <div className="product-card-bottom">
          <span className="product-price">
            ${Number(product.price).toFixed(2)}
          </span>

          {quantity > 0 ? (
            <QuantitySelector
              quantity={quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          ) : (
            <button
              type="button"
              className="add-cart-btn"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
