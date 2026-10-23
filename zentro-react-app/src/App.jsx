
import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          {/* Products listing */}
          <Route path="/" element={<Products />} />

          {/* Single product details */}
          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          {/* Shopping cart */}
          <Route path="/cart" element={<Cart />} />

          {/* Invalid routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
