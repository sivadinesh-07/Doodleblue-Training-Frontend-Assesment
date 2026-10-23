
import { createSlice } from "@reduxjs/toolkit";
import { loadCart } from "./cartStorage";

const initialState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // Add product to cart
    addToCart: (state, action) => {
      const product = action.payload;

      const existingItem = state.items.find(
        (item) => item.id === product.id
      );

      const quantity = Math.max(
        1,
        Math.floor(Number(product.quantity) || 1)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: Number(product.price) || 0,
          image:
            product.image ||
            product.images?.[0] ||
            "",
          category:
            typeof product.category === "object"
              ? product.category?.name || "General"
              : product.category || "General",
          quantity,
        });
      }
    },

    // Increase quantity
    increase: (state, action) => {
      const item = state.items.find(
        (item) => item.id === action.payload
      );

      if (item) {
        item.quantity += 1;
      }
    },

    // Decrease quantity
    // Remove item when quantity reaches zero
    decrease: (state, action) => {
      const item = state.items.find(
        (item) => item.id === action.payload
      );

      if (item) {
        if (item.quantity <= 1) {
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
        } else {
          item.quantity -= 1;
        }
      }
    },

    // Remove individual item
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
    },
  },
});

// Actions
export const {
  addToCart,
  increase,
  decrease,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectTotalItems = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

export const selectTotalPrice = (state) =>
  state.cart.items.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

// Reducer
export default cartSlice.reducer;
