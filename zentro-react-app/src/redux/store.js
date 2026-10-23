
import { configureStore } from "@reduxjs/toolkit";

import productsReducer from "./productsSlice";
import cartReducer from "./cartSlice";
import { saveCart } from "./cartStorage";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
});

// Track the previous cart items
let previousItems = store.getState().cart.items;

// Save cart whenever items change
store.subscribe(() => {
  const currentItems = store.getState().cart.items;

  if (currentItems !== previousItems) {
    previousItems = currentItems;
    saveCart(currentItems);
  }
});
