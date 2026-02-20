export const selectCartItems = (state) => state.cart.items;
export const selectIsGiftWrap = (state) => state.cart.isGiftWrap;
export const selectCartTotalCount = (state) => state.cart.items.reduce((acc, item) => acc + item.quantity, 0);
export const selectCartTotalPrice = (state) => state.cart.items.reduce((acc, item) => {
    const price = item.productId?.price || 0;
    return acc + (price * item.quantity);
}, 0);
export const selectIsLoading = (state) => state.cart.isLoading;
export const selectError = (state) => state.cart.error;
