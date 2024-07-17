// import React, { useEffect, useState, useRef } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
// import "../../css/Photo.css";
// import countdownImg from '../../assets/Photo/Snap/countdown.png';
// import photocountImg from '../../assets/Photo/Snap/photocount.png';
// import previewImg from '../../assets/Photo/Snap/previewField.png';
// // import previewDefaultImg from '../../assets/Photo/Snap/previewDefault.png';
// import axios from 'axios';
// import background_en from '../../assets/Photo/Snap/BG.png';
// import background_kr from '../../assets/Photo/Snap/kr/BG.png';
// import background_vn from '../../assets/Photo/Snap/vn/BG.png';
// import background_mn from '../../assets/Photo/Snap/mn/BG.png';
// import load_en from '../../assets/Photo/Load/BG.png';
// import load_kr from '../../assets/Photo/Load/kr/BG.png';
// import load_vn from '../../assets/Photo/Load/vn/BG.png';
// import load_mn from '../../assets/Photo/Load/mn/BG.png';
// import { getAudio, getPhotos, sendCaptureReq, startLiveView, videoFeedUrl } from '../../api/config';
// // import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
// import Uid from "react-uuid"

// function Photo() {
//     const { t } = useTranslation();
//     const navigate = useNavigate();
//     const [countdown, setCountdown] = useState(8);
//     const [photoCount, setPhotoCount] = useState(0);
//     const [flash, setFlash] = useState(false);
//     const [backgroundImage, setBackgroundImage] = useState(background_en);
//     const [loadBgImage,setLoadBgImage]=useState(load_en);
//     const [capturing, setCapturing] = useState(false);
//     const [capturePhotos, setCapturePhotos] = useState([]);
//     const [showFirstSet, setShowFirstSet] = useState(true);
//     const [uuid, setUuid] = useState(sessionStorage.getItem("uuid") || null);

//     const timerRef = useRef(null);
//     useEffect(() => {
//         // if (!uuid) {
//             const newUuid = Uid().toString();
//             setUuid(newUuid);
//             // console.log('newnew uuid>>>>>>>>>>>>>>>>>>>>>>>>',newUuid)
           
//         // }

//     }, []);
//     const sleep = (ms) => {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     };

   

//     const takeSnapshot = async () => {
//         setFlash(true);
//         await sleep(100); // 서버가 stop_live_view를 호출하고 안정화될 시간을 줌
//         setCapturing(true);
//         try {
//             const res = await sendCaptureReq(uuid);
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

//     const getLatestPhoto = async (currentPhotoCount) => {
//         const photos = await getPhotos(uuid); 
//         console.log('gif>>>',photos)

//         if (photos && photos.images && photos.images.length > 0) {
//             const latestImage = photos.images[photos.images.length - 1];
//             const imageName = latestImage.url.split('/').pop();
//             const formattedImage = {
//                 ...latestImage,
//                 url: `${process.env.REACT_APP_BACKEND}/serve_photo/${uuid}/${imageName}`
//             };


//             console.log(imageName)
//             console.log("123123123")
//             console.log(formattedImage.url.replace(/\\/g, '/').replace('serve_photo', `get_photo/uploads/`) )

//             setCapturePhotos((prevPhotos) => {
//                 const newPhotos = [...prevPhotos];
//                 newPhotos[currentPhotoCount] = { id: formattedImage.id, url: formattedImage.url.replace(/\\/g, '/').replace('serve_photo', `get_photo/uploads`) };
//                 return newPhotos;
//             });
//         } else {
//             console.log("No photos available.");
//         }
//     };
//     const playCntSound = async () => {
//         const res = await getAudio({ file_name: "count.wav" })
//       }
//     useEffect(() => {
//         if (uuid != null) {
           
               
//             if (photoCount > 0) {
//                 playTakePhotoAudio();
//                 getLatestPhoto(photoCount - 1);
//             }
//             if (photoCount > 4) {
//                 setShowFirstSet(false);
//             }
//         }
//     }, [photoCount, uuid]);

//     useEffect(() => {
      


//         if (capturePhotos.length === 8) {
//             sessionStorage.setItem("uuid", uuid);
          
//         }
//         // if (capturePhotos.length === 9) {
//         //       console.log("mp4 in list",capturePhotos.filter(photo=>photo.url.includes(".mp4")))
//         // if (capturePhotos.filter(photo=>photo.url.includes(".mp4")).length>0) {
//         //   const idx=  capturePhotos.findIndex(photo=>photo.url.includes(".mp4"))
//         //   const gifPhoto=capturePhotos[idx].url
//         //             sessionStorage.setItem("gifPhoto", gifPhoto);
//         // }
//         //     navigate('/photo-choose');
//         // }
//     }, [capturePhotos, navigate]);

