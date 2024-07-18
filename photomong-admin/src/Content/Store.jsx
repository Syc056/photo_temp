import React, { useEffect, useState } from 'react';
import "./AllDevice.css"
import { Button, Card, CardContent, Chip, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeviceTable from '../Components/DeviceTable';
import LogTable from '../Components/LogTable';
import moment from 'moment';
import { getLogs } from '../apis/device';
import { useRecoilState } from 'recoil';
import { totalSalesAtom } from '../atom/atom';
function Store(props) {
    const navigate=useNavigate()
    const [deiviceInfos,setDeviceInfos]=useState([])
    const today=moment().format("YYYY-MM-DD")
    const [searchDate,setSearchDate]=useState(today)
    const [logs,setLogs]=React.useState([])
    const [totalPro,setTotalPro]=useState("")
    const [pro,setPro]=useState("")
    const [totalSaeles,setTotalSales]=useRecoilState(totalSalesAtom)
    const formattedPaymentTime=(dateStr)=>{
        const dt=moment(dateStr).format("YYYY-MM-DD hh:mm:ss")//new Date(dateStr)
        console.log("date time>>>",dt)
        return dt==="Invalid date"?"-":dt
      
      }
    const fetchLogs = async (searchDate) => {
      const res = await getLogs()
    
      const filtered=res.filter(log=>log.payment_time&&formattedPaymentTime(log.payment_time).includes(searchDate))
      console.log("logs>>>",res,filtered,searchDate)
      const totalProNum=res.filter(it=>it.payment_method==="promo").length
      setTotalPro(totalProNum)
      const pro=filtered.filter(it=>it.payment_method==="promo").length
      setPro(pro)
      setLogs(filtered)
    };
    React.useEffect(() => {
      fetchLogs(searchDate)
    }, [searchDate]);
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
            <Typography>Total Sales : {totalSaeles}</Typography>
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
                <CardContent>
           <div
           style={{
            display:"flex",
            alignItems:"center"
           }}
           ><Typography>Logs</Typography><div
           style={{
            flex:1
           }}
           />
           <Chip
           label={`Total number of promo code uses: ${totalPro}`}
           />
           <Typography></Typography>
           <div
           style={{
            width:"30px"
           }}
           />
            <Chip
           label={`Number of promo code uses by date: ${pro}`}
           />
           <div
           style={{
            width:"30px"
           }}
           />
           <TextField
           size='small'
           type='date'
           value={searchDate}
           onChange={(e)=>{
            const selDate=e.target.value
            setSearchDate(selDate)
           }}
           />
           </div>
           
                <LogTable 
                logs={logs}
                searchDate={searchDate}/>
                
                </CardContent>
                </Card>
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