import React, { useEffect, useState } from 'react';
import "./AddDevice.css"
import TxtfieldSet from '../Components/TxtfieldSet';
import SelectSet from '../Components/SelectSet';
import { Button, Divider, TextField } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { postAddDeivce, putAddDeivce, putEditDeivce } from '../apis/device';
function EditDevice(props) {
    const { id } = useParams();
    const navigate=useNavigate()
    const location=useLocation()
    const [name,setName]=useState("")
    const [code,setCode]=useState("")
    const [remain,setRemain]=useState("")
    const [ip,setIp]=useState("")
    const [promotionCodes,setPromotionCodes]=useState([])
    const [sales,setSales]=useState("") 
    const [newPromotionCode,setNewPromotionCode]=useState("")
    const editRow=JSON.parse(sessionStorage.getItem("editRow"))
    useEffect(()=>{

       setIp(editRow.ip)
        setName(editRow.name)
        setCode(editRow.device_code)
        setRemain(editRow.remaining_amount)
        setPromotionCodes(editRow.promotion_code)
        setSales(editRow.sales)
        console.log("edit row",editRow)
    },[])
    const editDevice=async(id)=>{
        const editCondition=
        name.toString().trim()!=""&&
        code.toString().trim()!=""&&
        remain.toString().trim()!=""&&
        ip.toString().trim()!=""&&
        // promotionCode.toString().trim()!=""&&
        sales.toString().trim()!=""
if (editCondition) {
     const newPayload={
            name:name,
            device_code:code,
            remaining_amount:remain,
            promotion_code:promotionCodes,
            ip:ip,
            sales:sales,
        }
        // const idx=parseInt(id.split(":")[1])+1
        const res=await putEditDeivce(newPayload,id)
console.log('디바이스 수정!!',res)
if (res[1]===200) {
    window.confirm("edit success")
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
    const onChangeSales=(e)=>{
        setSales(e.target.value)
    }
    const onChangeIp=(e)=>{
        setIp(e.target.value)
    }
    // const onChangeNewPromo = (e) => {
    //     // Ensure newPromotionCode is 8 characters long
    //     if (e.target.value.length <= 8) {
    //         setNewPromotionCode(e.target.value)
    //     }
    // }
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
    const onDeletePromotionCode=(e,idx)=>{
        // const copied=[...promotionCodes]
        // copied[idx]=e.target.value
        const filtered=promotionCodes.filter((code,cIdx)=>cIdx!=idx)
        setPromotionCodes(filtered)
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
            width:"100%",
            height:"1px",
            backgroundColor:"black"
          }}
          />
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
            />
            <Button
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
onClick={()=>{editDevice(editRow.id)}}
>SAVE</Button>
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

export default EditDevice;