
const CART_STORAGE_KEY = "zentro_cart";

// Load cart from localStorage
export const loadCart = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error("Failed to load cart:", error);
    return [];
  }
};

// Save cart to localStorage
export const saveCart = (cartItems) => {
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cartItems)
    );
  } catch (error) {
    console.error("Failed to save cart:", error);
  }
};