//     useEffect(() => {
//         const language = sessionStorage.getItem('language');
//         if (language === 'en') {
//             setBackgroundImage(background_en);
//             setLoadBgImage(load_en)
//         } else if (language === 'ko') {
//             setBackgroundImage(background_kr);
//                setLoadBgImage(load_kr)
//         } else if (language === 'vi') {
//             setBackgroundImage(background_vn);
//                setLoadBgImage(load_vn)
//         }else if (language === 'mn') {
//             setBackgroundImage(background_mn);
//                setLoadBgImage(load_mn)
//         }
//     }, []);
    
//     const togglePreviewSet = () => {
//         setShowFirstSet((prevShowFirstSet) => !prevShowFirstSet);
//     };

//     useEffect(() => {

//         if (uuid) {
//               const initializeLiveView = async () => {
//                     await startLiveView();
//                 };
        
//                 initializeLiveView();
//                 startTimer();
//         }
              
        
//                 return () => {
//                     clearInterval(timerRef.current);
//                 };
//             }, [uuid]);
//     const playTakePhotoAudio = async() => {
//         const res=await getAudio({file_name:"take_photo.wav"})
//           }
//     // useEffect(()=>{
//     // playAudio()
//     // },[])
//     const playAudio = async() => {
//         const res=await getAudio({file_name:"look_up_smile.wav"})
//           }
//    useEffect(()=>{
//     playAudio()
//    },[])
//     const getLiveStyle=()=>{
//         const frame=JSON.parse(sessionStorage.getItem('selectedFrame')).frame
//         if (frame==="6-cutx2") {
//             return {width:"714px",height:"700px",objectFit:"cover",position:"absolute",left:"12%",transform:"scaleX(-1)"}
//         } 
//         else if(frame==="Stripx2"){
//             return {width:"882px",height:"600px",objectFit:"cover",position:"absolute",left:"2%",transform:"scaleX(-1)"}
//         }
//         else if(frame==="2cut-x2"){
//             return {width:"600px",height:"678px",objectFit:"cover",position:"absolute",left:"18%",transform:"scaleX(-1)"}
//         }
//         else if(frame==="4-cutx2"){
//             return {width:"798px",height:"600px",objectFit:"cover",position:"absolute",left:"6%",transform:"scaleX(-1)"} 
//         }
//         else {
            
//         }
//     }
//     useEffect(()=>{
//         if (countdown===7) {
//             playCntSound()
            
//         }
//     },[countdown])
//     console.log("preview photos>>>",capturePhotos)
//     return (
//       flash?  <div className={`photo-container `} style={{ backgroundImage: `url(${loadBgImage})` }}/>:<div className={`photo-container `} style={{ backgroundImage: `url(${backgroundImage})` }}>
//         <div className="left-photo-div" style={{ backgroundImage: `url(${countdownImg})` }}>
//                 <div className="photo-countdown">{countdown}</div>
//             </div>
//             <div className="right-photo-div" style={{ backgroundImage: `url(${photocountImg})` }}>
//                 <div className="photo-count">{photoCount}/8</div>
//             </div>
//             <div className="right-preview-ul">
//                 {showFirstSet?Array.from({ length: 8 }).map((_, index) => 
//                     <div
//                         key={index}
//                         className={`preview-default-${index}`}
//                         style={{ 
//                             borderRadius:"20px", 
//                             backgroundColor:"white",
//                             backgroundImage: capturing 
//                                 ? null 
//                                 : `url(${capturePhotos[index]?.url || null})`
//                         }}
//                     >
//                         {/* <div className='preview-cnt'>{index + 1}/8</div> */}
//                     </div>
//                 ).slice(0,4):Array.from({ length: 8 }).map((_, index) => 
//                     <div
//                         key={index} 
//                         className={`preview-default-${index}`}
//                         style={{ 
//                             borderRadius:"20px", 
//                             backgroundColor:"white",
//                             backgroundImage: capturing 
//                             ? null 
//                             : `url(${capturePhotos[index]?.url || null})`
//                         }}
//                     >
//                         {/* <div className='preview-cnt'>{index + 1}/8</div> */}
//                     </div>
//                 ).slice(4,8)}
//             </div>
//             <div className="right-preview-ul-arrow" onClick={togglePreviewSet} />
//             <div className="right-preview-div" style={{ backgroundImage: `url(${previewImg})` }}></div>
//             <div className="middle-photo-div">
//                 {!capturing && (
//                     <img
//                         src={videoFeedUrl}
//                         style={getLiveStyle()}
//                         alt="Live View"
//                         className='photo-webcam'
//                     />
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Photo;
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
import { getAudio, getPhotos, sendCaptureReq, startLiveView, videoFeedUrl } from '../../api/config';
import Uid from "react-uuid"

