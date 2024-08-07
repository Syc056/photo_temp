import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../translations/i18n';
import styles from "../css/Landing.css";

// Background
import background_en from '../assets/Landing/BG.png';
import background_kr from '../assets/Landing/kr/BG.png';
import background_vn from '../assets/Landing/vn/BG.png';
import background_mn from '../assets/Landing/mn/BG.png';


import QRImage from '../assets/Landing/utils/QR.png';
import SiteLogo from '../assets/Landing/utils/logo.png';
import Group38 from '../assets/Landing/utils/group-38.svg';
import Group42 from '../assets/Landing/utils/group-42.svg';
import Vector from '../assets/Landing/utils/vector.svg';
import Vector1 from '../assets/Landing/utils/vector-1.svg';
import Vector2 from '../assets/Landing/utils/vector-2.svg';
import Vector3 from '../assets/Landing/utils/vector-3.svg';
import Vector4 from '../assets/Landing/utils/vector-4.svg';

// QR
import QRCode from 'qrcode.react';
import { getAudio } from '../api/config';

function Landing() {
     const { t } = useTranslation();
     const navigate = useNavigate();
     const [hoveredImage, setHoveredImage] = useState(null);
     const [qrUrl, setQrUrl] = useState(null);
     const uuid = sessionStorage.getItem("uuid");

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

     const savePhotoBackendQr = async () => {
          const myImage = sessionStorage.getItem('uploadedCloudPhotoUrl');
          const myVideo=sessionStorage.getItem("videoUrl")
          const encodedImage = encodeURIComponent(myImage);
          const encodedVideo = encodeURIComponent(myVideo);          
          const downloadUrl=`http://3.26.21.10:8000/download?uuid=${uuid}&&image_path=${encodedImage}&video_path=${encodedVideo}` 
          setQrUrl(downloadUrl);          
     }

     useEffect(() => {
          savePhotoBackendQr();
     });



     const clearSessionStorageAndLeaveOut = () => {
          // sessionStorage.clear();
          navigate('/');
     }

  

     return (
          <div className="landing">
               <div className="thank-you-for-being-with-photo-wrapper">
                    <h3 className="thank-you-for-container">
                         <span className="thank-you-for-container1">
                              <p className="thank-you">THANK YOU</p>
                              <p className="for-being-with">FOR BEING WITH PHOTOMONG</p>
                         </span>
                    </h3>
               </div>
               <main className="frame-parent">
                    <div className="social-container-wrapper">
                         <div className="social-container">
                              <div className="social-container-inner">
                                   <img
                                        className="frame-child"
                                        loading="lazy"
                                        alt=""
                                        src={Group38}
                                   />
                              </div>
                              <div className="frame-group">
                                   <div className="frame-wrapper">
                                        <div className="frame-container1">
                                             <div className="frame-div">
                                                  <div className="logo-parent">
                                                       <img
                                                            className="logo-icon"
                                                            loading="lazy"
                                                            alt=""
                                                            src={Vector}
                                                       />
                                                       <img
                                                            className="logo-icon1"
                                                            loading="lazy"
                                                            alt=""
                                                            src={Vector1}
                                                       />
                                                       <img
                                                            className="logo-icon2"
                                                            loading="lazy"
                                                            alt=""
                                                            src={Vector2}
                                                       />
                                                  </div>
                                             </div>
                                             <b className="photomongvn">photomongvn</b>
                                        </div>
                                   </div>
                                   <div className="frame-wrapper1">
                                        <div className="footer-parent">
                                             <div className="footer">
                                                  <img
                                                       className="image-placeholder-icon"
                                                       loading="lazy"
                                                       alt=""
                                                       src={Vector3}
                                                  />
                                             </div>
                                             <b className="photomongvn1">photomong.vn</b>
                                        </div>
                                   </div>
                                   <div className="separator" />
                                   <div className="have-any-questions-container">
                                        <span>
                                             <p className="have-any-questions">Have any questions?</p>
                                             <p className="get-in-touch">Get in touch with us</p>
                                        </span>
                                   </div>
                              </div>
                         </div>
                    </div>
                    <section className="footer-content-parent">
                         <div className="footer-content">
                              <div className="contact-container-parent">
                                   <div className="contact-container">
                                        <iframe width="760" height="515" src="https://www.youtube.com/embed/Ej5lUfUaqs8?autoplay=1&mute=1&si=vtbDENEXJqHATluJ" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" mute="0" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                   </div>
                                   <div className="mmx156mm-logo-3-wrapper">
                                        <img
                                             className="mmx156mm-logo-3-icon"
                                             loading="lazy"
                                             alt=""
                                             src={SiteLogo}
                                        />
                                   </div>
                              </div>
                         </div>
                         <div className="frame-parent1">
                              <img
                                   className="frame-item"
                                   loading="lazy"
                                   alt=""
                                   src={Group42}
                              />
                              <div className="icon-background-wrapper">
                                   <div className="icon-background">
                                        <div className="icon-background-child" />
                                        <QRCode
                                             value={qrUrl}
                                             className="social-icon-placeholder"
                                             size={202}
                                             bgColor={"#ffffff"}
                                             fgColor={"#000000"}
                                             level={"L"}
                                             includeMargin={false}                                             
                                        />
                                   </div>
                              </div>
                              <div className="follow-us-on-sns-to-get-more-i-wrapper">
                                   <div className="follow-us-on-container">
                                        <p className="follow-us-on">Follow us on SNS</p>
                                        <p className="to-get-more">to get more information</p>
                                   </div>
                              </div>
                         </div>
                    </section>
               </main>
          </div>
     );
}

export default Landing;