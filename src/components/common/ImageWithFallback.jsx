import { useState, useEffect } from "react";
import defaultLogo from "../../assets/laveline-yazılı-logo-nobackground.png";

const ImageWithFallback = ({ src, alt, className, fallbackSrc = defaultLogo, ...props }) => {
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

    useEffect(() => {
        setImgSrc(src || fallbackSrc);
    }, [src, fallbackSrc]);

    const handleError = () => {
        if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
        }
    };

    return (
        <img
            {...props}
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
};

export default ImageWithFallback;
