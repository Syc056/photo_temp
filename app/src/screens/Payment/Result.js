import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../translations/i18n';
import "../../css/Payment.css";

//Background
import background_en from '../../assets/Payment/Result/BG.png';
import background_vn from '../../assets/Payment/Result/vn/BG.png';
import backgrond_kr from '../../assets/Payment/Result/kr/BG.png';

// Continue
import continue_en from '../../assets/Common/continue.png';
import continue_en_hover from '../../assets/Common/continue_click.png';
import continue_kr from '../../assets/Common/kr/continue.png';
import continue_kr_hover from '../../assets/Common/kr/continue_click.png';
import continue_vn from '../../assets/Common/vn/continue.png';
import continue_vn_hover from '../../assets/Common/vn/continue_click.png';
import { getAudio, originAxiosInstance } from '../../api/config';

function QR() {
     const { t } = useTranslation();
     const navigate = useNavigate();
     const [hoveredImage, setHoveredImage] = useState(null);
     const [backround, setBackround] = useState(background_en);
     const [continueButton, setContinueButton] = useState(continue_en);
     const [printRefs, setPrintRefs] = useState([]);
     const [bgIdx, setBgIdx] = useState(0);
     const [originalDataURL, setOriginalDataURL] = useState(null);
     const [selectedFrame, setSelectedFrame] = useState(null);     
     const [clickPrint, setClickPrint] = useState(false);

     const uuid = sessionStorage.getItem("uuid")
     const photoNum = sessionStorage.getItem("photoNum")

     useEffect(() => {
          const storedLanguage = sessionStorage.getItem('language');
          if (storedLanguage) {
               if (storedLanguage === 'en') {
                    setBackround(background_en);
                    setContinueButton(continue_en);
               } else if (storedLanguage === 'ko') {
                    setBackround(backgrond_kr);
                    setContinueButton(continue_kr);
               } else if (storedLanguage === 'vi') {
                    setBackround(background_vn);
                    setContinueButton(continue_vn);
               }
          }
     }, []);

     useEffect(() => {
          const printRefs = JSON.parse(sessionStorage.getItem('printRefs'));
          if (printRefs) {
               setPrintRefs(printRefs);
          }

          const bgIdx = JSON.parse(sessionStorage.getItem('bgIdx'));
          if (bgIdx) {
               setBgIdx(bgIdx);
          }

          const originalDataURL = sessionStorage.getItem('originalDataURL');
          if (originalDataURL) {
               setOriginalDataURL(originalDataURL);
          }

          // Retrieve selected frame from session storage
          const storedSelectedFrame = JSON.parse(sessionStorage.getItem('selectedFrame'));
          if (storedSelectedFrame) {
               setSelectedFrame(storedSelectedFrame.frame);
          }
     }, []);

     const playAudio = async () => {
          const res = await getAudio({ file_name: "pay_success.wav" })
     }
     useEffect(() => {
          playAudio()
     }, [])

     function rotateImageDataURL(dataURL, degrees) {
          return new Promise((resolve, reject) => {
               const image = new Image();
               image.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const { width, height } = image;

                    // Canvas 크기를 이미지 크기와 동일하게 설정
                    canvas.width = width;
                    canvas.height = height;

                    // 이미지를 회전시키고 Canvas에 그리기
                    ctx.translate(height / 2, width / 2);
                    ctx.rotate(degrees * Math.PI / 180);
                    ctx.drawImage(image, -width / 2, -height / 2);

                    // 회전된 이미지를 Data URL로 변환하여 반환
                    resolve(canvas.toDataURL());
               };
               image.onerror = reject;
               image.src = dataURL;
          });
     }

     const uploadCloud = () => {
          try {
               // if empty printRefs or printRefs[bgIdx] is null
               if (!printRefs || !printRefs[bgIdx] || !originalDataURL) {
                    return;
               }
               console.log("originalDataURL>>>", originalDataURL)
                              
               let rotated = null;
               rotateImageDataURL(originalDataURL, 90)
                    .then(rotatedDataURL => {
                         const formData = new FormData();
                         formData.append("photo", originalDataURL);
                         formData.append("order_code", sessionStorage.getItem('orderCodeNum'));

                         originAxiosInstance.post(
                              `${process.env.REACT_APP_BACKEND}/frames/api/upload_cloud`,
                              formData,
                              {
                                   headers: {
                                        'Content-Type': 'multipart/form-data'
                                   }
                              })
                              .then(response => {
                                   const data = response.data;
                                   const qrVal = data.photo_url;
                                   if (qrVal) {
                                        sessionStorage.setItem('uploadedCloudPhotoUrl', qrVal);
                                        sessionStorage.setItem('qr', qrVal);
                                        console.log("qr val>>>", qrVal)
                                        callPrinter();
                                        navigate("/print");
                                   }

                              })
                              .catch(error => {
                                   console.log(error);
                              });
                    })
                    .catch(error => {
                         console.error('이미지 회전 중 오류 발생:', error);
                    });

          } catch (error) {
               console.log(error);
          }
     };

     const callPrinter = async () => {
          // if empty printRefs or bgIdx return
          if (!printRefs || !bgIdx) {
               return;
          }

          const stageRef = printRefs[bgIdx];
          if (!stageRef.current) {
               return;
          }

          const originalDataURL = stageRef.current.toDataURL();
          const blobBin = atob(originalDataURL.split(',')[1]);
          const array = [];
          for (let i = 0; i < blobBin.length; i++) {
               array.push(blobBin.charCodeAt(i));
          }
          const newFile = new Blob([new Uint8Array(array)], { type: 'image/png' });

          const formData = new FormData();
          formData.append("photo", newFile);
          let newPhotoNum = selectedFrame === "Stripx2" ? photoNum : (parseInt(photoNum) + 1).toString();
          formData.append("uuid", uuid);
          formData.append("frame", selectedFrame);
          // formData.append("photoNum", newPhotoNum);

          // try {
          const response = await originAxiosInstance.post(
               `${process.env.REACT_APP_BACKEND}/frames/api/print`,
               formData,
               {
                    headers: {
                         'Content-Type': 'multipart/form-data'
                    }
               }
          );

          console.log('Print response:', response.data);

          const printUrl = response.data.print_url;
          const printData = response.data.print_data;
          // const uploadsDataPath = response.data.print_data.file_path;

          // // console.log(uploadsDataPath)
          // // console.log(uploadsDataPath)
          // // console.log(uploadsDataPath)
          // // console.log(uploadsDataPath)

          // // const res = await getPhotos(uuid);
          // // console.log(res)
          // // // const filtered = res.unsorted_images.filter(img => img.url.includes(uploadsDataPath));

          // // let newUrl = convertUrl(res.images.url);
          // // const fileResponse = await fetch(newUrl);
          // // const fileBlob = await fileResponse.blob();

          // // const formDataToFlask = new FormData();
          // // formDataToFlask.append('file', new File([fileBlob], "print_image.png", { type: fileBlob.type }));
          // // formDataToFlask.append('frame', printData.frame);
          // // console.log("photoNum")
          // // console.log(newPhotoNum)
          const myImage = sessionStorage.getItem('uploadedCloudPhotoUrl');

          for (let i = 0; i < newPhotoNum; i++) {
               // const fileResponse = await fetch(res.images[i].url.replace('uploads', 'get_photo/uploads'));
               // const fileResponse = await fetch(res.images[i].url);
               const fileResponse = await fetch(myImage);
               const fileBlob = await fileResponse.blob();

               const formDataToFlask = new FormData();
               formDataToFlask.append('file', new File([fileBlob], "print_image.png", { type: fileBlob.type }));
               formDataToFlask.append('frame', printData.frame);

               console.log(`${i} : ` + String(formDataToFlask))



               const localPrintResponse = await fetch(printUrl, {
                    method: 'POST',
                    body: formDataToFlask,
               });

               if (localPrintResponse.ok) {
                    console.log(`Print job ${i + 1} started successfully.`);
               } else {
                    console.log(`Failed to start print job ${i + 1}.`);
               }
          }


          const ipResponse = await fetch("https://api.ipify.org?format=json");
          const ipData = await ipResponse.json();
          const userIp = ipData.ip;

          // Step 2: Fetch all devices
          const allDevicesResponse = await fetch(`http://3.26.21.10:9000/api/devices`);
          const allDevices = await allDevicesResponse.json();

          // Step 3: Find the device with the matching IP address
          const device = allDevices.find(device => device.ip === userIp);

          if (!device) {
               console.error(`No device found with IP address: ${userIp}`);
               return;
          }

          const deviceId = device.id;
          const sales = sessionStorage.getItem('sales')

          const testformData = {
               "Sales": sales // 예제 변경값
          };

          const updateSalesResponse = await fetch(`http://3.26.21.10:9000/api/update_sales/${deviceId}`, {
               method: 'PUT',
               headers: {
                    'Content-Type': 'application/json'
               },
               body: JSON.stringify(testformData)
          });

          const printAmountResponse = await fetch(`http://3.26.21.10:9000/api/update_print_amount/${deviceId}`, {
               method: 'PUT',
               headers: {
                    'Content-Type': 'application/json'
               },
               body: JSON.stringify({ remaining_amount: device.remaining_amount - newPhotoNum }) // 예제 변경값
          });

          const paymentMethod = sessionStorage.getItem("payMethod")
          // Step 6: Log the payment
          const logPaymentData = {
               device: device.name,
               device_code: device.device_code,
               payment_amount: sales, // 예제 변경값
               payment_method: paymentMethod, // 실제 결제 방식으로 변경 필요
          };

          const logPaymentResponse = await fetch(`http://3.26.21.10:9000/api/log_payment`, {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json'
               },
               body: JSON.stringify(logPaymentData)
          });

          const logPaymentResult = await logPaymentResponse.json();
          const updateSalesResult = await updateSalesResponse.json();
          const printAmountResult = await printAmountResponse.json();

          // Handle the responses as needed
          console.log('Update Sales Result:', updateSalesResult);
          console.log('Update Print Amount Result:', printAmountResult);
          console.log('Log Payment Result:', logPaymentResult);

          // const ip_response = await fetch("https://api.ipify.org?format=json")
          // const data = await ip_response.json()

          // const all_device = await fetch(`${process.env.REACT_APP_BACKEND}/api/devices`, {
          //     method: 'POST',
          //     body: formDataToFlask,
          // });

          // const sales_calc = await fetch(`${process.env.REACT_APP_BACKEND}/api/edit_device/${data.ip}`, {
          //     method: 'POST',
          //     body: formDataToFlask,
          // });
          // const print_amount_calc = await fetch(`${process.env.REACT_APP_BACKEND}/api/update_print_amount/${data.ip}`, {
          //     method: 'POST',
          //     body: formDataToFlask,
          // });


          // @app.route('/api/update_print_amount/<int:id>', methods=['PUT'])
          // def update_print_amount(id):
          //     data = request.get_json()
          //     device = Device.query.get_or_404(id)
          //     device.remaining_amount = data['remaining_amount']
          //     db.session.commit()
          //     return jsonify({'message': 'Print amount updated successfully'}), 200

          // } catch (error) {
          //     console.error('Error during printing process:', error);
          // }
     };

     const playPrintAudio = async () => {
          const res = await getAudio({ file_name: "print.wav" })
     }

     const printFrameWithSticker = async (event,) => {
          if (clickPrint === true) {
               return;
          }

          playPrintAudio()
          setClickPrint(true);
          await uploadCloud();
     };

     const hoverContinueButton = () => {
          const storedLanguage = sessionStorage.getItem('language');
          if (storedLanguage === 'en') {
               setContinueButton(continueButton == continue_en ? continue_en_hover : continue_en);
          } else if (storedLanguage === 'ko') {
               setContinueButton(continueButton == continue_kr ? continue_kr_hover : continue_kr);
          } else if (storedLanguage === 'vi') {
               setContinueButton(continueButton == continue_vn ? continue_vn_hover : continue_vn);
          }
     }

     return (
          <div className='payment-result-container' style={{ backgroundImage: `url(${backround})` }}>
               <div style={{ backgroundImage: `url(${continueButton})` }} className="done-result-button" onClick={printFrameWithSticker} onMouseEnter={hoverContinueButton} onMouseLeave={hoverContinueButton}></div>
          </div>
     );
}

export default QR;