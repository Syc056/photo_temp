
import React, { useState, useRef, useEffect } from 'react';
import './FrameCarousel.css';

const LayoutCarousel = ({ images, handleClick, clickedTitles, width=0 }) => {
    const carouselRef = useRef(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [mouseDownTime, setMouseDownTime] = useState(0);
    const threshold = 500; 
    const storedSelectedFrame = JSON.parse(sessionStorage.getItem('selectedFrame')) || { frame: 'Strip' };    

    useEffect(() => {
        const carousel = carouselRef.current;

        const handleMouseDown = (e) => {
            setIsDown(true);
            setMouseDownTime(Date.now());
            if (carousel) {
                setStartX(e.pageX - carousel.offsetLeft);
                setScrollLeft(carousel.scrollLeft);
            }
        };

        const handleMouseLeave = () => {
            if (isDown) {
                setIsDown(false);
            }
        };

        const handleMouseUp = (e) => {
            const pressDuration = Date.now() - mouseDownTime;
            if (pressDuration < threshold) {
                setIsDown(false);
            }
        };

        const handleMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const pressDuration = Date.now() - mouseDownTime;
            if (pressDuration >= threshold) {
                setIsDown(false);
                return;
            }
            if (carousel) {
                const x = e.pageX - carousel.offsetLeft;
                const walk = (x - startX) * 3; // Scroll speed
                carousel.scrollLeft = scrollLeft - walk;
            }
        };

        if (carousel) {
            carousel.addEventListener('mousedown', handleMouseDown);
            carousel.addEventListener('mouseleave', handleMouseLeave);
            carousel.addEventListener('mouseup', handleMouseUp);
            carousel.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (carousel) {
                carousel.removeEventListener('mousedown', handleMouseDown);
                carousel.removeEventListener('mouseleave', handleMouseLeave);
                carousel.removeEventListener('mouseup', handleMouseUp);
                carousel.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [isDown, startX, scrollLeft, mouseDownTime]);

    let style = {};
    style.height = storedSelectedFrame.frame === "4-cutx2" ? "210px" : "auto";
    if (width !== 0) {
        style.height = "auto";
        style.width = 'calc(100% / 3 - 30px)';
    }   

    return (
        <div
            draggable={false}
            className='frame-carousel-container'
            ref={carouselRef}
        >
            <div
                draggable={false}
                className='frame-carousel-imgs'
            >
                {images.map((img, index) => (
                    <img
                        style={style}
                        className={`layout-carousel-img ${clickedTitles.includes(img.title) ? "clicked" : ""}`}
                        onClick={() => handleClick(index, img.title)}
                        key={index}
                        src={img.photo_full}
                        alt={`Image ${index + 1}`}                        
                    />
                ))}
            </div>
        </div>
    );
};

export default LayoutCarousel;
