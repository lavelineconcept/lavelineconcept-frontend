export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsLoading = (state) => state.wishlist.isLoading;
export const selectError = (state) => state.wishlist.error;
export const selectIsInWishlist = (state, productId) => state.wishlist.items.some(item => item._id === productId);
