import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {/* {'Copyright © '} */}
      <Link color="inherit" href="https://mui.com/">
      © Copyright2024PhotoMong
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function LoginPage() {
    const navigate=useNavigate()

  const handleSubmit = async(event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
//  const users=await fetchUsers()
console.log("data>>>",data)
if (data.get("id")==="photomong"&&data.get("password")==="123") {
    sessionStorage.setItem("user",data.get("id"))
    navigate("/all-devices")
} 
else{
    window.confirm("login fail")
}


  }

// const handleLogin=()=>{}
  return (
    <ThemeProvider theme={defaultTheme}>
        <div
        style={{
            display:"flex",
            alignItems:"center",
            width:"100%",
            height:"100vh",
       
        }}
        > <Container component="main" maxWidth="xs"
      sx={{
      }}
      >
        <CssBaseline />
        <Card
        >  <Box
          sx={{
            // marginTop: 8,
            padding:"20px",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent:"center"
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
            //   label="비밀번호"
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
            //   label="비밀번호"
            placeholder='Password'
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box></Card>
      
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container></div>
     
    </ThemeProvider>
  );
}