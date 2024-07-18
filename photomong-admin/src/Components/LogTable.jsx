import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Popover, Typography } from '@mui/material';
import { getDeivceInfo, getLogs, putDeleteDevice } from '../apis/device';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export default function LogTable({searchDate,logs}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedPromotionCodes, setSelectedPromotionCodes] = React.useState([]);
 
  const navigate = useNavigate();



const formattedPaymentTime=(dateStr)=>{
  const dt=moment(dateStr).format("YYYY-MM-DD hh:mm:ss")//new Date(dateStr)
  console.log("date time>>>",dt)
  return dt==="Invalid date"?"-":dt

}
  const handleMoreClick = (event, promotionCodes) => {
    setAnchorEl(event.currentTarget);
    setSelectedPromotionCodes(promotionCodes);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const userId=sessionStorage.getItem("user")
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell align="left">Payment time</TableCell>
          <TableCell align="left">Device</TableCell>
          <TableCell align="left">Device Code</TableCell>
            <TableCell align="left">Amount of payment</TableCell>
            <TableCell align="center" width={150}>
            Payment method</TableCell>
          
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align="left">{formattedPaymentTime(row.payment_time)??"-"}</TableCell>
              <TableCell align="left">{row.device??"-"}</TableCell>
              <TableCell align="left">{row.device_code??"-"}</TableCell>
              <TableCell align="left">{row.payment_amount??"-"}</TableCell>
              <TableCell align="left">{row.payment_method??"-"}</TableCell>
              
             
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Promotion Codes</Typography>
          {selectedPromotionCodes.slice(1).map((code, index) => (
            <Typography
            sx={{
              marginTop:"20px"
            }}
            key={index}>{code}</Typography>
          ))}
        </Paper>
      </Popover>
    </TableContainer>
  );
}
