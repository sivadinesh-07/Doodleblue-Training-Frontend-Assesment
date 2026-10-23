
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  increase,
  decrease,
  removeFromCart,
  clearCart,
  selectTotalItems,
  selectTotalPrice,
} from "../redux/cartSlice";

import "../styles/Cart.css";

const Cart = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = useSelector(selectTotalItems);
  const subtotal = useSelector(selectTotalPrice);

  // Shipping calculation
  const FREE_SHIPPING_LIMIT = 100;
  const SHIPPING_CHARGE = 5;

  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_LIMIT
      ? 0
      : SHIPPING_CHARGE;

  const total = subtotal + shipping;

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_LIMIT - subtotal
  );

  // Empty Cart
  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-empty">
          <div className="empty-cart-icon">🛍️</div>

          <h1>Your cart is empty</h1>

          <p>
            Looks like you haven't added anything to your cart yet.
            Let's find something you'll love.
          </p>

          <Link to="/" className="cart-primary-btn">
            Explore Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      {/* Page Heading */}
      <div className="cart-heading">
        <div>
          <p className="cart-eyebrow">YOUR SHOPPING BAG</p>
          <h1>Shopping Cart</h1>
          <p className="cart-subtitle">
            {totalItems} {totalItems === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        <button
          className="clear-cart-btn"
          onClick={() => {
            if (window.confirm("Clear all items from your cart?")) {
              dispatch(clearCart());
            }
          }}
        >
          Clear Cart
        </button>
      </div>

      {/* Free Shipping Notice */}
      {subtotal < FREE_SHIPPING_LIMIT && (
        <div className="shipping-notice">
          <p>
            You're{" "}
            <strong>
              ${remainingForFreeShipping.toFixed(2)}
            </strong>{" "}
            away from free shipping!
          </p>

          <div className="shipping-progress">
            <div
              className="shipping-progress-fill"
              style={{
                width: `${Math.min(
                  (subtotal / FREE_SHIPPING_LIMIT) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {subtotal >= FREE_SHIPPING_LIMIT && (
        <div className="shipping-notice shipping-success">
          <p>🎉 You've unlocked free shipping!</p>
        </div>
      )}

      {/* Cart Layout */}
      <div className="cart-layout">
        {/* Cart Items */}
        <section className="cart-items-section">
          <div className="cart-section-heading">
            <h2>Cart Items</h2>
          </div>

          <div className="cart-items-list">
            {cartItems.map((item) => (
              <article
                className="cart-item"
                key={item.id}
              >
                {/* Product Image */}
                <Link
                  to={`/product/${item.id}`}
                  className="cart-item-image"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </Link>

                {/* Product Information */}
                <div className="cart-item-info">
                  <p className="cart-item-category">
                    {item.category || "General"}
                  </p>

                  <Link
                    to={`/product/${item.id}`}
                    className="cart-item-title"
                  >
                    {item.title}
                  </Link>

                  <p className="cart-item-unit-price">
                    ${Number(item.price).toFixed(2)} each
                  </p>

                  {/* Quantity Controls */}
                  <div className="cart-item-actions">
                    <div className="cart-quantity-control">
                      <button
                        onClick={() =>
                          dispatch(decrease(item.id))
                        }
                        aria-label={`Decrease quantity of ${item.title}`}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          dispatch(increase(item.id))
                        }
                        aria-label={`Increase quantity of ${item.title}`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-item-btn"
                      onClick={() =>
                        dispatch(removeFromCart(item.id))
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="cart-item-total">
                  $
                  {(
                    Number(item.price) * item.quantity
                  ).toFixed(2)}
                </div>
              </article>
            ))}
          </div>

          <Link to="/" className="continue-shopping">
            ← Continue Shopping
          </Link>
        </section>

        {/* Order Summary */}
        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal ({totalItems} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>
              {shipping === 0 ? (
                <span className="free-shipping-label">
                  FREE
                </span>
              ) : (
                `$${shipping.toFixed(2)}`
              )}
            </span>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <p className="summary-note">
            Shipping is free on orders of $100 or more.
          </p>

          <button
            className="checkout-btn"
            onClick={() =>
              alert("Checkout functionality can be added next.")
            }
          >
            Proceed to Checkout
          </button>

          <div className="secure-checkout">
            <span>🔒</span>
            <span>Safe and secure shopping</span>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Cart;
