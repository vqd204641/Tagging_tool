import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import axios from 'axios'
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

const InputLink = () =>{
	const [filePath,setFilePath] = useState('')
	const navigate = useNavigate() 


	return(
		<div style={{display:'block', width:'100%'}}>
			<div style={{margin:'auto', width:'50%'}} >
				<TextField style={{width: '100%'}}  id="outlined-basic" onChange={(value)=>{setFilePath(value.target.value)}} value={filePath} label="FileName" variant="outlined" />
			</div>
			<div style={{margin: 'auto', width:'100px'}} >
				<Button onClick={()=>{navigate('/taging/'+filePath)}}>Start</Button>
			</div>
		</div>
	);
}

export default InputLink