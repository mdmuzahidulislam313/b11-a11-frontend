import { useEffect, useRef, useState } from 'react';

const OptimizedImage = ({
    src,
    alt,
    className = '',
    placeholder = 'https://i.ibb.co/M6tBqSs/profile.png',
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
        setIsError(false);
    };

    const handleError = () => {
        setIsError(true);
        setIsLoaded(false);
    };

    return (
        <div ref={imgRef} className={`relative overflow-hidden ${className}`} {...props}>

            {(!isInView || !isLoaded) && (
                <div className={`absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center`}>
                    {!isInView && (
                        <div className="text-slate-400 text-sm">Loading...</div>
                    )}
                </div>
            )}


            {isInView && (
                <img
                    src={isError ? placeholder : src}
                    alt={alt}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading="lazy"
                />
            )}
        </div>
    );
};

export default OptimizedImage;
