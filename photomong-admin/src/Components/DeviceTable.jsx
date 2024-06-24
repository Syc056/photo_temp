import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Popover, Typography } from '@mui/material';
import { getDeivceInfo, putDeleteDevice } from '../apis/device';
import { useNavigate } from 'react-router-dom';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export default function DeviceTable() {
  const [deviceInfo, setDeviceInfo] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedPromotionCodes, setSelectedPromotionCodes] = React.useState([]);
  const navigate = useNavigate();

  const fetchDeviceInfo = async () => {
    const res = await getDeivceInfo();
    setDeviceInfo(res);
  };

  React.useEffect(() => {
    fetchDeviceInfo();
  }, []);

  const deleteDevice = async (id) => {
    const res = window.confirm("Are you sure you want to delete?");
    if (res) {
      const res = await putDeleteDevice(id);
      if (res[1] === 200) {
        window.confirm("delete success");
        fetchDeviceInfo();
      } else {
        window.confirm("delete fail");
      }
    }
  };

  const handleMoreClick = (event, promotionCodes) => {
    setAnchorEl(event.currentTarget);
    setSelectedPromotionCodes(promotionCodes);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Device</TableCell>
            <TableCell align="left">Device Code</TableCell>
            <TableCell align="left">Remaining amount</TableCell>
            <TableCell align="center" width={150}>Promotion Code</TableCell>
            <TableCell align="left" width={250}></TableCell>
            <TableCell align="left">IP</TableCell>
            <TableCell align="left">Sales</TableCell>
            <TableCell align="left"></TableCell>
            <TableCell align="left"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deviceInfo.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align="left">{row.name}</TableCell>
              <TableCell align="left">{row.device_code}</TableCell>
              <TableCell align="left">{row.remaining_amount}</TableCell>
              <TableCell align="center">
                {row.promotion_code[0]}{row.promotion_code.length > 1 ? "..." : ""}
              </TableCell>
              <TableCell align="left">
                {row.promotion_code.length > 1 ? (
                  <Button onClick={(e) => handleMoreClick(e, row.promotion_code)}>MORE+</Button>
                ) : null}
              </TableCell>
              <TableCell align="left">{row.ip}</TableCell>
              <TableCell align="left">{row.sales}</TableCell>
              <TableCell align="left">
                <Button
                  variant='outlined'
                  sx={{ width: "100px" }}
                  onClick={() => {
                    sessionStorage.setItem("editRow", JSON.stringify(row));
                    navigate(`/edit-device/:${row.id}`);
                  }}
                >
                  Edit
                </Button>
              </TableCell>
              <TableCell align="left">
                <Button
                  variant='outlined'
                  color='error'
                  sx={{ width: "100px" }}
                  onClick={() => { deleteDevice(row.id) }}
                >
                  DELETE
                </Button>
              </TableCell>
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
