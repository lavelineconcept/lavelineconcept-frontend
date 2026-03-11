import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/categories/operations";
import { selectCategories } from "../../redux/categories/selectors";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import css from "./categories.module.css";

export default function Categories() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (!categories || categories.length === 0) return null;

  return (
    <section className={css.categoriesSection}>
      <div className={css.container}>
        <h2 className={css.title}>Kategoriler</h2>
        
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: "auto",
              centeredSlides: false,
            }
          }}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          className={css.mySwiper}
          watchSlidesProgress={true}
        >
          {categories.map((category) => (
            <SwiperSlide key={category._id} className={css.slide}>
              <div className={css.card}>
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

