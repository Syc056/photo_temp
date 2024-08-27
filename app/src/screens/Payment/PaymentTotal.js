import React, { useEffect, useState, useRef } from 'react';
import background_en from '../../assets/PaymentTotal/BG.png';
import background_vn from '../../assets/PaymentNum/Common/vn/BG.png';
import backgrond_kr from '../../assets/PaymentNum/Common/kr/BG.png';
import backgrond_mn from '../../assets/PaymentNum/Common/mn/BG.png';
//btns
import numField from '../../assets/Common/number-field.png';
import priceField from '../../assets/Common/price-field.png';
import checkBox from '../../assets/Common/check-box.png';
import minusDefault from '../../assets/Common/minus-default.png';
import minusPressed from '../../assets/Common/minus-pressed.png';
import plusDefault from '../../assets/Common/plus-default.png';
import plusPressed from '../../assets/Common/plus-pressed.png';
import confirmDefault from '../../assets/Common/confirm-default.png';
import confirmPressed from '../../assets/Common/confirm-pressed.png';

import goback_en from '../../assets/Common/goback.png';
import goback_en_hover from '../../assets/Common/gobackhover.png';
import goback_kr from '../../assets/Common/kr/goback.png';
import goback_kr_hover from '../../assets/Common/kr/gobackhover.png';
import goback_vn from '../../assets/Common/vn/goback.png';
import goback_vn_hover from '../../assets/Common/vn/gobackhover.png';
import goback_mn from '../../assets/Common/mn/goback.png';
import goback_mn_hover from '../../assets/Common/mn/gobackhover.png';
import { useNavigate } from 'react-router-dom';
// Confirm
import confirm_en from '../../assets/Frame/Layout/confirm.png';
import confirm_en_hover from '../../assets/Frame/Layout/confirm_click.png';
import confirm_kr from '../../assets/Frame/Layout/Confirm/kr/confirm.png';
import confirm_kr_hover from '../../assets/Frame/Layout/Confirm/kr/confirm_click.png';
import confirm_vn from '../../assets/Frame/Layout/Confirm/vn/confirm.png';
import confirm_vn_hover from '../../assets/Frame/Layout/Confirm/vn/confirm_click.png';
import confirm_mn from '../../assets/Frame/Layout/Confirm/mn/confirm.png';
import confirm_mn_hover from '../../assets/Frame/Layout/Confirm/mn/confirm_click.png';
import { getClickAudio, sendDongNum } from '../../api/config';

function PaymentTotal(props) {
  const [background, setBackground] = useState(background_en);
  const [minusBtn, setMinusBtn] = useState(minusDefault)
  const [plusBtn, setPlusBtn] = useState(plusDefault)
  const [photoNum, setPhotoNum] = useState(1)
  const [goBackBg, setGoBackBg] = useState([]);
  const [language, setLanguage] = useState(null);
  const [check, setCheck] = useState(false)
  const [confirmButton, setConfirmButton] = useState(confirm_en);
  const [confirmHoverButton, setConfirmHoverButton] = useState(confirm_en_hover);
  const [confirmClick, setConfirmClick] = useState(false);
  const [confirmUrl, setConfirmUrl] = useState(confirmDefault)
  const navigate = useNavigate()
  const timerRef = useRef(null);
  const [countdown, setCountdown] = useState(20);
  const uuid = sessionStorage.getItem("uuid")

  const hoverGoBackBtn = (goBackBG) => {
    if (goBackBG === 'ko') {
      setGoBackBg(goBackBg === goback_kr ? goback_kr_hover : goback_kr);
    } else if (goBackBG === 'vi') {
      setGoBackBg(goBackBg === goback_vn ? goback_vn_hover : goback_vn);
    }
    else if (goBackBG === 'mn') {
      setGoBackBg(goBackBg === goback_mn ? goback_mn_hover : goback_mn);
    }
    else {
      setGoBackBg(goBackBg === goback_en ? goback_en_hover : goback_en);
    }
  }
  useEffect(() => {
    const lang = sessionStorage.getItem("language")
    setLanguage(lang)
    if (lang === "ko") {
      setBackground(backgrond_kr)
      setGoBackBg(goback_kr);
      setConfirmButton(confirm_kr)
    }
    else if (lang === "vi") {
      setBackground(background_vn)
      setGoBackBg(goback_vn);
      setConfirmButton(confirm_vn)
    }
    else if (lang === "mn") {
      setBackground(backgrond_mn)
      setGoBackBg(goback_mn);
      setConfirmButton(confirm_mn)
    }
    setMinusBtn(minusDefault)
  }, [])

  useEffect(() => {
    if (uuid) {
      startTimer();
    }
  }, [uuid]);

  const onCheck = () => {
    setCheck(p => !p)
  }
  const onAdd = () => {
    getClickAudio()
    setPhotoNum(p => (p < 10 ? p + 1 : p));
  };

  const onMinus = () => {
    getClickAudio()
    setPhotoNum(p => (p > 1 ? p - 1 : p));
  };
  const goToPayment = async () => {
    getClickAudio()
    navigate('/payment');
  }
  const onMouseConfirmEnter = (lang) => {
    if (lang === "kr") {
      setConfirmButton(confirm_kr_hover)
    }
  }
  const onMouseConfirmLeave = (lang) => {
    if (lang === "kr") {
      setConfirmButton(confirm_kr)
    }
  }
  const onMouseMinusEnter = () => {
    setMinusBtn(minusPressed)
  }
  const onMouseMinusLeave = () => {
    setMinusBtn(minusDefault)
  }
  const onMousePlusEnter = () => {
    setPlusBtn(plusPressed)
  }
  const onMousePlusLeave = () => {
    setPlusBtn(plusDefault)
  }
  const getDong = () => {
    const totalPayMoney = sessionStorage.getItem("totalPayMoney");
    return totalPayMoney;
  }

  const startTimer = () => {
    timerRef.current = setInterval(async () => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 0) {
          return prevCountdown - 1;
        } else {
          navigate("/payment");
        }
      });
    }, 1000);
  };

  return (
    <div
      className='payment-number-container'
      style={{ backgroundImage: `url(${background})` }}
    >
      <div
        className='payment-number-center'

      >
        <div className="price-field-total" style={{ backgroundImage: `url(${priceField})` }} >

          <div
            className='price-total'
          >{getDong()}đ</div>
        </div>
      </div>
      <div className='payment-countdown'>{countdown}s</div>
      <div
        className="payment-number-confirm-layout-button"
        style={{
          backgroundImage: `url(${confirmButton})`,
        }}
        onClick={(e) => { goToPayment() }}

        onMouseEnter={() => {
          onMouseConfirmEnter(language)
        }}
        onMouseLeave={() => { onMouseConfirmLeave(language) }}
      ></div>
    </div>
  );
}

export default PaymentTotal;