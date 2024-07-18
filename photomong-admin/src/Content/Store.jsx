import React, { useEffect, useState } from 'react';
import "./AllDevice.css"
import { Button, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeviceTable from '../Components/DeviceTable';
function Store(props) {
    const navigate=useNavigate()
    const [deiviceInfos,setDeviceInfos]=useState([])
    useEffect(()=>{
//여기서 디바이스 정보 가져오기

    },[])
    return (
        <div
        className='all-device-content'
        >
            <div
            className='row'
            > <Typography>Store Information</Typography>
            <div
            style={{
                flex:1
            }}
            />
            <Typography>Total Sales : 5,000,000</Typography>
            <div
            style={{
                width:"30px"
            }}
            />
            <Button
            variant='contained'
            onClick={()=>{
navigate("/add-device")
            }}
            >Add Device</Button>
            </div>
           
            <Card
            variant='outlined'
            sx={{
                borderRadius:0
            }}
            >
                <CardContent><Typography>Devices List</Typography>
                <DeviceTable/>
                
                </CardContent>
                </Card>
        </div>
    );
}

export default Store;