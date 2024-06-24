import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import "../../css/Photo.css";
import countdownImg from '../../assets/Photo/Snap/countdown.png';
import photocountImg from '../../assets/Photo/Snap/photocount.png';
import previewImg from '../../assets/Photo/Snap/previewField.png';
// import previewDefaultImg from '../../assets/Photo/Snap/previewDefault.png';
import axios from 'axios';
import background_en from '../../assets/Photo/Snap/BG.png';
import background_kr from '../../assets/Photo/Snap/kr/BG.png';
import background_vn from '../../assets/Photo/Snap/vn/BG.png';
import { getAudio, getPhotos, sendCaptureReq, startLiveView, videoFeedUrl } from '../../api/config';
// import { position } from 'html2canvas/dist/types/css/property-descriptors/position';

function Photo() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(8);
    const [photoCount, setPhotoCount] = useState(0);
    const [flash, setFlash] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState(background_en);
    const [capturing, setCapturing] = useState(false);
    const [capturePhotos, setCapturePhotos] = useState([]);
    const [showFirstSet, setShowFirstSet] = useState(true);
    const timerRef = useRef(null);

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

   

    const takeSnapshot = async () => {
        setFlash(true);
        await sleep(100); // 서버가 stop_live_view를 호출하고 안정화될 시간을 줌
        setCapturing(true);
        try {
            await sendCaptureReq();
            setPhotoCount((prevCount) => prevCount + 1);
        } catch (error) {
            console.error('Failed to capture image:', error);
        }
        setFlash(false);
        setCapturing(false);
    };

    const startTimer = () => {
        timerRef.current = setInterval(async () => {
            setCountdown((prevCountdown) => {
                if (prevCountdown > 0) {
                    return prevCountdown - 1;
                } else {
                    clearInterval(timerRef.current); // 타이머를 멈추고 스냅샷을 찍음
                    takeSnapshot().then(() => {
                        setCountdown(8);
                        if (photoCount < 7) { // 사진이 7장 미만일 때만 타이머 다시 시작
                            startTimer();
                        }
                    });
                    return 8;
                }
            });
        }, 1000);
    };

    const getLatestPhoto = async (currentPhotoCount) => {
        const photos = await getPhotos();
        console.log("axios photos", photos);

        if (photos && photos.images && photos.images.length > 0) {
            const latestImage = photos.images[photos.images.length - 1];
            const imageName = latestImage.url.split('/').pop();
            const formattedImage = {
                ...latestImage,
                url: `${process.env.REACT_APP_BACKEND}/serve_photo/${imageName}`
            };
            console.log("Latest photo", photos.images.length, formattedImage.url.replace(/\\/g, '/').replace('serve_photo', 'get_photo'));

            setCapturePhotos((prevPhotos) => {
                const newPhotos = [...prevPhotos];
                newPhotos[currentPhotoCount] = { id: formattedImage.id, url: formattedImage.url.replace(/\\/g, '/').replace('serve_photo', 'get_photo') };
                return newPhotos;
            });
        } else {
            console.log("No photos available.");
        }
    };

    useEffect(() => {
        if (photoCount > 0) {
            playTakePhotoAudio()
            getLatestPhoto(photoCount - 1);
        }
        if (photoCount>4) {
            setShowFirstSet(false)
        }
        
    }, [photoCount]);

    useEffect(() => {
        if (capturePhotos.length === 8) {
            navigate('/photo-choose');
        }
    }, [capturePhotos]);

    useEffect(() => {
        const language = sessionStorage.getItem('language');
        if (language === 'en') {
            setBackgroundImage(background_en);
        } else if (language === 'ko') {
            setBackgroundImage(background_kr);
        } else if (language === 'vi') {
            setBackgroundImage(background_vn);
        }
    }, []);
    
    const togglePreviewSet = () => {
        setShowFirstSet((prevShowFirstSet) => !prevShowFirstSet);
    };

    console.log("photos>>>", capturePhotos);
    useEffect(() => {
        const initializeLiveView = async () => {
            await startLiveView();
        };

        initializeLiveView();
        startTimer();

        return () => {
            clearInterval(timerRef.current);
        };
    }, []);
    const playTakePhotoAudio = async() => {
        const res=await getAudio({file_name:"take_photo.wav"})
        console.log("audio :",res)
          }
    useEffect(()=>{
    playAudio()
    },[])
    const playAudio = async() => {
        const res=await getAudio({file_name:"look_up_smile.wav"})
        console.log("audio :",res)
          }
   useEffect(()=>{
    playAudio()
   },[])
    console.log("포토 js",JSON.parse(sessionStorage.getItem('selectedFrame')).frame)
    const getLiveStyle=()=>{
        const frame=JSON.parse(sessionStorage.getItem('selectedFrame')).frame
        if (frame==="6-cutx2") {
            return {width:"714px",height:"700px",objectFit:"cover",position:"absolute",left:"12%"}
        } 
        else if(frame==="Stripx2"){
            return {width:"882px",height:"600px",objectFit:"cover",position:"absolute",left:"2%"}
        }
        else if(frame==="2cut-x2"){
            return {width:"600px",height:"678px",objectFit:"cover",position:"absolute",left:"18%"}
        }
        else if(frame==="4-cutx2"){
            return {width:"798px",height:"600px",objectFit:"cover",position:"absolute",left:"6%"} 
        }
        else {
            
        }
    }
    return (
        <div className={`photo-container ${flash ? 'animate' : ''}`} style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="left-photo-div" style={{ backgroundImage: `url(${countdownImg})` }}>
                <div className="photo-countdown">{countdown}</div>
            </div>
            <div className="right-photo-div" style={{ backgroundImage: `url(${photocountImg})` }}>
                <div className="photo-count">{photoCount}/8</div>
            </div>
            <div className="right-preview-ul">
                {showFirstSet?Array.from({ length: 8 }).map((_, index) => 
                    <div
                        key={index}
                        className={`preview-default-${index}`}
                        style={{ 
                            borderRadius:"20px", 
                            backgroundColor:"white",
                            backgroundImage: capturing 
                                ? null 
                                : `url(${capturePhotos[index]?.url || null})`
                        }}
                    >
                        <div className='preview-cnt'>{index + 1}/8</div>
                    </div>
                ).slice(0,4):Array.from({ length: 8 }).map((_, index) => 
                    <div
                        key={index} 
                        className={`preview-default-${index}`}
                        style={{ 
                            borderRadius:"20px", 
                            backgroundColor:"white",
                            backgroundImage: capturing 
                            ? null 
                            : `url(${capturePhotos[index]?.url || null})`
                        }}
                    >
                        <div className='preview-cnt'>{index + 1}/8</div>
                    </div>
                ).slice(4,8)}
            </div>
            <div className="right-preview-ul-arrow" onClick={togglePreviewSet} />
            <div className="right-preview-div" style={{ backgroundImage: `url(${previewImg})` }}></div>
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
    );
}

