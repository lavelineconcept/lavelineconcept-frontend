import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    selectCartItems,
    selectCartTotalPrice,
    selectIsLoading,
    selectIsGiftWrap
} from "../../redux/cart/selectors";
import {
    updateCartItem,
    removeCartItem,
    updateGiftWrap
} from "../../redux/cart/operations";
import {
    updateCartItemLocal,
    removeFromCartLocal,
    updateGiftWrapLocal
} from "../../redux/cart/slice";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import css from "./CartPage.module.css";
import { toast } from "react-hot-toast";

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(selectCartItems);
    const totalPrice = useSelector(selectCartTotalPrice);
    const isLoading = useSelector(selectIsLoading);
    const isGiftWrap = useSelector(selectIsGiftWrap);
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const handleQuantityChange = (itemId, newQuantity, stock) => {
        if (newQuantity < 1) return;
        if (newQuantity > stock) {
            toast.error(`Üzgünüz, sadece ${stock} adet stokta mevcut.`);
            return;
        }

        if (isLoggedIn) {
            dispatch(updateCartItem({ itemId, quantity: newQuantity }));
        } else {
            dispatch(updateCartItemLocal({ itemId, quantity: newQuantity }));
        }
    };

    const handleRemoveItem = (itemId) => {
        if (isLoggedIn) {
            dispatch(removeCartItem(itemId));
        } else {
            dispatch(removeFromCartLocal(itemId));
        }
        toast.success("Ürün sepetten çıkarıldı.");
    };

    const handleGiftWrapToggle = () => {
        if (isLoggedIn) {
            dispatch(updateGiftWrap(!isGiftWrap));
        } else {
            dispatch(updateGiftWrapLocal(!isGiftWrap));
        }
    };

    const handleCheckout = () => {
        if (items.length === 0) {
            toast.error("Sepetiniz boş.");
            return;
        }
        navigate("/checkout");
    };

    if (isLoading && items.length === 0) {
        return <div className={css.loading}>Yükleniyor...</div>;
    }

    if (items.length === 0) {
        return (
            <div className={css.emptyCart}>
                <h2>Sepetiniz Boş</h2>
                <p>Henüz sepetinize bir ürün eklemediniz.</p>
                <Link to="/products" className={css.shopBtn}>Alışverişe Başla</Link>
            </div>
        );
    }

    return (
        <div className={css.container}>
            <div className={css.header}>
                <h1>Alışveriş Sepeti</h1>
                <p>{items.length} Ürün</p>
            </div>

            <div className={css.content}>
                <div className={css.itemsList}>
                    {items.map((item) => {
                        const product = item.productId;
                        if (!product) return null;

                        return (
                            <div key={item._id} className={css.cartItem}>
                                <div className={css.productInfo}>
                                    <div className={css.imageWrapper}>
                                        <img
                                            src={product.images?.[0] || "/assets/laveline-yazılı-logo-nobackground.png"}
                                            alt={product.title}
                                        />
                                    </div>
                                    <div className={css.details}>
                                        <h3>{product.title}</h3>
                                        <p className={css.brand}>{product.brand || "La Véline Concept"}</p>
                                        <div className={css.attributes}>
                                            {item.selectedAttributes && Object.entries(item.selectedAttributes).map(([key, value]) => (
                                                <span key={key} className={css.attrTag}>{key}: {value}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className={css.controls}>
                                    <div className={css.quantity}>
                                        <button onClick={() => handleQuantityChange(item._id, item.quantity - 1, product.stock)}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item._id, item.quantity + 1, product.stock)}>+</button>
                                    </div>
                                    <div className={css.priceInfo}>
                                        <p className={css.itemPrice}>{product.price} TL</p>
                                        <p className={css.itemTotal}>{(product.price * item.quantity).toFixed(2)} TL</p>
                                    </div>
                                    <button
                                        className={css.removeBtn}
                                        onClick={() => handleRemoveItem(item._id)}
                                        title="Ürünü Kaldır"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={css.summary}>
                    <h2>Sipariş Özeti</h2>

                    <div className={css.giftWrap}>
                        <label className={css.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={isGiftWrap}
                                onChange={handleGiftWrapToggle}
                            />
                            <span className={css.checkboxText}>Hediye Paketi İstiyorum</span>
                        </label>
                        <p className={css.giftDesc}>Özel kutu ve not ile birlikte gönderilir.</p>
                    </div>

                    <div className={css.summaryLines}>
                        <div className={css.line}>
                            <span>Ara Toplam</span>
                            <span>{totalPrice.toFixed(2)} TL</span>
                        </div>
                        <div className={css.line}>
                            <span>Kargo</span>
                            <span>{totalPrice > 1500 ? "Ücretsiz" : "135.00 TL"}</span>
                        </div>
                        {isGiftWrap && (
                            <div className={css.line}>
                                <span>Hediye Paketi</span>
                                <span>50.00 TL</span>
                            </div>
                        )}
                        <div className={`${css.line} ${css.totalLine}`}>
                            <span>Toplam</span>
                            <span>{(totalPrice + (totalPrice > 1500 ? 0 : 135) + (isGiftWrap ? 50 : 0)).toFixed(2)} TL</span>
                        </div>
                    </div>

                    <button className={css.checkoutBtn} onClick={handleCheckout}>
                        ÖDEMEYE GEÇ
                    </button>

                    <p className={css.checkoutNotice}>
                        1500 TL ve üzeri alışverişlerde kargo ücretsiz!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
