import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import "../../css/Photo.css";
import countdownImg from '../../assets/Photo/Snap/countdown.png';
import photocountImg from '../../assets/Photo/Snap/photocount.png';
import previewImg from '../../assets/Photo/Snap/previewField.png';
import axios from 'axios';
import background_en from '../../assets/Photo/Snap/BG.png';
import background_kr from '../../assets/Photo/Snap/kr/BG.png';
import background_vn from '../../assets/Photo/Snap/vn/BG.png';
import background_mn from '../../assets/Photo/Snap/mn/BG.png';
import load_en from '../../assets/Photo/Load/BG.png';
import load_kr from '../../assets/Photo/Load/kr/BG.png';
import load_vn from '../../assets/Photo/Load/vn/BG.png';
import load_mn from '../../assets/Photo/Load/mn/BG.png';
import ok_button from '../../assets/Photo/Snap/OK.png';
import take_again_button from '../../assets/Photo/Snap/TakeAgain.png';
import offline_wc from '../../assets/Photo/OFFLINE.jpg';
import { getAudio, getClickAudio, getPhotos, sendCaptureReq, startLiveView, videoFeedUrl } from '../../api/config';
import Uid from "react-uuid"

function PhotoPreview() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(8);
    const [photoCount, setPhotoCount] = useState(0);
    const [flash, setFlash] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState(background_en);
    const [loadBgImage, setLoadBgImage] = useState(load_en);
    const [capturing, setCapturing] = useState(false);
    const [capturePhotos, setCapturePhotos] = useState([]);

    const [showFirstSet, setShowFirstSet] = useState(true);    
    const [selectedFrame, setSelectedFrame] = useState(null);
    const [myBackground, setMyBackground] = useState(null);
    const [selectedLayout, setSelectedLayout] = useState(null);
    const [totalSnapshotPhoto, setTotalSnapshotPhoto] = useState(0);       
    const [selectedPhotos, setSelectedPhotos] = useState([]); 

    const uuid = sessionStorage.getItem("uuid")

    const timerRef = useRef(null);

    useEffect(() => {        
        const storedSelectedFrame = JSON.parse(sessionStorage.getItem('selectedFrame'));
        if (storedSelectedFrame) {            
            setSelectedFrame(storedSelectedFrame.frame);            
        }
        
        if (storedSelectedFrame.frame === 'Stripx2') {
            setTotalSnapshotPhoto(4);
        } else if (storedSelectedFrame.frame === '2cut-x2') {
            setTotalSnapshotPhoto(2);
        } else if (storedSelectedFrame.frame === '4-cutx2') {
            setTotalSnapshotPhoto(4);
        } else if (storedSelectedFrame.frame === '6-cutx2') {
            setTotalSnapshotPhoto(6);
        } else if (storedSelectedFrame.frame === '4.2-cutx2') {
            setTotalSnapshotPhoto(4);
        }

        const sessionSelectedLayout = sessionStorage.getItem('selectedLayout');
        const parsedSelectedLayout = JSON.parse(sessionSelectedLayout);
        const layoutData = parsedSelectedLayout[0];
        if (layoutData) {
            setSelectedLayout(layoutData.photo_cover);
        }
    }, []);

    useEffect(() => {
        const sessionSelectedLayout = sessionStorage.getItem('selectedLayout');
        const parsedSelectedLayout = JSON.parse(sessionSelectedLayout);
        const layoutData = parsedSelectedLayout[0];
        if (layoutData) {
            setMyBackground(layoutData.photo);
        }        
    }, []);

    useEffect(() => {
        asyncGetPhotos();
    }, [uuid]);

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    const chunkArray = (arr, size) => {
        return arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);
    };

    const asyncGetPhotos = async () => {      
        if (uuid === null) {
            return;
        }          
        const photos = await getPhotos(uuid);        

        if (photos && photos.images) {
            const formattedImages = photos.images.map(img => {
                const imageName = img.url.split('/').pop();
                return {
                    ...img,
                    url: `${process.env.REACT_APP_BACKEND}/serve_photo/${uuid}/${imageName}`
                };
            });

            const finalFormattedImages = formattedImages.map(img => ({
                ...img,
                url: img.url.replace(/\\/g, '/').replace('serve_photo', 'get_photo/uploads')
            }));            

            setCapturePhotos(finalFormattedImages);

            sessionStorage.setItem('photos', JSON.stringify({
                status: photos.status,
                images: finalFormattedImages
            }));

            // loop photos.images and setSelectedPhotos with array photo id
            setSelectedPhotos(finalFormattedImages.map(photo => photo.id));
        } else {
            console.log("No photos available."); 
        }
    };

    const displayClassNameForPhoto = (rowIndex, photoIndex, selectedIndex) => {        
        let className = 'choose-photo-item';

        if (selectedFrame === 'Stripx2') {
            if (rowIndex === 0 && photoIndex === 0) {
                className = 'choose-photo-item-0-0-right';
            } else if (rowIndex === 0 && photoIndex === 1) {
                className = 'choose-photo-item-0-1-right';
            } else if (rowIndex === 1 && photoIndex === 0) {
                className = 'choose-photo-item-1-0-right';
            } else if (rowIndex === 1 && photoIndex === 1) {
                className = 'choose-photo-item-1-1-right';
            } else if (rowIndex === 2 && photoIndex === 0) {
                className = 'choose-photo-item-2-0-right';
            } else if (rowIndex === 2 && photoIndex === 1) {
                className = 'choose-photo-item-2-1-right';
            } else if (rowIndex === 3 && photoIndex === 0) {
                className = 'choose-photo-item-3-0-right';
            } else if (rowIndex === 3 && photoIndex === 1) {
                className = 'choose-photo-item-3-1-right';
            }
        } else if (selectedFrame === '6-cutx2') {
            if (rowIndex === 0 && photoIndex === 0) {
                className = 'choose-photo-item6-0-0';
            } else if (rowIndex === 0 && photoIndex === 1) {
                className = 'choose-photo-item6-0-1';
            } else if (rowIndex === 1 && photoIndex === 0) {
                className = 'choose-photo-item6-1-0';
            } else if (rowIndex === 1 && photoIndex === 1) {
                className = 'choose-photo-item6-1-1';
            } else if (rowIndex === 2 && photoIndex === 0) {
                className = 'choose-photo-item6-2-0';
            } else if (rowIndex === 2 && photoIndex === 1) {
                className = 'choose-photo-item6-2-1';
            }
        } else if (selectedFrame === '2cut-x2') {
            if (rowIndex === 0 && photoIndex === 0) {
                className = 'choose-photo-item-2cut-0-0-right';
            } else if (rowIndex === 0 && photoIndex === 1) {
                className = 'choose-photo-item-2cut-0-1-right';
            }
        } else if (selectedFrame === '3-cutx2') {
            if (rowIndex === 0 && photoIndex === 0) {
                className = 'choose-photo-item-3cut-0-0';
            } else if (rowIndex === 0 && photoIndex === 1) {
                className = 'choose-photo-item-3cut-0-1';
            } else if (rowIndex === 1 && photoIndex === 0) {
                className = 'choose-photo-item-3cut-0-1';
            }
        } else if (selectedFrame === '4-cutx2') {
            if (rowIndex === 0 && photoIndex === 0) {
                className = 'choose-photo-item-4cut-0-0-right';
            } else if (rowIndex === 0 && photoIndex === 1) {
                className = 'choose-photo-item-4cut-0-1-right';
            } else if (rowIndex === 1 && photoIndex === 0) {
                className = 'choose-photo-item-4cut-1-0-right';
            } else if (rowIndex === 1 && photoIndex === 1) {
                className = 'choose-photo-item-4cut-1-1-right';
            }
        } else if (selectedFrame === '5-cutx2') {
            if (rowIndex === 0 && photoIndex === 0) {
                className = 'choose-photo-item-5cut-0-0';
            } else if (rowIndex === 0 && photoIndex === 1) {
                className = 'choose-photo-item-5cut-0-1';
            } else if (rowIndex === 1 && photoIndex === 0) {
                className = 'choose-photo-item-5cut-1-0';
            } else if (rowIndex === 1 && photoIndex === 1) {
                className = 'choose-photo-item-5cut-1-1';
            }
        }        
        return className;
    };

    const takeSnapshot = async () => {
        // setFlash(true);        
        await sleep(100);
        setCapturing(true);
        try {
            await sendCaptureReq(uuid);
            setPhotoCount((prevCount) => prevCount + 1);
        } catch (error) {                        
            console.error('Failed to capture image:', error);
        }
        // setFlash(false);
        setCapturing(false);
    };    

    const getLatestPhoto = async (currentPhotoCount) => {
        const photos = await getPhotos(selectedFrame);
        sessionStorage.setItem("getphotos", photos);
        if (photos && photos.images && photos.images.length > 0) {
            const latestImage = photos.images[photos.images.length - 1];                        
            const imageName = latestImage.url.split('/').pop();
            const formattedImage = {
                ...latestImage,
                url: `${process.env.REACT_APP_BACKEND}/serve_photo/${uuid}/${imageName}`
            };                        
            if (photos.videos != undefined) {
                if (photos.videos.length != 0) {
                    const videoUrl = photos.videos[0].url.replace("get_photo", "download_photo")
                    // console.log('videoUrl>>>', videoUrl)
                    sessionStorage.setItem("videoUrl", videoUrl)
                }
            }

            setCapturePhotos((prevPhotos) => {
                const newPhotos = [...prevPhotos];
                newPhotos[currentPhotoCount] = {
                    id: formattedImage.id,
                    url: formattedImage.url.replace(/\\/g, '/').replace('serve_photo', `get_photo/uploads`)
                };
                return newPhotos;
            });            
        } else {
            navigate(-1);
            console.log("No photos available.");
        }
    };

    const showSelectedPhotos = () => {    
        if (selectedFrame === '3-cutx2' && capturePhotos.length > 0) {
            const firstPhotoTpl = (
                <div className="choose-photo-row">
                    <div
                        className="choose-photo-item-3cut-top-line"
                        style={{ backgroundImage: `url(${capturePhotos[0].url})`,  transform:"scaleX(-1)" }}                        
                    />
                </div>
            );
            const selectedPhotoRows = chunkArray(capturePhotos.slice(1), 2);
            return [
                firstPhotoTpl,
                ...selectedPhotoRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="choose-photo-row">
                        {row.map((selectedIndex, photoIndex) => (
                            <div
                                key={photoIndex}
                                className={displayClassNameForPhoto(rowIndex, photoIndex, selectedIndex)}
                                style={{ backgroundImage: `url(${capturePhotos[selectedIndex].url})`,  transform:"scaleX(-1)" }}                                
                            />
                        ))}
                    </div>
                )),
            ];
        } else if (selectedFrame === '5-cutx2' && capturePhotos.length > 0) {
            if (capturePhotos.length === 5) {
                const lastPhotoTpl = (
                    <div className="choose-photo-row">
                        <div
                            className="choose-photo-item-5cut-last-line"
                            style={{ backgroundImage: `url(${capturePhotos[capturePhotos.length - 1].url})`, transform:"scaleX(-1)" }}                            
                        />
                    </div>
                );
                const selectedPhotoRows = chunkArray(capturePhotos.slice(0, capturePhotos.length - 1), 2);
                return [
                    selectedPhotoRows.map((row, rowIndex) => (
                        <div key={rowIndex} className="choose-photo-row">
                            {row.map((selectedIndex, photoIndex) => (
                                <div
                                    key={photoIndex}
                                    className={displayClassNameForPhoto(rowIndex, photoIndex, selectedIndex)}
                                    style={{ backgroundImage: `url(${capturePhotos[selectedIndex].url})`, transform:"scaleX(-1)" }}                                    
                                />
                            ))}
                        </div>
                    )),
                    lastPhotoTpl,
                ];
            } else {
                const selectedPhotoRows = chunkArray(capturePhotos, 2);
                return [
                    selectedPhotoRows.map((row, rowIndex) => (
                        <div key={rowIndex} className="choose-photo-row">
                            {row.map((selectedIndex, photoIndex) => (
                                <div
                                    key={photoIndex}
                                    className={displayClassNameForPhoto(rowIndex, photoIndex, selectedIndex)}
                                    style={{ backgroundImage: `url(${capturePhotos[selectedIndex].url})`, transform:"scaleX(-1)" }}                                    
                                />
                            ))}
                        </div>
                    )),
                ];
            }
        } else {
            const selectedPhotoRows = chunkArray(capturePhotos, 2);            
            return selectedPhotoRows.map((row, rowIndex) => (
                <div key={rowIndex} className="choose-photo-row">
                    {row.map((selectedIndex, photoIndex) => (
                        <div
                            key={photoIndex}
                            className={displayClassNameForPhoto(rowIndex, photoIndex, selectedIndex)}
                            style={{
                                backgroundImage: `url(${capturePhotos[photoIndex].url})`, transform:"scaleX(-1)"                                
                            }}                            
                        />
                    ))}
                </div>
            ));
        }
    };

    const playCntSound = async () => {
        await getAudio({ file_name: "count.wav" });
    };

    useEffect(() => {
        if (uuid) {
            if (photoCount > 0) {
                playTakePhotoAudio();
                getLatestPhoto(photoCount - 1);
            }
            if (photoCount > 4) {
                setShowFirstSet(false);
            }
        }
    }, [photoCount, uuid]);

    useEffect(() => {        
        if (capturePhotos.length > 0 && capturePhotos.length === totalSnapshotPhoto) {
            sessionStorage.setItem("uuid", uuid);
            // navigate('/photo-choose');
            // Stop recording    
            console.log("capturePhotos", capturePhotos);                               
        }
    }, [capturePhotos, navigate]);

    useEffect(() => {
        const language = sessionStorage.getItem('language');
        if (language === 'en') {
            setBackgroundImage(background_en);
            setLoadBgImage(load_en);
        } else if (language === 'ko') {
            setBackgroundImage(background_kr);
            setLoadBgImage(load_kr);
        } else if (language === 'vi') {
            setBackgroundImage(background_vn);
            setLoadBgImage(load_vn);
        } else if (language === 'mn') {
            setBackgroundImage(background_mn);
            setLoadBgImage(load_mn);
        }
    }, []);

    const togglePreviewSet = () => {
        setShowFirstSet((prevShowFirstSet) => !prevShowFirstSet);
    };    

    const displayClassNameForBackground = () => {
        if (selectedFrame === '2cut-x2') {
            return 'right-choose-photos-2cut';
        } else if (selectedFrame === '4-cutx2') {
            return 'right-choose-photos-4cut';
        } else if (selectedFrame === '5-cutx2') {
            return 'left-choose-photos-5cut';
        } else {
            return 'right-choose-photos';
        }
    };

    const displayClassNameForLayout = () => {
        if (selectedFrame === '2cut-x2') {
            return 'right-choose-container-2cut';
        } else if (selectedFrame === '4-cutx2') {
            return 'right-choose-container-4cut';
        } else if (selectedFrame === '5-cutx2') {
            return 'left-choose-container-5cut';
        } else {
            return 'right-choose-container-photo';
        }
    };

    useEffect(() => {
        if (uuid) {
            const initializeLiveView = async () => {
                await startLiveView();
            };
            initializeLiveView();                        
        }
        return () => {
            clearInterval(timerRef.current);
        };
    }, [uuid]);

    const playTakePhotoAudio = async () => {
        await getAudio({ file_name: "take_photo.wav" });
    };

    const playAudio = async () => {
        await getAudio({ file_name: "look_up_smile.wav" });
    };    

    useEffect(() => {
        playAudio();
    }, []);

    const getLiveStyle = () => {
        const frame = JSON.parse(sessionStorage.getItem('selectedFrame')).frame;


        if (frame === "6-cutx2") {
            const baseStyle = {
                objectFit: "cover",
                position: "absolute",
                transform: "scaleX(-1)",
                top: "15%", // Adjust this value to move the element down
            };
            return { ...baseStyle, width: "714px", height: "700px", left: "12%" };
        } else if (frame === "Stripx2") {
            const baseStyle = {
                objectFit: "cover",
                position: "absolute",
                transform: "scaleX(-1)",
                top: "20%", // Adjust this value to move the element down
            };
            return { ...baseStyle, width: "882px", height: "600px", left: "2%" };
        } else if (frame === "2cut-x2") {
            const baseStyle = {
                objectFit: "cover",
                position: "absolute",
                transform: "scaleX(-1)",
                top: "15%", // Adjust this value to move the element down
            };
            return { ...baseStyle, width: "600px", height: "678px", left: "18%" };
        } else if (frame === "4-cutx2") {
            const baseStyle = {
                objectFit: "cover",
                position: "absolute",
                transform: "scaleX(-1)",
                top: "20%", // Adjust this value to move the element down
            };
            return { ...baseStyle, width: "798px", height: "600px", left: "6%" };
        } else {
            return {};
        }
    };

    useEffect(() => {
        if (countdown === 7) {
            playCntSound();
        }
    }, [countdown]);

    const goToFilter = async () => {
        getClickAudio()        
        const result = await copyImageApi();
        sessionStorage.setItem('choosePhotos', JSON.stringify(selectedPhotos));
        console.log(selectedPhotos);
        navigate("/filter");
    };

    const goToPhotoAgain = () => {
        getClickAudio()        
        navigate("/photo");
    };

    const copyImageApi = async () => {
        const sessionSelectedLayout = sessionStorage.getItem('selectedLayout');
        if (!sessionSelectedLayout) {
            return;
        }

        const parsedSelectedLayout = JSON.parse(sessionSelectedLayout);
        const layoutData = parsedSelectedLayout[0];

        const copyImageUrl = `${process.env.REACT_APP_BACKEND}/frames/api/copy-image`;
        const copyImageData = {
            photo_url: layoutData.photo,
            photo_cover: layoutData.photo_cover
        };

        try {
            const response = await fetch(copyImageUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(copyImageData)
            });
            const data = await response.json();
            sessionStorage.setItem('copiedPhoto', data.photo_path);
            sessionStorage.setItem('copiedPhotoCover', data.photo_cover_path);
            return true;
        } catch (error) {
            console.error(`Failed to copy image: ${error}`);
            return false;
        }
    };

    return (
        flash ? (
            <div className={`photo-container`} style={{ backgroundImage: `url(${loadBgImage})` }} />
        ) : (
            <div className={`photo-container`} style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className="left-photo-div" style={{ backgroundImage: `url(${countdownImg})` }}>
                    <div className="photo-countdown">{countdown}</div>
                </div>
                <div className="right-photo-div" style={{ backgroundImage: `url(${photocountImg})` }}>
                    <div className="photo-count">{totalSnapshotPhoto}/{totalSnapshotPhoto}</div>
                </div>
                <div className="right-big-frame-11">
                    <div className={displayClassNameForBackground()} style={{ backgroundImage: `url(${myBackground})` }}>
                        {capturePhotos && showSelectedPhotos()}
                    </div>
                    <div className={displayClassNameForLayout()} style={{ backgroundImage: `url(${selectedLayout})` }}></div>                           
                    <div className='ok-photo-button' style={{ backgroundImage: `url(${ok_button})` }} onClick={goToFilter}></div>             
                    <div className='take-again-button' style={{ backgroundImage: `url(${take_again_button})` }} onClick={goToPhotoAgain}></div>
                </div>                
                <div className="middle-photo-div">
                    {!capturing && (
                        <img
                            src={videoFeedUrl}
                            style={getLiveStyle()}
                            alt="Live View"
                            className='photo-webcam'
                        />
                    )}
                </div>
            </div>
        )
    );
}

export default PhotoPreview;