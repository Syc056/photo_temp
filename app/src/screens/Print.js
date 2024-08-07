import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../translations/i18n';
import "../css/Print.css";

// Background
import background_en from '../assets/Prints/BG.png';
import background_kr from '../assets/Prints/kr/BG.png';
import background_vn from '../assets/Prints/vn/BG.png';
import background_mn from '../assets/Prints/mn/BG.png';

// QR
import QRCode from 'qrcode.react';
import { getAudio } from '../api/config';

function Print() {
     const { t } = useTranslation();
     const navigate = useNavigate();
     const [hoveredImage, setHoveredImage] = useState(null);
     const uuid=sessionStorage.getItem("uuid")

     const [background, setBackground] = useState(background_en);
    
     useEffect(() => {
          const storedLanguage = sessionStorage.getItem('language');
          if (storedLanguage === 'en') {
               setBackground(background_en);
          } else if (storedLanguage === 'ko') {
               setBackground(background_kr);
          } else if (storedLanguage === 'vi') {
               setBackground(background_vn);
          }else if (storedLanguage === 'mn') {
               setBackground(background_mn);
          }
     }, []);

     const playAudio = async() => {
          const res=await getAudio({file_name:"thank_being.wav"})
            }
      useEffect(()=>{
      playAudio()
      },[])
  
     const handleMouseEnter = (image) => {
          setHoveredImage(image);
     }

     const handleMouseLeave = () => {
          setHoveredImage(null);
     }

     const clearSessionStorageAndLeaveOut = () => {
          // sessionStorage.clear();
          navigate('/landing');
     }

     const QRCodeComponent = () => {
          const myImage = sessionStorage.getItem('uploadedCloudPhotoUrl');
          const myVideo=sessionStorage.getItem("videoUrl")
          const encodedImage = encodeURIComponent(myImage);
          const encodedVideo = encodeURIComponent(myVideo);
          console.log("!@#");
          console.log("!@#");
          console.log(myImage);
          
          console.log(myVideo);
          const downloadUrl=`http://3.26.21.10:8000/download?uuid=${uuid}&image_path=${encodedImage}&video_path=${encodedVideo}` 
          // myImage = myImage.replace("get_photo","download_photo")
          return (
               <QRCode
                    value={downloadUrl}
                    size={160}
               />
          )
     }
 

     return (
          <div className='print-container' style={{ backgroundImage: `url(${background})` }} onClick={clearSessionStorageAndLeaveOut}>
               <div className="qr-code-container">
                    <QRCodeComponent />
               </div>
           
          </div>
     );
}

export default Print;