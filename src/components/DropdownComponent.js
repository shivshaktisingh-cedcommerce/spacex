import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { CircularProgress, MenuItem, Select } from '@mui/material';


export default function DropdownComponent(props) {
    const [tempOrder, setTempOrder] = useState(sessionStorage.getItem('order') || 'desc');

    const handleChange=(e)=>{
      setTempOrder(e.target.value);
       
    }
    const handleClick=()=>{
        props.setOrder(tempOrder)
        sessionStorage.setItem('order' ,tempOrder)
    }

  return (
    <div className="uppersection">
    <div>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={tempOrder}
          label="Sort by"
          onChange={handleChange}
        >
          <MenuItem value={'desc'}>desc</MenuItem>
          <MenuItem value={'asc'}>asc</MenuItem>
        </Select>
    </div>
    <Button variant ='contained' onClick={handleClick}>{props.loading?<CircularProgress color="inherit" />:"Submit"}</Button>
    </div>
  )
}
