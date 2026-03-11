import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/categories/operations";
import { selectCategories } from "../../redux/categories/selectors";
import css from "./categories.module.css";

export default function Categories() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  // Slots: each item gets a position class
  // "large" | "smallTop" | "smallBottom" | "incoming" | "exiting"
  const [slots, setSlots] = useState({});
  const timeoutRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Initialize slots when categories load
  useEffect(() => {
    if (categories && categories.length >= 3) {
      setSlots({
        [0]: "large",
        [1]: "smallTop",
        [2]: "smallBottom",
      });
    }
  }, [categories]);

  // Auto-play
  useEffect(() => {
    if (!categories || categories.length < 3) return;
    const interval = setInterval(() => {
      if (!isAnimating) handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [categories, activeIndex, isAnimating]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getIdx = useCallback(
    (offset) => {
      if (!categories || categories.length === 0) return 0;
      return (activeIndex + offset + categories.length) % categories.length;
    },
    [activeIndex, categories]
  );

  const handleNext = useCallback(() => {
    if (isAnimating || !categories || categories.length < 3) return;
    setIsAnimating(true);

    const cur0 = getIdx(0); // currently large
    const cur1 = getIdx(1); // currently smallTop
    const cur2 = getIdx(2); // currently smallBottom
    const cur3 = getIdx(3); // incoming from below

    // Phase 1: Place incoming card off-screen first
    setSlots({
      [cur0]: "exiting",      // large -> exits left
      [cur1]: "large",        // smallTop -> grows to large
      [cur2]: "smallTop",     // smallBottom -> slides UP to smallTop
      [cur3]: "incoming",     // new card starts below (hidden)
    });

    // Phase 2: After a frame, slide incoming card up into position
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSlots((prev) => ({ ...prev, [cur3]: "smallBottom" }));
      });
    });

    // Phase 3: After animation, update index and reset
    timeoutRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % categories.length);
      setIsAnimating(false);
    }, 900);
  }, [isAnimating, categories, getIdx]);

  const handlePrev = useCallback(() => {
    if (isAnimating || !categories || categories.length < 3) return;
    setIsAnimating(true);

    const cur0 = getIdx(0);  // currently large
    const cur1 = getIdx(1);  // currently smallTop
    const cur2 = getIdx(2);  // currently smallBottom
    const curPrev = getIdx(-1); // incoming from left

    // Phase 1: Place incoming card off-screen left first
    setSlots({
      [curPrev]: "incomingLeft",  // new card starts off-screen left
      [cur0]: "smallTop",         // large -> shrinks to smallTop
      [cur1]: "smallBottom",      // smallTop -> slides DOWN to smallBottom
      [cur2]: "exitingDown",      // smallBottom -> exits down
    });

    // Phase 2: After a frame, slide incoming card into large position
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSlots((prev) => ({ ...prev, [curPrev]: "large" }));
      });
    });

    // Phase 3: After animation, update index and reset
    timeoutRef.current = setTimeout(() => {
      setActiveIndex(
        (prev) => (prev - 1 + categories.length) % categories.length
      );
      setIsAnimating(false);
    }, 900);
  }, [isAnimating, categories, getIdx]);

  // After index changes, reset slots to default positions
  useEffect(() => {
    if (categories && categories.length >= 3) {
      setSlots({
        [getIdx(0)]: "large",
        [getIdx(1)]: "smallTop",
        [getIdx(2)]: "smallBottom",
      });
    }
  }, [activeIndex]);

  if (!categories || categories.length === 0) return null;

  // Determine which 4 items to render
  const visibleIndices = [getIdx(0), getIdx(1), getIdx(2)];
  // Add the incoming/exiting one if animating
  if (isAnimating) {
    const extra = getIdx(3);
    const prev = getIdx(-1);
    if (!visibleIndices.includes(extra)) visibleIndices.push(extra);
    if (!visibleIndices.includes(prev)) visibleIndices.push(prev);
  }

  const getSlotClass = (idx) => {
    const slot = slots[idx];
    switch (slot) {
      case "large": return css.posLarge;
      case "smallTop": return css.posSmallTop;
      case "smallBottom": return css.posSmallBottom;
      case "exiting": return css.posExiting;
      case "exitingDown": return css.posExitingDown;
      case "incoming": return css.posIncoming;
      case "incomingLeft": return css.posIncomingLeft;
      default: return css.posHidden;
    }
  };

  return (
    <section className={css.categoriesSection}>
      <div className={css.container}>
        <h2 className={css.title}>Kategoriler</h2>

        <div className={css.stage}>
          {visibleIndices.map((idx) => (
            <div
              key={idx}
              className={`${css.card} ${getSlotClass(idx)}`}
            >
              <div className={css.imageWrapper}>
                <img
                  src={categories[idx]?.image}
                  alt={categories[idx]?.name}
                  className={css.image}
                />
                <div className={css.overlay}>
                  <h3 className={css.categoryName}>
                    {categories[idx]?.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className={css.navigation}>
          <button
            className={css.navBtn}
            onClick={handlePrev}
            aria-label="Previous"
          >
            &#10094;
          </button>
          <button
            className={css.navBtn}
            onClick={handleNext}
            aria-label="Next"
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
}
