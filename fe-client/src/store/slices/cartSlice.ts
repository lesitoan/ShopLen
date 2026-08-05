import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CartItem,
  CartState,
  AddToCartPayload,
  StoredCartItem,
  CartProductItemResponse,
} from "@/types/cart.type";

const CART_STORAGE_KEY = "shoplen_cart";

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    if (!data) return [];
    const items: StoredCartItem[] = JSON.parse(data);
    if (!Array.isArray(items)) return [];

    return items.map((rawItem: any) => {
      const productId = rawItem.productId || String(rawItem.id).split("-")[0];
      const optionCode =
        rawItem.optionCode || rawItem.colorCode || rawItem.color || "DEFAULT";
      const itemId = rawItem.id || `${productId}-${optionCode}`;
      const quantity =
        typeof rawItem.quantity === "number" && rawItem.quantity > 0
          ? rawItem.quantity
          : 1;

      return {
        id: itemId,
        productId,
        quantity,
        color: rawItem.color || rawItem.colorName || optionCode,
        colorCode: optionCode,
        selectedOptions: rawItem.selectedOptions,
        name: rawItem.name || "",
        category: rawItem.category || "Móc khóa",
        price: typeof rawItem.price === "number" ? rawItem.price : 0,
        originalPrice: rawItem.originalPrice,
        image: rawItem.image || "/logo.png",
        stock: rawItem.stock ?? 99,
        isAvailable: rawItem.isAvailable ?? true,
      };
    });
  } catch (error) {
    console.error("Failed to load cart from localStorage", error);
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  try {
    const minimalItems: StoredCartItem[] = items.map((item) => ({
      id: String(item.id),
      productId: item.productId || String(item.id).split("-")[0],
      quantity: item.quantity,
      optionCode: item.colorCode || item.color || "DEFAULT",
      selectedOptions: item.selectedOptions,
    }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(minimalItems));
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
      const { product, color, colorCode, selectedOptions, quantity } = action.payload;
      const addQty = quantity && quantity > 0 ? quantity : 1;
      const optCode = colorCode || color || "DEFAULT";
      const colorName = color || colorCode || "Mặc định";
      const productId = String(product.id);
      const itemId = `${productId}-${optCode}`;

      const existingIndex = state.items.findIndex(
        (item) =>
          String(item.id) === String(itemId) ||
          ((item.productId === productId || String(item.id).startsWith(productId)) &&
            (item.colorCode === optCode || item.color === colorName))
      );

      if (existingIndex !== -1) {
        const item = state.items[existingIndex];
        const newQty = item.quantity + addQty;
        const maxStock = item.stock && item.stock > 0 ? item.stock : 99;
        item.quantity = Math.min(newQty, maxStock);
        item.productId = productId;
        item.colorCode = optCode;
        item.color = colorName;
        if (selectedOptions) {
          item.selectedOptions = selectedOptions;
        }
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
        productId,
        name: product.name,
        category: categoryVal,
        color: colorName,
        colorCode: optCode,
        selectedOptions,
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

    syncCartWithApiData: (
      state,
      action: PayloadAction<CartProductItemResponse[]>
    ) => {
      const freshProducts = action.payload;
      const productMap = new Map(freshProducts.map((p) => [p.id, p]));

      const updatedItems: CartItem[] = [];

      for (const item of state.items) {
        const productId = item.productId || String(item.id).split("-")[0];
        const freshProd = productMap.get(productId);

        // Remove if product not in API response, or is unavailable, or stock <= 0
        if (!freshProd || !freshProd.isAvailable || freshProd.stockQuantity <= 0) {
          continue;
        }

        // Validate product option code against freshProd.options
        let matchedOptionLabel = item.color;
        const currentCode = (item.colorCode || item.color || "").toLowerCase();

        if (
          currentCode &&
          currentCode !== "default" &&
          currentCode !== "mặc định" &&
          freshProd.options &&
          freshProd.options.length > 0
        ) {
          let foundMatch = false;

          for (const opt of freshProd.options) {
            if (!Array.isArray(opt.values) || opt.values.length === 0) continue;

            for (const val of opt.values) {
              if (typeof val === "string") {
                if (val.toLowerCase() === currentCode) {
                  matchedOptionLabel = val;
                  foundMatch = true;
                  break;
                }
              } else if (typeof val === "object" && val !== null) {
                const vCode = (val.code || val.value || val.label || val.name || "").toLowerCase();
                const vLabel = (val.label || val.value || val.name || val.code || "").toLowerCase();
                if (vCode === currentCode || vLabel === currentCode) {
                  matchedOptionLabel = val.label || val.name || val.value || val.code || item.color;
                  foundMatch = true;
                  break;
                }
              }
            }

            if (foundMatch) break;
          }

          if (!foundMatch) {
            continue;
          }
        }

        const updatedPrice = freshProd.price;
        const updatedOriginalPrice =
          freshProd.salePrice && freshProd.originalPrice
            ? freshProd.originalPrice
            : undefined;
        const updatedQty = Math.min(item.quantity, freshProd.stockQuantity);

        updatedItems.push({
          ...item,
          productId,
          name: freshProd.name || item.name,
          category: freshProd.category?.name || item.category,
          color: matchedOptionLabel || item.color,
          colorCode: item.colorCode || item.color,
          price: updatedPrice,
          originalPrice: updatedOriginalPrice,
          image: freshProd.image || item.image,
          stock: freshProd.stockQuantity,
          isAvailable: true,
          quantity: updatedQty,
        });
      }

      state.items = updatedItems;
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
  syncCartWithApiData,
  clearCart,
  clearCartError,
} = cartSlice.actions;

export default cartSlice.reducer;