export default Photo;
// import React, { useEffect, useState, useRef } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
// import "../../css/Photo.css";
// import countdownImg from '../../assets/Photo/Snap/countdown.png';
// import photocountImg from '../../assets/Photo/Snap/photocount.png';
// import previewImg from '../../assets/Photo/Snap/previewField.png';
// import previewDefaultImg from '../../assets/Photo/Snap/previewDefault.png';
// import axios from 'axios';
// import background_en from '../../assets/Photo/Snap/BG.png';
// import background_kr from '../../assets/Photo/Snap/kr/BG.png';
// import background_vn from '../../assets/Photo/Snap/vn/BG.png';
// import { getPhotos, sendCaptureReq } from '../../api/config';

// function Photo() {
//     const { t } = useTranslation();
//     const navigate = useNavigate();
//     const [countdown, setCountdown] = useState(8);
//     const [photoCount, setPhotoCount] = useState(0);
//     const [flash, setFlash] = useState(false);
//     const [backgroundImage, setBackgroundImage] = useState(background_en);
//     const [capturing, setCapturing] = useState(false);
//     const timerRef = useRef(null);

//     // const soundTakePhoto='./take_photo.wav'
// // useEffect(()=>{
// //     if (flash) {
// //            const audio = new Audio(soundTakePhoto); 
// //     audio.muted=true
// //     // audio.play()
// //     audio.muted=false   
// //     }

// // },[flash])
// // const sound='./look_up_smile.wav'
//     //     const audioRef = useRef(null);
      
//     //     useEffect(() => {
//     //       //음성 재생
//     //       const audio = new Audio(sound); 
//     //       audio.muted=true
//     //     //   audio.play()
//     //       audio.muted=false
      
//     //     }, []);
//     const sleep = (ms) => {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     };

//     const startLiveView = async () => {
//         try {
//             await axios.get('http://127.0.0.1:5000/start_live_view');
//         } catch (error) {
//             console.error('Failed to start live view:', error);
//         }
//     };

//     const takeSnapshot = async () => {
//         setFlash(true);
//         await sleep(100); // 서버가 stop_live_view를 호출하고 안정화될 시간을 줌
//         setCapturing(true);
//         try {
//             const response = await sendCaptureReq();
//             console.log("response result>>>", response);
//             setPhotoCount((prevCount) => prevCount + 1);
//         } catch (error) {
//             console.error('Failed to capture image:', error);
//         }
//         setFlash(false);
//         setCapturing(false);
//     };

