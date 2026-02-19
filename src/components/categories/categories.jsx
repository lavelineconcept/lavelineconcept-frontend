import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/categories/operations";
import { selectCategories } from "../../redux/categories/selectors";
import css from "./categories.module.css";

export default function Categories() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <section className={css.categoriesSection}>
      <div className={css.container}>
        <h2 className={css.title}>Kategoriler</h2>
        <div className={css.grid}>
          {categories.map((category) => (
            <div key={category._id} className={css.card}>
              <div className={css.imageWrapper}>
                <img
                  src={category.image}
                  alt={category.name}
                  className={css.image}
                />
                <div className={css.overlay}>
                  <h3 className={css.categoryName}>{category.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

