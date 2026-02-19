import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/products/operations";
import { selectProducts } from "../../redux/products/selectors";
import ProductCard from "../productCard/ProductCard";
import css from "./lastAdded.module.css";

export default function LastAdded() {
    const dispatch = useDispatch();
    const products = useSelector(selectProducts) || [];

    useEffect(() => {
        // Fetch products with a limit of 8, sorted by newest
        dispatch(fetchProducts({ perPage: 8, sortBy: "createdAt", order: "desc" }));
    }, [dispatch]);

    // Safety slice in case backend returns more or doesn't handle limit/sort exactly as requested
    const lastEightProducts = Array.isArray(products) ? products.slice(0, 8) : [];

    return (
        <section className={css.lastAddedSection}>
            <div className={css.container}>
                <h2 className={css.title}>Son Eklenenler</h2>
                <div className={css.grid}>
                    {lastEightProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
