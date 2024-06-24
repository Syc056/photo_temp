import React from 'react';
import "./Set.css"
import { Button, TextField, Typography } from '@mui/material';
function TxtfieldSet({value,onChange,title,placeholder="",useBtn=false,btnTitle,onClick}) {
    return (
        <div
        className='set'
        >
            <Typography variant='h5'>{title}</Typography>
            <div
            style={{
                display:"flex",
                gap: "30px",
                width:"100%"
            }}
            ><TextField
            sx={{
                width:"100%"
            }}
            value={value}
            onChange={onChange}
            placeholder={placeholder===""?title:placeholder}
            />
            {useBtn&&<Button
            color='error'
            variant='outlined'
            onClick={onClick}
            >{btnTitle}</Button>}
            </div>
            
        </div>
    );
}

export default TxtfieldSet;