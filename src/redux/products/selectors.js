import { createSelector } from "@reduxjs/toolkit";

export const selectProducts = (state) => state.products.items;
export const selectCurrentProduct = (state) => state.products.currentProduct;

export const selectProductsState = (state) => state.products;

export const selectProductsPageInfo = createSelector(
    [selectProductsState],
    (products) => ({
        page: products.page,
        perPage: products.perPage,
        totalItems: products.totalItems,
        totalPages: products.totalPages,
        hasPreviousPage: products.hasPreviousPage,
        hasNextPage: products.hasNextPage,
    })
);

export const selectIsLoading = (state) => state.products.isLoading;
export const selectError = (state) => state.products.error;
