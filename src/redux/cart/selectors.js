export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalCount = (state) => state.cart.items.reduce((acc, item) => acc + item.quantity, 0);
export const selectIsLoading = (state) => state.cart.isLoading;
export const selectError = (state) => state.cart.error;
