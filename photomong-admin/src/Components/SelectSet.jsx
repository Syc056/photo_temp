import React from 'react';
import "./Set.css"
import { MenuItem, Select, TextField, Typography } from '@mui/material';
function SelectSet({title,placeholder=""}) {
    return (
        <div
        className='set'
        >
            <Typography variant='h5'>{title}</Typography>
            <Select
            placeholder={placeholder===""?title:placeholder}
            >
<MenuItem>select 1</MenuItem>

            </Select>
        </div>
    );
}

export default SelectSet;