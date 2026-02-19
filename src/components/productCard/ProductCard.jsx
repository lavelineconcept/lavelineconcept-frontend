import { useNavigate } from "react-router-dom";
import css from "./ProductCard.module.css";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { _id, name, price, images, isNew } = product;

    const handleClick = () => {
        navigate(`/products/${_id}`);
    };

    return (
        <div className={css.card} onClick={handleClick}>
            <div className={css.imageWrapper}>
                {isNew && <span className={css.badge}>YENİ</span>}
                <img
                    src={images?.[0] || "/assets/laveline-yazılı-logo-nobackground.png"}
                    alt={name}
                    className={css.image}
                />
                <div className={css.actionOverlay}>
                    <button className={css.quickView}>İncele</button>
                </div>
            </div>
            <div className={css.info}>
                <h3 className={css.name}>{name}</h3>
                <p className={css.price}>{price} TL</p>
            </div>
        </div>
    );
};

export default ProductCard;
