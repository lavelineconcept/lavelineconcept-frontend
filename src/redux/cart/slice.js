import { createSlice } from "@reduxjs/toolkit";

import { fetchCart, addToCart, updateCartItem, removeCartItem, clearCart, updateGiftWrap, mergeLocalCart } from "./operations";

const getLocalCart = () => {
    try {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const getLocalGiftWrap = () => {
    try {
        const saved = localStorage.getItem('isGiftWrap');
        return saved ? JSON.parse(saved) : false;
    } catch {
        return false;
    }
};

const initialState = {
    items: getLocalCart(),
    isGiftWrap: getLocalGiftWrap(),
    isLoading: false,
    error: null,
};

const saveLocalCart = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
};

const saveLocalGiftWrap = (isGiftWrap) => {
    localStorage.setItem('isGiftWrap', JSON.stringify(isGiftWrap));
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCartLocal: (state, action) => {
            const { productId, quantity, selectedAttributes } = action.payload;
            // productId might be an object or string depending on how it's passed.
            // For local cart, we'll store the full product object if possible, or at least enough to render.
            // In ProductCard, we usually pass { productId: _id, quantity: 1 }. 
            // NOTE: We need the full product details for the cart page to render images/titles.
            // So the payload for local add MUST include product details.

            const existingItemIndex = state.items.findIndex(item =>
                (item.productId._id === productId._id || item.productId === productId._id) &&
                JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
            );

            if (existingItemIndex >= 0) {
                state.items[existingItemIndex].quantity += quantity;
            } else {
                // Determine a temporary ID
                const tempId = Date.now().toString();
                state.items.push({
                    _id: tempId,
                    productId: productId, // Expecting full product object here for local cart
                    quantity,
                    selectedAttributes
                });
            }
            saveLocalCart(state.items);
        },
        removeFromCartLocal: (state, action) => {
            const itemId = action.payload;
            state.items = state.items.filter(item => item._id !== itemId);
            saveLocalCart(state.items);
        },
        updateCartItemLocal: (state, action) => {
            const { itemId, quantity } = action.payload;
            const item = state.items.find(item => item._id === itemId);
            if (item) {
                item.quantity = quantity;
                saveLocalCart(state.items);
            }
        },
        updateGiftWrapLocal: (state, action) => {
            state.isGiftWrap = action.payload;
            saveLocalGiftWrap(state.isGiftWrap);
        },
        clearCartLocal: (state) => {
            state.items = [];
            state.isGiftWrap = false;
            localStorage.removeItem('cart');
            localStorage.removeItem('isGiftWrap');
        },
        setCartLocal: (state, action) => { // Useful for syncing or setting explicitly
            state.items = action.payload;
            saveLocalCart(state.items);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.items;
                state.isGiftWrap = action.payload.isGiftWrap;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update Gift Wrap
            .addCase(updateGiftWrap.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.isGiftWrap = action.payload.isGiftWrap;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.items = action.payload.items;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.items = action.payload.items;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
            })
            // Merge Local Cart
            .addCase(mergeLocalCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(mergeLocalCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.items;
                state.isGiftWrap = action.payload.isGiftWrap;
            })
            .addCase(mergeLocalCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    addToCartLocal,
    removeFromCartLocal,
    updateCartItemLocal,
    updateGiftWrapLocal,
    clearCartLocal,
    setCartLocal
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
