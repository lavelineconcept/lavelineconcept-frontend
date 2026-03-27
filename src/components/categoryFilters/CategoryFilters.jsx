import { useSelector } from "react-redux";
import { selectCategories, selectIsLoading } from "../../redux/categories/selectors";
import css from "./CategoryFilters.module.css";

const CategoryFilters = ({ activeCategory, onCategoryChange }) => {
    const categories = useSelector(selectCategories);
    const isLoading = useSelector(selectIsLoading);

    if (isLoading) return <div className={css.loading}>Kategoriler...</div>;

    return (
        <div className={css.container}>
            <h3 className={css.title}>Kategoriler</h3>
            <ul className={css.list}>
                <li className={css.item}>
                    <button
                        className={`${css.btn} ${activeCategory === null ? css.active : ""}`}
                        onClick={() => onCategoryChange(null)}
                    >
                        Tüm Ürünler
                    </button>
                </li>
                {categories.map((category) => (
                    <li key={category._id} className={css.item}>
                        <button
                            className={`${css.btn} ${activeCategory === category._id ? css.active : ""}`}
                            onClick={() => onCategoryChange(category._id)}
                        >
                            {category.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryFilters;
