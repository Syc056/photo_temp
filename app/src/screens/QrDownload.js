// import React from 'react';

// function QrDownload(props) {
//     const handleImageDownload = async () => {
//         const myImage = sessionStorage.getItem('uploadedCloudPhotoUrl');
//         if (myImage) {
//             try {
//                 const response = await fetch(myImage);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 const blob = await response.blob();
//                 const link = document.createElement('a');
//                 link.href = window.URL.createObjectURL(blob);
//                 link.download = 'downloaded_image.png'; // 다운로드될 파일 이름 설정
//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);
//             } catch (error) {
//                 console.error('Error downloading the image:', error);
//             }
//         } else {
//             alert('No image found in session storage.');
//         }
//     };

//     const handleGifDownload = async () => {
//         const myGif = sessionStorage.getItem('gifPhoto');
//         if (myGif) {
//             try {
//                 console.log('GIF URL:', myGif); // URL 확인
//                 const response = await fetch(myGif);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 console.log('Response headers:', response.headers.get('Content-Type')); // 응답 헤더 확인
//                 const blob = await response.blob();
//                 const link = document.createElement('a');
//                 link.href = window.URL.createObjectURL(blob);
//                 link.download = 'downloaded_image.gif'; // 다운로드될 파일 이름 설정
//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);
//             } catch (error) {
//                 console.error('Error downloading the GIF:', error);
//             }
//         } else {
//             alert('No GIF found in session storage.');
//         }
//     };

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
//             <button style={{ marginBottom: '20px' }} onClick={handleImageDownload}>
//                 Image Download
//             </button>
//             <button onClick={handleGifDownload}>
//                 Video Download
//             </button>
//         </div>
//     );
// }

// export default QrDownload;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';

function PhotoChoose() {
    const [capturePhotos, setCapturePhotos] = useState([]);
    const [videoUrl, setVideoUrl] = useState('');
    const navigate = useNavigate();
    const uuid = sessionStorage.getItem("uuid");

    useEffect(() => {
        if (capturePhotos.length === 8) {
            sessionStorage.setItem("uuid", uuid);
        }
        if (capturePhotos.length === 9) {
            console.log("mp4 in list", capturePhotos.filter(photo => photo.url.includes(".mp4")))
            if (capturePhotos.filter(photo => photo.url.includes(".mp4")).length > 0) {
                const idx = capturePhotos.findIndex(photo => photo.url.includes(".mp4"))
                const videoUrl = capturePhotos[idx].url
                sessionStorage.setItem("videoUrl", videoUrl);
                setVideoUrl(videoUrl);
            }
            navigate('/photo-choose');
        }
    }, [capturePhotos, navigate, uuid]);

    // useEffect(() => {
    //     if (uuid) {
    //         const url = `http://3.26.21.10:5000/video/${uuid}`;
    //         setVideoUrl(url);
    //     }
    // }, [uuid]);

    const handleImageDownload = async () => {
        // 이미지 다운로드 로직 구현
        console.log("Image download not implemented");
    };

    const handleVideoDownload = () => {
        if (videoUrl) {
            window.open(videoUrl, '_blank');
        } else {
            alert('No video URL available.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <button style={{ marginBottom: '20px' }} onClick={handleImageDownload}>
                Image Download
            </button>
            <button style={{ marginBottom: '20px' }} onClick={handleVideoDownload}>
                Video Download
            </button>
            {videoUrl && (
                <div>
                    <p>Scan this QR code to download the video:</p>
                    <QRCode value={videoUrl} />
                </div>
            )}
        </div>
    );
}

export default PhotoChoose;