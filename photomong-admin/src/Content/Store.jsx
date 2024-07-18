import React, { useEffect, useState } from 'react';
import "./AllDevice.css";
import { Button, Card, CardContent, Chip, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeviceTable from '../Components/DeviceTable';
import LogTable from '../Components/LogTable';
import moment from 'moment';
import { getLogs } from '../apis/device';
import { useRecoilState } from 'recoil';
import { totalSalesAtom } from '../atom/atom';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Chart.js 모듈 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function Store(props) {
    const navigate = useNavigate();
    const [deiviceInfos, setDeviceInfos] = useState([]);
    const today = moment().format("YYYY-MM-DD");
    const [searchDate, setSearchDate] = useState(today);
    const [logs, setLogs] = useState([]);
    const [totalPro, setTotalPro] = useState("");
    const [pro, setPro] = useState("");
    const [totalSales, setTotalSales] = useRecoilState(totalSalesAtom);
    const [startDate, setStartDate] = useState(moment().startOf('month').format("YYYY-MM"));
    const [endDate, setEndDate] = useState(moment().endOf('month').format("YYYY-MM"));
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Amount of Payment',
            data: [],
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1
        }]
    });
    const [totalInRange, setTotalInRange] = useState(0);
    const [totalOverall, setTotalOverall] = useState(0);

    const formattedPaymentTime = (dateStr) => {
        const dt = moment(dateStr).format("YYYY-MM-DD hh:mm:ss");
        return dt === "Invalid date" ? "-" : dt;
    };

    const fetchLogs = async (searchDate) => {
        const res = await getLogs();
        const filtered = res.filter(log => log.payment_time && formattedPaymentTime(log.payment_time).includes(searchDate));
        const totalProNum = res.filter(it => it.payment_method === "promo").length;
        setTotalPro(totalProNum);
        const pro = filtered.filter(it => it.payment_method === "promo").length;
        setPro(pro);
        setLogs(filtered);
    };

    const fetchChartData = async (startDate, endDate) => {
        const res = await getLogs();
        const start = moment(startDate).startOf('month');
        const end = moment(endDate).endOf('month');
        const months = [];

        while (start.isBefore(end)) {
            months.push(start.format('YYYY-MM'));
            start.add(1, 'month');
        }

        const data = res.reduce((acc, log) => {
            const month = moment(log.payment_time).format('YYYY-MM');
            if (!acc[month]) {
                acc[month] = 0;
            }
            acc[month] += log.payment_amount;
            return acc;
        }, {});

        const labels = months;
        const amounts = months.map(month => data[month] || 0);

        setChartData({
            labels,
            datasets: [{
                label: 'Amount of Payment',
                data: amounts,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        });

        const totalInRange = amounts.reduce((sum, amount) => sum + amount, 0);
        setTotalInRange(totalInRange);

        const totalOverall = res.reduce((sum, log) => sum + log.payment_amount, 0);
        setTotalOverall(totalOverall);
    };

    useEffect(() => {
        fetchLogs(searchDate);
    }, [searchDate]);

    useEffect(() => {
        fetchChartData(startDate, endDate);
    }, [startDate, endDate]);

    const handleDateChange = (setter) => (event) => {
        setter(event.target.value);
    };

    return (
        <div className='all-device-content' style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Card variant='outlined' sx={{ borderRadius: 0, flex: 1, marginBottom: '10px' }}>
                    <CardContent style={{ height: '500px' }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Typography>Logs</Typography>
                            <div style={{ flex: 1 }} />
                            <Chip label={`Total number of promo code uses: ${totalPro}`} />
                            <Typography></Typography>
                            <div style={{ width: "30px" }} />
                            <Chip label={`Number of promo code uses by date: ${pro}`} />
                            <div style={{ width: "30px" }} />
                            <TextField
                                size='small'
                                type='date'
                                value={searchDate}
                                onChange={(e) => {
                                    const selDate = e.target.value;
                                    setSearchDate(selDate);
                                }}
                            />
                        </div>
                        <div style={{ height: 'calc(100% - 50px)', overflowY: 'auto' }}>
                            <LogTable logs={logs} searchDate={searchDate} />
                        </div>
                    </CardContent>
                </Card>
                <Card variant='outlined' sx={{ borderRadius: 0, flex: 1, marginBottom: '10px' }}>
                    <CardContent style={{ height: '500px' }}>
                        <Typography>Devices List</Typography>
                        <div style={{ height: 'calc(100% - 50px)', overflowY: 'auto' }}>
                            <DeviceTable />
                        </div>
                    </CardContent>
                </Card>
                <Card variant='outlined' sx={{ borderRadius: 0, flex: 1, marginBottom: '10px'  }}>
                    <CardContent style={{ height: '500px' }}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                            <Typography>Amount of Payment Chart</Typography>
                            <div style={{ flex: 1 }} />
                            <Typography>Range Sum: {totalInRange}</Typography>
                            <div style={{ width: "30px" }} />
                            <Typography>Overall Sum: {totalOverall}</Typography>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                            <TextField
                                label="Start Date"
                                type="month"
                                value={startDate}
                                onChange={handleDateChange(setStartDate)}
                                size="small"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <div style={{ width: "30px" }} />
                            <TextField
                                label="End Date"
                                type="month"
                                value={endDate}
                                onChange={handleDateChange(setEndDate)}
                                size="small"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                        <div style={{ position: "relative", width: "100%", height: "calc(100% - 100px)", overflowY: 'auto' }}>
                            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Store;