//     const startTimer = () => {
//         timerRef.current = setInterval(async () => {
//             setCountdown((prevCountdown) => {
//                 if (prevCountdown > 0) {
//                     return prevCountdown - 1;
//                 } else {
//                     clearInterval(timerRef.current); // 타이머를 멈추고 스냅샷을 찍음
//                     takeSnapshot().then(() => {
//                         setCountdown(8);
//                         if (photoCount < 7) { // 사진이 7장 미만일 때만 타이머 다시 시작
//                             startTimer();
//                         }
//                     });
//                     return 8;
//                 }
//             });
//         }, 1000);
//     };

    // useEffect(() => {
    //     const initializeLiveView = async () => {
    //         await startLiveView();
    //     };

    //     initializeLiveView();
    //     startTimer();

    //     return () => {
    //         clearInterval(timerRef.current);
    //     };
    // }, []);

//     useEffect(() => {
//         if (photoCount === 8) {
//             const getPhotosAndNavigate = async () => {
//                 const photos = await getPhotos();
//                 console.log("axios photos", photos);
//                 const formattedImages = photos.images.map(img => {
//                     const imageName = img.url.split('/').pop();
//                     return {
//                         ...img,
//                         // url: `${process.env.REACT_APP_BACKEND}/get_photo/uploads/${imageName}`
//                         url: `${process.env.REACT_APP_BACKEND}/serve_photo/${imageName}`
//                     };
//                 });
//                 console.log("포맷", formattedImages);
//                 sessionStorage.setItem('photos', JSON.stringify(formattedImages));
//                 navigate('/photo-choose');
//             };
//             console.log("사진 8장 다 찍음. photo-choose로 이동 준비.");
//             getPhotosAndNavigate();
//         }
//     }, [photoCount, navigate]);

//     useEffect(() => {
//         const language = sessionStorage.getItem('language');
//         if (language === 'en') {
//             setBackgroundImage(background_en);
//         } else if (language === 'ko') {
//             setBackgroundImage(background_kr);
//         } else if (language === 'vi') {
//             setBackgroundImage(background_vn);
//         }
//     }, []);

//     return (
//         <div className={`photo-container ${flash ? 'animate' : ''}`} style={{ backgroundImage: `url(${backgroundImage})` }}>
          
//              <div className="left-photo-div" style={{ backgroundImage: `url(${countdownImg})` }}>
//                 <div className="photo-countdown">{countdown}</div>
//             </div>
//             <div className="right-photo-div" style={{ backgroundImage: `url(${photocountImg})` }}>
//                 <div className="photo-count">{photoCount}/8</div>
//             </div>
//             <div  className="right-preview-ul">          <div  className="preview-default-0" style={{ backgroundImage: `url(${previewDefaultImg})` }}>
//                 <div
//                 className='preview-cnt'
//                 >1/8</div>
//                 </div>
//             <div  className="preview-default-1" style={{ backgroundImage: `url(${previewDefaultImg})` }}> <div
//                 className='preview-cnt'
//                 >2/8</div> </div>
//             <div  className="preview-default-2" style={{ backgroundImage: `url(${previewDefaultImg})` }}> <div
//                 className='preview-cnt'
//                 >3/8</div></div>
//             <div  className="preview-default-3" style={{ backgroundImage: `url(${previewDefaultImg})` }}> <div
//                 className='preview-cnt'
//                 >4/8</div></div>
// <div  className="preview-default-4" style={{ backgroundImage: `url(${previewDefaultImg})` }}> <div
//                 className='preview-cnt'
//                 >5/8</div></div>
//                 <div  className="preview-default-5" style={{ backgroundImage: `url(${previewDefaultImg})` }}> <div
//                 className='preview-cnt'
//                 >6/8</div></div>
//        <div  className="preview-default-6" style={{ backgroundImage: `url(${previewDefaultImg})` }}> <div
//                 className='preview-cnt'
//                 >7/8</div></div>
//                    <div  className="preview-default-7" style={{ backgroundImage: `url(${previewDefaultImg})` }}> <div
//                 className='preview-cnt'
//                 >8/8</div></div></div>
//             <div  className="right-preview-div" style={{ backgroundImage: `url(${previewImg})` }}>
  
//           </div>
//             <div className="middle-photo-div">
//                 {!capturing && (
//                     <img
//                         // src={`http://172.21.120.126:5000/video_feed`}
//                         src={`http://127.0.0.1:5000/video_feed`}
//                         alt="Live View"
//                         className='photo-webcam'
//                     />
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Photo;

