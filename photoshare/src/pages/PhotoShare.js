import React, { useEffect } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { ShareSocial } from 'react-share-social'
import './../css/ImageGalleryComponent.css';

import { useState } from "react";
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ArrowBarDown, ArrowDown } from 'react-bootstrap-icons';
import { useParams, useLocation } from "react-router-dom";

import { FacebookShareButton, FacebookIcon } from 'react-share';
import { saveAs } from 'file-saver';

const BACKEND_URL = 'http://localhost:8000';

const PhotoShare = () => {

    const { search } = useLocation();
    const [currentIndex, setCurrentIndex] = useState(0);

    const parameters = new URLSearchParams(search);

    const code = parameters.get('code');

    const [images, setImages] = useState([]);

    const downloadImage = (url) => {
        saveAs(url, 'image.jpg');
    };

    const handleSlide = (index) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        const fetchImages = async () => {
            const response = await fetch(`${BACKEND_URL}/frames/api/copy-image-qr-download?code=${code}`);
            const data = await response.json();
            const image_list = data['images_list'];
            const updatedImages = image_list.map(image => ({
                original: `${BACKEND_URL}/${image.trim()}`,
                thumbnail: `${BACKEND_URL}/${image.trim()}`,
            }));
            setImages(updatedImages);
        }

        fetchImages();
    }, []);

    return (
        <>
            <div className="image-actions">
                <h1>PhotoMong Share</h1>
                <div className="buttons">
                    <ArrowBarDown size={32} onClick={() => downloadImage(images[currentIndex].original)} />
                    <FacebookShareButton url={`${BACKEND_URL}/frames/api/copy-image-qr-download?code=${code}`}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton> Facebook Share
                </div>
            </div>
            <div>
                <ImageGallery items={images} onSlide={handleSlide} />
            </div>
        </>
    );
};

export default PhotoShare;

