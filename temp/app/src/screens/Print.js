import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../translations/i18n';
import "../css/Print.css";

// Background
import background_en from '../assets/Prints/BG.png';
import background_kr from '../assets/Prints/kr/BG.png';
import background_vn from '../assets/Prints/vn/BG.png';

// QR
import QRCode from 'qrcode.react';
import { getAudio } from '../api/config';

function Print() {
     const { t } = useTranslation();
     const navigate = useNavigate();
     const [hoveredImage, setHoveredImage] = useState(null);
const [myImg,setMyImg]=useState(sessionStorage.getItem('qr'))
     const [background, setBackground] = useState(background_en);
     // const sound='./thank_being.wav'
     // // const audioRef = useRef(null);
   
     // useEffect(() => {
     //   //음성 재생
     //   const audio = new Audio(sound); 
     //   audio.muted=true
     //   audio.play()
     //   audio.muted=false
   ////
     // }, []);
     useEffect(() => {
          const qr= sessionStorage.getItem('qr');
          setMyImg(qr)
          const storedLanguage = sessionStorage.getItem('language');
          if (storedLanguage === 'en') {
               setBackground(background_en);
          } else if (storedLanguage === 'ko') {
               setBackground(background_kr);
          } else if (storedLanguage === 'vi') {
               setBackground(background_vn);
          }
     }, []);
     // const src='./print.wav'
     // // const audioRef = useRef(null);
   
     // useEffect(() => {
     //   //음성 재생
     //   const audio = new Audio(src); 
     //   audio.muted=true
     //   audio.play()
     //   audio.muted=false
   
     // }, []);
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
          sessionStorage.clear();
          navigate('/');
     }

     const QRCodeComponent = () => {
          // const myImage = sessionStorage.getItem('uploadedCloudPhotoUrl');
          // console.log("qr url>>>",myIm)
          return (
               <QRCode
                    value={myImg}
                    size={200}
               />
          )
     }
     return (
          <div className='print-container' style={{ backgroundImage: `url(${background})` }} onClick={clearSessionStorageAndLeaveOut}>
               <div className="qr-code-container">
                     <QRCode
                    value={sessionStorage.getItem("qr")}
                    size={200}
               />
               </div>
          </div>
     );
}

export default Print;