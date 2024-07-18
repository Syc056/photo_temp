import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Card, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { getMyIp, getUser, postUser } from '../apis/device';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      <Link color="inherit" href="https://mui.com/">
        © Copyright 2024 PhotoMong
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function LoginPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [newId, setNewId] = useState("");
  const [newIp, setNewIp] = useState("");
  const [newPw, setNewPw] = useState("");

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json")
        const data = await response.json()
        setNewIp(data.ip)
      } catch (error) {
        console.error('Failed to fetch IP address', error);
      }
    };

    fetchIpAddress();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginData = {
      id: data.get("id"),
      password: data.get("password"),
    };
console.log("login data>>>",loginData)
    try {
      if (loginData.id === "photomong" && loginData.password === "123") {
        sessionStorage.setItem("user", loginData.id);
        sessionStorage.setItem("ip", "");
        navigate("/all-devices");
      } else {
        const existingUsers = await getUser();
        const userExists = existingUsers.filter(user => user.id === loginData.id && user.password === loginData.password);
        if (userExists.length>0) {
          sessionStorage.setItem("user", loginData.id);
          sessionStorage.setItem("ip", newIp);
          navigate("/store");
        } else {
          window.confirm("login fail");
        }
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
      window.confirm("Failed to login");
    }
  };

  const handleSignUpDialog = () => {
    setOpen(true);
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    const signupData = {
      id: newId,
      password: newPw,
      ip: newIp,
    };

    try {
      const existingUsers = await getUser();
      const userExists = existingUsers.filter(user => user.ip === newIp).length > 0;
      console.log("existing>>>", existingUsers)
      if (userExists) {
        window.confirm('User already exists');
      } else {
        const res = await postUser(signupData);
        console.log('회원가입 >>>', res.data);
        setOpen(false);
        setNewId("");
        // setNewIp("");
        setNewPw("");
        window.confirm('User created successfully');
      }
    } catch (error) {
      console.error('There was an error creating the user!', error);
      window.confirm('Failed to create user');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setNewId("");
    // setNewIp("");
    setNewPw("");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Card>
            <Box
              sx={{
                padding: "20px",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: "center"
              }}
            >
              <Typography component="h1" variant="h5">
                PhotoMong
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Typography>Username:</Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="id"
                  placeholder='Username'
                  id="id"
                  autoComplete="current-id"
                />
                <Typography>Password:</Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  placeholder='Password'
                  id="password"
                  autoComplete="current-password"
                  type="password"
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    LOGIN
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleSignUpDialog}
                  >
                    SIGN UP
                  </Button>
                </div>
              </Box>
            </Box>
          </Card>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>SIGN UP</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Typography>ID:</Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="id"
              placeholder='Username'
              id="signup-id"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              autoComplete="username"
            />
            <Typography>Password:</Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              placeholder='Password'
              type="password"
              id="signup-password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              autoComplete="current-password"
            />
            <Typography>IP Address:</Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="ip"
              placeholder='IP Address'
              id="signup-ip"
              value={newIp}
              InputProps={{
                readOnly: true,
              }}
            />
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                CANCEL
              </Button>
              <Button type="submit" color="primary" onClick={handleSignupSubmit}>
                SIGN UP
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
