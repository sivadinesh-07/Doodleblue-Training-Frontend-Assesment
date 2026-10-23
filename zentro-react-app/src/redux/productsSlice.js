
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL =
  "https://api.escuelajs.co/api/v1/products?offset=0&limit=48";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid API response");
      }

      // Clean and format product data
      const validProducts = data
        .filter((product) => {
          return (
            product.id &&
            product.title &&
            Array.isArray(product.images) &&
            product.images.length > 0
          );
        })
        .map((product) => {
          const images = product.images
            .filter(
              (img) =>
                typeof img === "string" &&
                img.trim() !== ""
            )
            .map((img) => {
              // Clean escaped quotation marks if present
              return img
                .trim()
                .replace(/^["']|["']$/g, "")
                .replace(/\\+"/g, "");
            })
            .filter((img) => /^https?:\/\//i.test(img));

          return {
            ...product,
            images,
            category:
              typeof product.category === "object"
                ? product.category?.name || "Other"
                : product.category || "Other",
          };
        })
        .filter(
          (product) =>
            product.title.trim() !== "" &&
            product.images.length > 0
        );

      return validProducts;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Something went wrong"
      );
    }
  }
);

const productsSlice = createSlice({
  name: "products",

  initialState: {
    items: [],
    status: "idle",
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default productsSlice.reducer;
