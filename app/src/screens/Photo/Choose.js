import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../translations/i18n';
import "../../css/Photo.css";
import continue_btn from '../../assets/Photo/Choose/continue_btn.png';
import continue_btn_click from '../../assets/Photo/Choose/continue_btn_click.png';
import photo_frame from '../../assets/Photo/Choose/photo_frame.png';

import background_en from '../../assets/Photo/Choose/BG.png';
import background_kr from '../../assets/Photo/Choose/kr/BG.png';
import background_vn from '../../assets/Photo/Choose/vn/BG.png';
import background_mn from '../../assets/Photo/Choose/mn/BG.png';

// Go Back
import goback_en from '../../assets/Common/goback.png';
import goback_en_hover from '../../assets/Common/gobackhover.png';
import goback_kr from '../../assets/Common/kr/goback.png';
import goback_kr_hover from '../../assets/Common/kr/gobackhover.png';
import goback_vn from '../../assets/Common/vn/goback.png';
import goback_vn_hover from '../../assets/Common/vn/gobackhover.png';
import goback_mn from '../../assets/Common/mn/goback.png';
import goback_mn_hover from '../../assets/Common/mn/gobackhover.png';
// Continue
import continue_en from '../../assets/Common/continue.png';
import continue_en_hover from '../../assets/Common/continue_click.png';
import continue_kr from '../../assets/Common/kr/continue.png';
import continue_kr_hover from '../../assets/Common/kr/continue_click.png';
import continue_vn from '../../assets/Common/vn/continue.png';
import continue_vn_hover from '../../assets/Common/vn/continue_click.png';
import continue_mn from '../../assets/Common/mn/continue.png';
import continue_mn_hover from '../../assets/Common/mn/continue_click.png';
import { getAudio, getClickAudio, getPhotos } from '../../api/config';

function Choose() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [hoveredImage, setHoveredImage] = useState(null);
    const [selectedLayout, setSelectedLayout] = useState(null);
    const [myBackground, setMyBackground] = useState(null);
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [selectedFrame, setSelectedFrame] = useState(null);
    const [confirmButton, setConfirmButton] = useState(false);
    const [background, setBackground] = useState(background_en);
    const parentRef = useRef(null);
    const [goBackButton, setGoBackButton] = useState([]);
    const [language, setLanguage] = useState(null);
    const [continueButton, setContinueButton] = useState(continue_en);

    const [clickedButton, setClickedButton] = useState(false);

    const [formattedPhotos, setFormattedPhotos] = useState([]);
    const uuid=sessionStorage.getItem("uuid")

