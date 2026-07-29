import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartState, AddToCartPayload } from "@/types/cart.type";

const CART_STORAGE_KEY = "shoplen_cart";

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load cart from localStorage", error);
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage", error);
  }
};

const initialState: CartState = {
  items: [],
  isHydrated: false,
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state) => {
      state.items = loadCartFromStorage();
      state.isHydrated = true;
    },

    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const { product, color, quantity } = action.payload;
      const addQty = quantity && quantity > 0 ? quantity : 1;
      const colorVal = color || "Mặc định";
      const itemId = `${product.id}-${colorVal}`;

      const existingIndex = state.items.findIndex(
        (item) =>
          String(item.id) === String(itemId) ||
          (String(item.id).startsWith(String(product.id)) && item.color === colorVal)
      );

      if (existingIndex !== -1) {
        const item = state.items[existingIndex];
        const newQty = item.quantity + addQty;
        const maxStock = item.stock && item.stock > 0 ? item.stock : 99;
        item.quantity = Math.min(newQty, maxStock);
        state.error = null;
        saveCartToStorage(state.items);
        return;
      }

      // Giới hạn tối đa 10 sản phẩm khác loại trong giỏ hàng
      if (state.items.length >= 10) {
        state.error = "Giỏ hàng chỉ được chứa tối đa 10 sản phẩm khác loại!";
        return;
      }

      const priceVal =
        product.price ?? product.salePrice ?? product.originalPrice ?? 0;
      const originalPriceVal =
        product.salePrice && product.originalPrice
          ? product.originalPrice
          : undefined;
      const imageVal =
        product.image ||
        product.thumbnail?.url ||
        (product.images && product.images[0]?.url) ||
        "/logo.png";
      const categoryVal =
        typeof product.category === "string"
          ? product.category
          : product.category?.name || "Móc khóa";
      const stockVal = product.stockQuantity ?? product.stock ?? 99;

      const newItem: CartItem = {
        id: itemId,
        name: product.name,
        category: categoryVal,
        color: colorVal,
        price: priceVal,
        originalPrice: originalPriceVal,
        quantity: addQty,
        image: imageVal,
        stock: stockVal,
        isAvailable: stockVal > 0,
      };

      state.items.push(newItem);
      state.error = null;
      saveCartToStorage(state.items);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string | number; delta: number }>
    ) => {
      const { id, delta } = action.payload;
      const index = state.items.findIndex(
        (item) => String(item.id) === String(id)
      );

      if (index !== -1) {
        const item = state.items[index];
        const newQty = item.quantity + delta;
        if (newQty <= 0) {
          state.items.splice(index, 1);
        } else {
          const maxStock = item.stock && item.stock > 0 ? item.stock : 99;
          item.quantity = Math.min(newQty, maxStock);
        }
        state.error = null;
        saveCartToStorage(state.items);
      }
    },

    removeFromCart: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter(
        (item) => String(item.id) !== String(action.payload)
      );
      state.error = null;
      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.error = null;
      saveCartToStorage([]);
    },

    clearCartError: (state) => {
      state.error = null;
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  clearCartError,
} = cartSlice.actions;

export default cartSlice.reducer;
