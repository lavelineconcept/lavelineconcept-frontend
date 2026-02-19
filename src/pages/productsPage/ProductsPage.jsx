import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/products/operations";
import { fetchCategories } from "../../redux/categories/operations";
import { selectProducts, selectIsLoading as selectProductsLoading, selectProductsPageInfo } from "../../redux/products/selectors";
import ProductCard from "../../components/productCard/ProductCard";
import CategoryFilters from "../../components/categoryFilters/CategoryFilters";
import css from "./ProductsPage.module.css";

const ProductsPage = () => {
    const dispatch = useDispatch();
    const products = useSelector(selectProducts);
    const pageInfo = useSelector(selectProductsPageInfo);
    const isLoading = useSelector(selectProductsLoading);

    const [activeCategory, setActiveCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        const params = {
            page,
            category: activeCategory || undefined,
            search: searchTerm || undefined,
            perPage: 12
        };
        dispatch(fetchProducts(params));
    }, [dispatch, activeCategory, page, searchTerm]);

    const handleCategoryChange = (catId) => {
        setActiveCategory(catId);
        setPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    return (
        <div className={css.container}>
            <header className={css.header}>
                <h1 className={css.title}>Koleksiyonumuz</h1>
                <div className={css.searchContainer}>
                    <input
                        type="text"
                        placeholder="Aradığınız ürünü yazın..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={css.searchInput}
                    />
                </div>
            </header>

            <div className={css.layout}>
                <aside className={css.sidebar}>
                    <CategoryFilters
                        activeCategory={activeCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                </aside>

                <main className={css.main}>
                    {isLoading ? (
                        <div className={css.loadingContainer}>
                            <div className={css.loader}></div>
                            <p>Ürünler yükleniyor...</p>
                        </div>
                    ) : (
                        <>
                            <div className={css.grid}>
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {products.length === 0 && (
                                <div className={css.empty}>
                                    <p>Aradığınız kriterlere uygun ürün bulunamadı.</p>
                                </div>
                            )}

                            {pageInfo.totalPages > 1 && (
                                <div className={css.pagination}>
                                    <button
                                        disabled={!pageInfo.hasPreviousPage}
                                        onClick={() => setPage(prev => prev - 1)}
                                        className={css.pageBtn}
                                    >Önceki</button>

                                    <span className={css.pageIndicator}>
                                        {pageInfo.page} / {pageInfo.totalPages}
                                    </span>

                                    <button
                                        disabled={!pageInfo.hasNextPage}
                                        onClick={() => setPage(prev => prev + 1)}
                                        className={css.pageBtn}
                                    >Sonraki</button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductsPage;