function Photo() {
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
    const [uuid, setUuid] = useState(sessionStorage.getItem("uuid") || null);

    const timerRef = useRef(null);

    useEffect(() => {
        const newUuid = Uid().toString();
        setUuid(newUuid);
    }, []);

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    const takeSnapshot = async () => {
        setFlash(true);
        await sleep(100);
        setCapturing(true);
        try {
            await sendCaptureReq(uuid);
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
                    clearInterval(timerRef.current);
                    takeSnapshot().then(() => {
                        setCountdown(8);
                        if (photoCount < 7) {
                            startTimer();
                        }
                    });
                    return 8;
                }
            });
        }, 1000);
    };

    const getLatestPhoto = async (currentPhotoCount) => {
        const photos = await getPhotos(uuid);
        if (photos && photos.images && photos.images.length > 0) {
            const latestImage = photos.images[photos.images.length - 1];
            const imageName = latestImage.url.split('/').pop();
            const formattedImage = {
                ...latestImage,
                url: `${process.env.REACT_APP_BACKEND}/serve_photo/${uuid}/${imageName}`
            };
            setCapturePhotos((prevPhotos) => {
                const newPhotos = [...prevPhotos];
                newPhotos[currentPhotoCount] = {
                    id: formattedImage.id,
                    url: formattedImage.url.replace(/\\/g, '/').replace('serve_photo', `get_photo/uploads`)
                };
                return newPhotos;
            });
        } else {
            console.log("No photos available.");
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
        if (capturePhotos.length === 8) {
            const gifPhoto = capturePhotos.find(photo => photo.url.includes(".mp4"));
            console.log("mp4 qr>>>" ,capturePhotos)
            if (gifPhoto) {
                sessionStorage.setItem("gifPhoto", gifPhoto.url.replace("get_photo","download_photo"));
            }
            sessionStorage.setItem("uuid", uuid);
            navigate('/photo-choose');
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

    useEffect(() => {
        if (uuid) {
            const initializeLiveView = async () => {
                await startLiveView();
            };
            initializeLiveView();
            startTimer();
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
            return { width: "714px", height: "700px", objectFit: "cover", position: "absolute", left: "12%", transform: "scaleX(-1)" };
        } else if (frame === "Stripx2") {
            return { width: "882px", height: "600px", objectFit: "cover", position: "absolute", left: "2%", transform: "scaleX(-1)" };
        } else if (frame === "2cut-x2") {
            return { width: "600px", height: "678px", objectFit: "cover", position: "absolute", left: "18%", transform: "scaleX(-1)" };
        } else if (frame === "4-cutx2") {
            return { width: "798px", height: "600px", objectFit: "cover", position: "absolute", left: "6%", transform: "scaleX(-1)" };
        } else {
            return {};
        }
    };

    useEffect(() => {
        if (countdown === 7) {
            playCntSound();
        }
    }, [countdown]);

    return (
        flash ? (
            <div className={`photo-container`} style={{ backgroundImage: `url(${loadBgImage})` }} />
        ) : (
            <div className={`photo-container`} style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className="left-photo-div" style={{ backgroundImage: `url(${countdownImg})` }}>
                    <div className="photo-countdown">{countdown}</div>
                </div>
                <div className="right-photo-div" style={{ backgroundImage: `url(${photocountImg})` }}>
                    <div className="photo-count">{photoCount}/8</div>
                </div>
                <div className="right-preview-ul">
                    {showFirstSet ? Array.from({ length: 8 }).map((_, index) =>
                        <div
                            key={index}
                            className={`preview-default-${index}`}
                            style={{
                                borderRadius: "20px",
                                backgroundColor: "white",
                                backgroundImage: capturing
                                    ? null
                                    : `url(${capturePhotos[index]?.url || null})`
                            }}
                        />
                    ).slice(0, 4) : Array.from({ length: 8 }).map((_, index) =>
                        <div
                            key={index}
                            className={`preview-default-${index}`}
                            style={{
                                borderRadius: "20px",
                                backgroundColor: "white",
                                backgroundImage: capturing
                                    ? null
                                    : `url(${capturePhotos[index]?.url || null})`
                            }}
                        />
                    ).slice(4, 8)}
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
        )
    );
}

export default Photo;
