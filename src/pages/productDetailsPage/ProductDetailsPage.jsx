import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../redux/products/operations";
import { selectCurrentProduct, selectIsLoading } from "../../redux/products/selectors";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import { addToCart } from "../../redux/cart/operations";
import { addToCartLocal } from "../../redux/cart/slice";
import { addToWishlist, removeFromWishlist } from "../../redux/wishlist/operations";
import { selectIsInWishlist } from "../../redux/wishlist/selectors";
import css from "./ProductDetailsPage.module.css";
import { toast } from "react-hot-toast";

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const product = useSelector(selectCurrentProduct);
    const isLoading = useSelector(selectIsLoading);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const isInWishlist = useSelector((state) => selectIsInWishlist(state, productId));

    const [quantity, setQuantity] = useState(1);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        dispatch(getProductById(productId));
    }, [dispatch, productId]);

    useEffect(() => {
        if (product?.images?.length > 0) {
            setActiveImage(0);
        }
        if (product?.attributes) {
            const initial = {};
            // Convert Map/Object to plain object if needed, though Redux should have it as plain object
            Object.entries(product.attributes).forEach(([key, value]) => {
                if (typeof value === 'string' && value.includes(',')) {
                    initial[key] = value.split(',')[0].trim();
                } else {
                    initial[key] = value;
                }
            });
            setSelectedAttributes(initial);
        }
    }, [product]);

    const handleAttributeChange = (key, value) => {
        setSelectedAttributes(prev => ({ ...prev, [key]: value }));
    };

    const handleAddToCart = () => {
        if (isLoggedIn) {
            dispatch(addToCart({ productId: productId, quantity, selectedAttributes }))
                .unwrap()
                .then(() => toast.success("Ürün sepete eklendi"))
                .catch(() => toast.error("Ürün sepete eklenemedi"));
        } else {
            // For local cart, we pass the full product object to render it in the cart page
            dispatch(addToCartLocal({ productId: product, quantity, selectedAttributes }));
            toast.success("Ürün sepete eklendi (Misafir)");
        }
    };

    const toggleWishlist = () => {
        if (isInWishlist) {
            dispatch(removeFromWishlist(productId));
        } else {
            dispatch(addToWishlist(productId));
        }
    };

    if (isLoading || !product) {
        return (
            <div className={css.loadingContainer}>
                <div className={css.loader}></div>
                <p>Ürün detayları yükleniyor...</p>
            </div>
        );
    }

    const { title, description, price, brand, images, stock, attributes } = product;
    const placeholderImage = "/assets/laveline-yazılı-logo-nobackground.png";

    return (
        <div className={css.container}>
            <div className={css.content}>
                <div className={css.gallery}>
                    <div className={css.mainImageWrapper}>
                        <img
                            src={images?.[activeImage] || placeholderImage}
                            alt={title}
                            className={css.mainImage}
                        />
                    </div>
                    <div className={css.thumbnails}>
                        {images?.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`${title} ${idx}`}
                                className={`${css.thumb} ${activeImage === idx ? css.activeThumb : ""}`}
                                onClick={() => setActiveImage(idx)}
                            />
                        ))}
                    </div>
                </div>

                <div className={css.info}>
                    <div className={css.headerInfo}>
                        <p className={css.brand}>{brand || "La Véline Concept"}</p>
                        <h1 className={css.title}>{title}</h1>
                        <p className={css.price}>{price} TL</p>
                    </div>

                    <div className={css.status}>
                        {stock > 0 ? (
                            <span className={css.inStock}>Stokta ({stock} adet)</span>
                        ) : (
                            <span className={css.outOfStock}>Tükendi</span>
                        )}
                    </div>

                    <div className={css.description}>
                        <h3>Ürün Açıklaması</h3>
                        <p>{description}</p>
                    </div>

                    {attributes && Object.entries(attributes).length > 0 && (
                        <div className={css.attributesSection}>
                            {Object.entries(attributes).map(([key, value]) => {
                                const options = typeof value === 'string' && value.includes(',')
                                    ? value.split(',').map(v => v.trim())
                                    : [value];

                                return (
                                    <div key={key} className={css.attrGroup}>
                                        <label>{key}</label>
                                        <div className={css.options}>
                                            {options.map(option => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    className={`${css.optionBtn} ${selectedAttributes[key] === option ? css.activeOption : ""}`}
                                                    onClick={() => handleAttributeChange(key, option)}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className={css.actions}>
                        <div className={css.quantitySelector}>
                            <button
                                type="button"
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className={css.qtyBtn}
                            >−</button>
                            <span className={css.qtyValue}>{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity(prev => Math.min(stock, prev + 1))}
                                className={css.qtyBtn}
                            >+</button>
                        </div>

                        <button
                            className={css.addBtn}
                            onClick={handleAddToCart}
                            disabled={stock === 0}
                        >
                            {stock === 0 ? "Tükendi" : "Sepete Ekle"}
                        </button>

                        <button
                            className={`${css.wishBtn} ${isInWishlist ? css.inWishlist : ""}`}
                            onClick={toggleWishlist}
                        >
                            {isInWishlist ? "Favorilerimde" : "Favorilere Ekle"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
