import React, { useState } from 'react';
import "./AddDevice.css"
import TxtfieldSet from '../Components/TxtfieldSet';
import SelectSet from '../Components/SelectSet';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { postAddDeivce } from '../apis/device';
function AddDevice(props) {
    const navigate=useNavigate()
    const [name,setName]=useState("")
    const [code,setCode]=useState("")
    const [remain,setRemain]=useState("")
    const [ip,setIp]=useState("")
    const [promotionCodes,setPromotionCodes]=useState("")
    const [sales,setSales]=useState("")
    const [newPromotionCode,setNewPromotionCode]=useState("")
    const onChangeNewPromo = (e) => {
        const inputValue = e.target.value;
        // 정규식을 사용하여 숫자만 입력되도록 확인
        if (/^\d*$/.test(inputValue)) {
            if (inputValue.length<=8) {
                 // 입력된 값이 숫자인 경우에만 설정
            setNewPromotionCode(inputValue);
            }
           
        }
    }
    const addDevice=async()=>{
        const addCondition=
        name.trim()!=""&&
        code.trim()!=""&&
        remain.trim()!=""&&
        ip.trim()!=""&&
        // promotionCode.trim()!=""&&
        sales.trim()!=""
if (addCondition) {
     const newPayload={
            name:name,
            ip:ip,
            device_code:code,
            remaining_amount:remain,
            promotion_code:promotionCodes,
            sales:sales,
        }
        const res=await postAddDeivce(newPayload)
console.log('디바이스 추가!!',res)
if (res[1]===201) {
    window.confirm("add success")
    navigate("/all-devices")
} else {
    window.confirm("fail")
}
} else {
    window.confirm("Please enter all device information")
}
       
    }
    const onChangeName=(e)=>{
        setName(e.target.value)
    }
    const onChangeCode=(e)=>{
        setCode(e.target.value)
    }
    const onChangeRemain=(e)=>{
        setRemain(e.target.value)
    }
    const onChangePromotionCode=(e,idx)=>{
        const copied=[...promotionCodes]
        copied[idx]=e.target.value
        setPromotionCodes(copied)
    }
    const onDeletePromotionCode=(e,idx)=>{
        // const copied=[...promotionCodes]
        // copied[idx]=e.target.value
        const filtered=promotionCodes.filter((code,cIdx)=>cIdx!=idx)
        setPromotionCodes(filtered)
    }
    const onChangeSales=(e)=>{
        setSales(e.target.value)
    }
    const onChangeIp=(e)=>{
        setIp(e.target.value)
    }
    return (
        <div
             className='add-device-content'
        >
            <TxtfieldSet 
            value={name}
            onChange={onChangeName}
            title={"Name"}/>
            <TxtfieldSet 
            value={code}
            onChange={onChangeCode}
            title={"Code"} placeholder="Device Code"/>
            <TxtfieldSet
            value={remain}
            onChange={onChangeRemain}
            title={"Remaining amount"}/>
                <TxtfieldSet
            value={ip}
            onChange={onChangeIp}
            title={"IP"}/>
       <div
          style={{
            display:"flex",
            flexDirection:"row",
            gap:"20px"
          }}
          >
            <TextField
            size='small'
            value={newPromotionCode}
            onChange={onChangeNewPromo}
            inputProps={{
                style:{
                    width:"500px"
                }
            }}
            />   <Button
          variant='contained'
          sx={{
            width:"260px"
          }}
          onClick={()=>{
            if (newPromotionCode.toString().trim().length < 8) {
                window.confirm("The promotion code must be 8 digits.");
                return; // 코드가 8자리 미만이면 함수 종료
            }
            // 프로모션 코드가 8자리 이상이면 추가
            setPromotionCodes(p=>[newPromotionCode,...p]);
            setNewPromotionCode("");
          }}
          >ADD PROMOTION CODE</Button></div>
          
            {promotionCodes&&promotionCodes.map((p,idx)=><TxtfieldSet 
            value={p}
            onChange={(e)=>{onChangePromotionCode(e,idx)}}
            title={`Promotion Code ${promotionCodes.length-idx}`}
            useBtn
            btnTitle={"DELETE"}
            onClick={(e)=>{onDeletePromotionCode(e,idx)}}
            />)}
            <TxtfieldSet 
            value={sales}
            onChange={onChangeSales}
            title={"Sales"}/>
            {/* <TxtfieldSet  title={"Photo Work Time"}/>
            <TxtfieldSet  title={"Product Price"}/>
            <TxtfieldSet  title={"Contact Number"}/>
            <SelectSet title={"Status"}/> */}
            <div
            className='action-area'
            >
<Button
variant='contained'
onClick={addDevice}
>Submit</Button>
<Button
variant='contained'
onClick={()=>{
    navigate(-1)
}}
>Cancel</Button>

            </div>
            </div>
    );
}

export default AddDevice;