//     const testGetPhotos = async () => {
//         const photos = await getPhotos(uuid);
//         if (photos && photos.images) {
//             const formattedImages = photos.images.map(img => ({
//                 ...img,
//                 url: img.url.replace(/\/\//g, '/')
//             }));
//             // const formattedImage = {
//             //     ...img,
//             //     url: `${process.env.REACT_APP_BACKEND}/serve_photo/${imageName}`
//             // };
// console.log("img urls>>>",formattedImages)
//             setFormattedPhotos(formattedImages);
//             sessionStorage.setItem('photos', JSON.stringify({ status: photos.status, images: formattedImages }));
//         }
//     };
const testGetPhotos = async () => {
    const photos = await getPhotos(uuid); // UUID를 이용하여 사진 목록을 가져옵니다.
    
    if (photos && photos.images) { // photos 객체와 그 안의 images 배열이 존재하는지 확인합니다.
        const formattedImages = photos.images.map(img => {
            const imageName = img.url.split('/').pop(); // URL에서 이미지 이름을 추출합니다.
            return {
                ...img,
                url: `${process.env.REACT_APP_BACKEND}/serve_photo/${uuid}/${imageName}` // 백엔드 URL 형식으로 변환합니다.
            };
        });
        
        // 변환된 이미지 URL을 다시 형식화하여 '/'를 기준으로 잘못된 부분을 수정합니다.
        const finalFormattedImages = formattedImages.map(img => ({
            ...img,
            url: img.url.replace(/\\/g, '/').replace('serve_photo', 'get_photo/uploads')
        }));
        
        console.log("Formatted image URLs:", finalFormattedImages);

        setFormattedPhotos(finalFormattedImages); // 상태에 변환된 이미지를 저장합니다.
        
        // 세션 스토리지에 사진 목록을 JSON 문자열 형태로 저장합니다.
        sessionStorage.setItem('photos', JSON.stringify({ 
            status: photos.status, 
            images: finalFormattedImages 
        }));
    } else {
        console.log("No photos available."); // 이미지가 존재하지 않는 경우 메시지를 출력합니다.
    }
};

    useEffect(() => {
        //사진 제대로 들어오는지 보기위한 테스트 코드
        testGetPhotos();
    }, []);

    useEffect(() => {
        const storedLanguage = sessionStorage.getItem('language');
        if (storedLanguage) {
            setLanguage(storedLanguage);
            if (storedLanguage === 'en') {
                setBackground(background_en);
                setContinueButton(continue_en_hover);
            } else if (storedLanguage === 'ko') {
                setBackground(background_kr);
                setContinueButton(continue_kr_hover);
            } else if (storedLanguage === 'vi') {
                setBackground(background_vn);
                setContinueButton(continue_vn_hover);
            }
            else if (storedLanguage === 'mn') {
                setBackground(background_mn);
                setContinueButton(continue_mn_hover);
            }
        }

        // Retrieve selected frame from session storage
        const storedSelectedFrame = JSON.parse(sessionStorage.getItem('selectedFrame'));
        if (storedSelectedFrame) {
            setSelectedFrame(storedSelectedFrame.frame);
        }

        const sessionSelectedLayout = sessionStorage.getItem('selectedLayout');
    
        if (sessionSelectedLayout) {
            const parsedSelectedLayout = JSON.parse(sessionSelectedLayout);
            console.log("photo choose urls>>>",parsedSelectedLayout[0])
            setMyBackground(parsedSelectedLayout[0].photo);
            setSelectedLayout(parsedSelectedLayout[0].photo_cover);
        }
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND}/frames/api/clear-images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(`Failed to clear images: ${error}`));
    }, []);

    const toggleSelection = (index) => {
        // Determine total photos
        let totalMeetsPhotos = 0;
        if (selectedFrame == 'Stripx2') {
            totalMeetsPhotos = 8;
        } else if (selectedFrame == '2cut-x2') {
            totalMeetsPhotos = 2;
        } else if (selectedFrame == '3-cutx2') {
            totalMeetsPhotos = 3;
        } else if (selectedFrame == '4-cutx2') {
            totalMeetsPhotos = 4;
        } else if (selectedFrame == '5-cutx2') {
            totalMeetsPhotos = 5;
        } else if (selectedFrame == '6-cutx2') {
            totalMeetsPhotos = 6;
        }

        const selectedIndex = selectedPhotos.indexOf(index);
        if (selectedIndex === -1 && selectedPhotos.length < totalMeetsPhotos) {
            if (selectedFrame == 'Stripx2') {
                         setSelectedPhotos([...selectedPhotos, index,index]);
            } else {
                setSelectedPhotos([...selectedPhotos, index]);
            }
   
        } else {
            setSelectedPhotos(selectedPhotos.filter((item) => item !== index));
        }

        if (selectedPhotos.length === totalMeetsPhotos - 1) {
            setConfirmButton(true);
        } else {
            setConfirmButton(false);
        }
    };

    const handleMouseEnter = (image) => {
        setHoveredImage(image);
    }

    const handleMouseLeave = () => {
        setHoveredImage(null);
    }

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

    const goToFilter = async () => {
        if (clickedButton) {
            return;
        }
        getClickAudio()
        sessionStorage.setItem('choosePhotos', JSON.stringify(selectedPhotos));

        // Determine total photos
        let totalMeetsPhotos = 0;
        if (selectedFrame == 'Stripx2') {
            totalMeetsPhotos = 8;
        } else if (selectedFrame == '2cut-x2') {
            totalMeetsPhotos = 2;
        } else if (selectedFrame == '3-cutx2') {
            totalMeetsPhotos = 3;
        } else if (selectedFrame == '4-cutx2') {
            totalMeetsPhotos = 4;
        } else if (selectedFrame == '5-cutx2') {
            totalMeetsPhotos = 5;
        } else if (selectedFrame == '6-cutx2') {
            totalMeetsPhotos = 6;
        }

        if (selectedPhotos.length === totalMeetsPhotos) {
            hoverContinueButton();
            setClickedButton(true);
            const result = await copyImageApi();
                navigate("/filter");
        }
    }

    const displayClassNameForBackground = () => {
        if (selectedFrame == '2cut-x2') {
            return 'left-choose-photos-2cut';
        } else if (selectedFrame == '4-cutx2') {
            return 'left-choose-photos-4cut';
        } else if (selectedFrame == '5-cutx2') {
            return 'left-choose-photos-5cut';
        } else {
            return 'left-choose-photos';
        }
    }

    const displayClassNameForLayout = () => {
        if (selectedFrame == '2cut-x2') {
            return 'left-choose-container-2cut';
        } else if (selectedFrame == '4-cutx2') {
            return 'left-choose-container-4cut';
        } else if (selectedFrame == '5-cutx2') {
            return 'left-choose-container-5cut';
        } else {
            return 'left-choose-container';
        }
    }

    const displayClassNameForPhoto = (rowIndex, photoIndex) => {
       console.log("six cuts>>>",selectedFrame)
        if (selectedFrame === 'Stripx2') {
            if (rowIndex === 0 && photoIndex === 0) {
                return 'choose-photo-item-0-0';
            } else if (rowIndex === 0 && photoIndex === 1) {
                return 'choose-photo-item-0-1';
            } else if (rowIndex === 1 && photoIndex === 0) {
                return 'choose-photo-item-1-0';
            } else if (rowIndex === 1 && photoIndex === 1) {
                return 'choose-photo-item-1-1';
            } else if (rowIndex === 2 && photoIndex === 0) {
                return 'choose-photo-item-2-0';
            } else if (rowIndex === 2 && photoIndex === 1) {
                return 'choose-photo-item-2-1';
            } else if (rowIndex === 3 && photoIndex === 0) {
                return 'choose-photo-item-3-0';
            } else if (rowIndex === 3 && photoIndex === 1) {
                return 'choose-photo-item-3-1';
            }
        } else if (selectedFrame === '6-cutx2') {
            if (rowIndex === 0 && photoIndex === 0) {
                return 'choose-photo-item6-0-0';
            } else if (rowIndex === 0 && photoIndex === 1) {
                return 'choose-photo-item6-0-1';
            } else if (rowIndex === 1 && photoIndex === 0) {
                return 'choose-photo-item6-1-0';
            } else if (rowIndex === 1 && photoIndex === 1) {
                return 'choose-photo-item6-1-1';
            } else if (rowIndex === 2 && photoIndex === 0) {
                return 'choose-photo-item6-2-0';
            } else if (rowIndex === 2 && photoIndex === 1) {
                return 'choose-photo-item6-2-1';
            }
        } else if (selectedFrame === '2cut-x2') {
            if (rowIndex === 0 && photoIndex === 0) {
                return 'choose-photo-item-2cut-0-0';
            } else if (rowIndex === 0 && photoIndex === 1) {
                return 'choose-photo-item-2cut-0-1';
            }
        } else if (selectedFrame === '3-cutx2') {
            if (rowIndex === 0 && photoIndex === 0) {
                return 'choose-photo-item-3cut-0-0';
            } else if (rowIndex === 0 && photoIndex === 1) {
                return 'choose-photo-item-3cut-0-1';
            } else if (rowIndex === 1 && photoIndex === 0) {
                return 'choose-photo-item-3cut-0-1';
            }
        } else if (selectedFrame === '4-cutx2') {
            if (rowIndex === 0 && photoIndex === 0) {
                return 'choose-photo-item-4cut-0-0';
            } else if (rowIndex === 0 && photoIndex === 1) {
                return 'choose-photo-item-4cut-0-1';
            } else if (rowIndex === 1 && photoIndex === 0) {
                return 'choose-photo-item-4cut-1-0';
            } else if (rowIndex === 1 && photoIndex === 1) {
                return 'choose-photo-item-4cut-1-1';
            }
        } else if (selectedFrame === '5-cutx2') {
            if (rowIndex === 0 && photoIndex === 0) {
                return 'choose-photo-item-5cut-0-0';
            } else if (rowIndex === 0 && photoIndex === 1) {
                return 'choose-photo-item-5cut-0-1';
            } else if (rowIndex === 1 && photoIndex === 0) {
                return 'choose-photo-item-5cut-1-0';
            } else if (rowIndex === 1 && photoIndex === 1) {
                return 'choose-photo-item-5cut-1-1';
            }
        }
        return 'choose-photo-item';
    }

    const chunkArray = (arr, size) => {
        return arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);
    };

    const hoverGoBackButton = (lang) => {
        if (lang === 'en') {
            setGoBackButton(goBackButton == goback_en_hover ? goback_en : goback_en_hover);
        } else if (lang === 'ko') {
            setGoBackButton(goBackButton == goback_kr_hover ? goback_kr : goback_kr_hover);
        } else if (lang === 'vi') {
            setGoBackButton(goBackButton == goback_vn_hover ? goback_vn : goback_vn_hover);
        } else if (lang === 'mn') {
            setGoBackButton(goBackButton == goback_mn_hover ? goback_mn : goback_mn_hover);
        }
    }
    const playAudio = async() => {
        const res=await getAudio({file_name:"choose_photos.wav"})
          }
   useEffect(()=>{
    playAudio()
   },[])
    const showSelectedPhotos = () => {
console.log("in frame photos>>>",selectedFrame)
        if (selectedFrame == '3-cutx2' && selectedPhotos.length > 0) {
            const firstPhotoTpl = (
                <div className="choose-photo-row">
                    <div
                        className="choose-photo-item-3cut-top-line"
                        style={{ backgroundImage: `url(${formattedPhotos[selectedPhotos[0]].url})`, transform:"scaleX(-1)" }}
                    />
                </div>
            )
            const selectedPhotoRows = chunkArray(selectedPhotos.slice(1), 2);
            return (
                [firstPhotoTpl, ...selectedPhotoRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="choose-photo-row">
                        {row.map((selectedIndex, photoIndex) => (
                            <div
                                key={photoIndex}
                                className={displayClassNameForPhoto(rowIndex, photoIndex)}
                                style={{ backgroundImage: `url(${formattedPhotos[selectedIndex].url})`, transform:"scaleX(-1)" }}
                            />
                        ))}
                    </div>
                ))]
            );
        } else if (selectedFrame == '5-cutx2' && selectedPhotos.length > 0) {
            if (selectedPhotos.length == 5) {
                const lastPhotoTpl = (
                    <div className="choose-photo-row">
                        <div
                            className="choose-photo-item-5cut-last-line"
                            style={{ backgroundImage: `url(${formattedPhotos[selectedPhotos[selectedPhotos.length - 1]].url})`, transform:"scaleX(-1)" }}
                        />
                    </div>
                )
                const selectedPhotoRows = chunkArray(selectedPhotos.slice(0, selectedPhotos.length - 1), 2);
                return (
                    [selectedPhotoRows.map((row, rowIndex) => (
                        <div key={rowIndex} className="choose-photo-row">
                            {row.map((selectedIndex, photoIndex) => (
                                <div
                                    key={photoIndex}
                                    className={displayClassNameForPhoto(rowIndex, photoIndex)}
                                    style={{ backgroundImage: `url(${formattedPhotos[selectedIndex].url})` , transform:"scaleX(-1)"}}
                                />
                            ))}
                        </div>
                    )), lastPhotoTpl]
                );
            } else {
                const selectedPhotoRows = chunkArray(selectedPhotos, 2);
                return (
                    [selectedPhotoRows.map((row, rowIndex) => (
                        <div key={rowIndex} className="choose-photo-row">
                            {row.map((selectedIndex, photoIndex) => (
                                <div
                                    key={photoIndex}
                                    className={displayClassNameForPhoto(rowIndex, photoIndex)}
                                    style={{ backgroundImage: `url(${formattedPhotos[selectedIndex].url})`, transform:"scaleX(-1)" }}
                                />
                            ))}
                        </div>
                    ))]
                );
            }

        }
      
        else if(selectedFrame==="6-cutx2") { 
            const selectedPhotoRows = chunkArray(selectedPhotos, 2);
            return (
                selectedPhotoRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="choose-photo-row">
                        {row.map((selectedIndex, photoIndex) => (
                            <div
                                key={photoIndex}
                                className={displayClassNameForPhoto(rowIndex, photoIndex)}
                                style={{ backgroundImage: `url(${formattedPhotos[selectedIndex].url})`, transform:"scaleX(-1)" }}
                            />
                        ))}
                    </div>
                ))
            );
        }
        else {
            
            const selectedPhotoRows = chunkArray(selectedPhotos, 2);
            return (
                selectedPhotoRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="choose-photo-row">
                        {row.map((selectedIndex, photoIndex) => (
                            <div
                                key={photoIndex}
                                className={displayClassNameForPhoto(rowIndex, photoIndex)}
                                style={{ backgroundImage: `url(${formattedPhotos[selectedIndex].url})`, transform:"scaleX(-1)" }}
                            />
                        ))}
                    </div>
                ))
            );
        }
    }

    const hoverContinueButton = () => {
        const storedLanguage = sessionStorage.getItem('language');
        if (storedLanguage === 'en') {
            setContinueButton(continueButton == continue_en ? continue_en_hover : continue_en);
        } else if (storedLanguage === 'ko') {
            setContinueButton(continueButton == continue_kr ? continue_kr_hover : continue_kr);
        } else if (storedLanguage === 'vi') {
            setContinueButton(continueButton == continue_vn ? continue_vn_hover : continue_vn);
        }else if (storedLanguage === 'mn') {
            setContinueButton(continueButton == continue_mn ? continue_mn_hover : continue_mn);
        }
    }

    return (
        <div className='photo-choose-container' style={{ backgroundImage: `url(${background})` }}>
            <div className="go-back" style={{ backgroundImage: `url(${goBackButton})` }} onClick={() => navigate("/photo")} onMouseEnter={() => hoverGoBackButton(language)} onMouseLeave={() => hoverGoBackButton(language)}></div>
            <div className="left-big-frame-11">
                {/* 프레임속 회색네모 갯수만큼 나오는 곳 */}
                <div ref={parentRef} className={displayClassNameForBackground()} style={{ backgroundImage: `url(${myBackground})` }}>
                    {showSelectedPhotos()}
                </div>
                <div className={displayClassNameForLayout()} style={{ backgroundImage: `url(${selectedLayout})`}}></div>
            </div>
            <div className="right-choose-container">
                {chunkArray(formattedPhotos.slice(-8), 4).map((group, index) => (
                    <div key={index} className="choose-line">
                        {group.map((photo, photoIndex) => (
                            <div
                                key={photoIndex}
                                className={`choose-image ${selectedPhotos.includes(photo.id)?"clicked":""}`}
                                style={{ backgroundImage: `url(${photo.url})`, transform:"scaleX(-1)" }}
                                onClick={() => toggleSelection(photo.id)}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div
                className="bottom_choose_container"
                style={{ backgroundImage: `url(${continueButton})` }}                    
                onClick={goToFilter}
            ></div>
        </div>
    );
}

export default Choose;
