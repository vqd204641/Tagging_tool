import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import axios from 'axios'
// import _default from '@mui/material/styles/identifier';
// import address from '/Users/vinhkhaitruong/Documents/Wanderlust/StartUp_FirstDraft/dataScraping/fbData/hanoiAnGiODau.json'
// import fs from 'fs-extra'
// import * from 'browserify-fs' as fs
// @ts-ignore


const keyTag = {
 
		 'r':'RestaurantName',
		 'a':'AttractionName',
		 'c':'AccomodationName',
		 'v': 'Address',
		 'h':'Activity',
		 'p':'Price',
		 'u':'Unit',
		 'd': "Description",
		 'q':"Regulation",
		 'l':"Contact",
		 'f':"Food",
		't': "time",
		'm':'tips'
}

const colorTag = {
	'r': 'red',
	'a': '#FF461F',
	 'c': '#F47983',
	 'v': '#FF143c',
	 'h': '#FFC773',
	 'p': '#70F3FF',
	 'u': '#4B5CC4',
	 'd': "#BCE672",
	 'q': "#75664D",
	 'l': "#FF2D51",
	 'f': "#DB5A6B",
	't': "#FFA631",
	'm': 'blue'
}



const TaggingTool = () => {

  const [selectedWords, setSelectedWords] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0)
  const [data, setData] = useState([])
  const [tagData, setTagData] = useState([])
  const [colorData, setColorData] = useState([])
  const [selectedText, setSelectedText] = useState("")
  const [range, setRange] = useState([])
  const [selectedEntity, setSelectedEntity] = useState([])
  const [dependence, setDependence] = useState([])
  const [dependenceData, setDependenceData] = useState([])

  const [undoStack, setUndoStack] = useState([]);


  const LOCAL_STORAGE_KEY = 'tagging_tool_data';


  const saveToLocalStorage = (tempData, tempColorData, tempTagData, tempDependenceData, tempDependence) => {
    const currentState = {
      data: [...tempData],
      tagData: [...tempTagData],
      colorData: [...tempColorData],
      selectedWords: [...selectedWords],
      dependenceData:[...tempDependenceData],
      dependence: [...tempDependence],
      selectedText,
      range,
      currentIndex
    };

    console.log(currentState)
    // Save the current state to local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentState));

  };

  
//   const clearLocalStorage = () => {
//     // Clear the local storage data
//     localStorage.removeItem(LOCAL_STORAGE_KEY);
//   };


    
      const undo = () => {

	if(undoStack.length > 0){
	
		let state = undoStack.pop()
		setData([...state.prevData])
		setColorData([...state.prevColor])
		setTagData([...state.prevTag])
		setDependenceData([...state.prevDependenceData])
		setDependence([...state.prevDependence])

		saveToLocalStorage(state.prevData, state.prevColor, state.prevTag, state.prevDependence, state.prevDependence)

	}
	else{
		alert("No previous state")
	}

      };

      
//   useEffect(()=>{

//   }, [data])
  
  useEffect(() => {
	const fetchData = () => {
	  try {
		
		console.log('./data/'+window.location.href.split('/')[4])
	//     const response = await fetch('./DanangHoian_490222071180065.json'); // Replace with the actual path to your JSON file

	    try{
		let path = './data/'+ window.location.href.split('/')[4].split('.')[0]
		path = path + '_tag.json'
		const data1 = require(path)
		

		setDependenceData(data1['dependenceData'])
		setColorData(data1['colorData'])
		setTagData(data1['tagData'])
		setData(data1['data']);
		setDependence(data1['dependence'])
		setCurrentIndex(data1['currentIndex'])
		
	    }
	    catch(err) {

	    
	    const data1 = require('./data/'+window.location.href.split('/')[4]);
	    let postData = []
	    for(let i=0;i<data1.length; i++){
		let spl = data1[i]['content'].replace(/[\n\r]/g, ' ').split(" ")
		// spl = data1[i]['content'].replace('\r', ' ').split(" ")
		postData.push(spl)
	    }

	    
	    let tempTagData = []

	    for(let i =0;i<postData.length;i++){
		const newArray = Array.from({ length: postData[i].length }, () => 'O');
		tempTagData.push(newArray)
	    }

	    let tempColorData = []

	    for(let i =0;i<postData.length;i++){
		const newArray = Array.from({ length: postData[i].length }, () => 'white');
		tempColorData.push(newArray)
	    }

	    let tempDependenceData = []

	    for(let i =0;i<postData.length;i++){
		const newArray = Array.from({ length: postData[i].length }, () => ({ role: 'O' }));
		tempDependenceData.push(newArray)
	    }

	     setDependenceData(tempDependenceData)
	     setColorData(tempColorData)
	     setTagData(tempTagData)
	     setData(postData);

		}
	    

	  } catch (error) {
	    console.error('Error fetching data:', error);
	  }
	};



	let storedData = localStorage.getItem(LOCAL_STORAGE_KEY);

	// console.log(localStorage.getItem("checkReload") === '1')
	// let check = localStorage.getItem("checkReload");

	if(!localStorage.getItem(LOCAL_STORAGE_KEY)){
		// fetchData();
		// let storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
		// alert(1)
		fetchData()
		// localStorage.setItem("checkReload", JSON.stringify(1));
	}
	else {
		
		if (storedData) {
		const parsedData = JSON.parse(storedData);

		
		console.log(parsedData.colorData)
		
		// Set your state variables using the parsed data
	
		setData(parsedData.data);
		setTagData(parsedData.tagData);
		setColorData(parsedData.colorData);
		setDependenceData(parsedData.dependenceData)
		setSelectedWords(parsedData.selectedWords);
		setSelectedText(parsedData.selectedText);
		setRange(parsedData.range);
		setCurrentIndex(parsedData.currentIndex);
			}
		
	}

	// console.log(localStorage.getItem("checkReload"))
	

	// localStorage.setItem("checkReload", JSON.stringify(1));
	
      }, []); // The empty dependency array ensures that this effect runs only once on component mount


  const moveNext = ()=>{
	if (currentIndex < data.length)
		setCurrentIndex(currentIndex+1)
	else
		alert('No Next')
  }

  const movePrev = ()=>{
	if(currentIndex > 0)
		setCurrentIndex(currentIndex-1)
	else 
		alert('No Previous')
  }
  console.log(dependenceData)

  const saveData = ()=>{

	let trainData = {
		'data': data[currentIndex],
		'tagData': tagData[currentIndex],
		'colorData': colorData[currentIndex],
		'dependenceData': dependenceData[currentIndex],
		'dependence': dependence,
		'currentIndex': currentIndex
	}
	
	// const jsonString = JSON.stringify(trainData[currentIndex], null, 2);
	axios.post('http://127.0.0.1:8000/SaveFile',{
			'data' : trainData,
			'index': currentIndex,
			'outputFile': window.location.href.split('/')[4].split(".")[0] 
    
		})


  }

  

  console.log(dependenceData)
  const handleSelection = () => {
	const selection = window.getSelection();
	if (selection) {
	  const selectedText = selection.toString();
	  const range = selection.getRangeAt(0);

	  setSelectedText(selectedText)
	  setRange([range.startOffset,range.endOffset])
     
	  console.log("Selected range:", range);

	}
      };

//   const handleWordClick = (index) => {
//     if (isDragging) {
//       return; // Ignore click if it's part of a drag action
//     }

//     const newSelectedWords = [...selectedWords];
//     const indexOfWord = newSelectedWords.indexOf(index);

//     if (indexOfWord === -1) {
//       newSelectedWords.push(index);
//     } else {
//       newSelectedWords.splice(indexOfWord, 1);
//     }

//     setSelectedWords(newSelectedWords);
//   };

  const handleMouseDown = (index) => {
    let d = [index]

    console.log(colorData)
    setSelectedWords([...d]);
  };

  const handleMouseUp = (index) => {
    setIsDragging(false);
    let temp = []
    for(let i=selectedWords[0];i<=index;i++){
	temp.push(i)
    }
//     if(selectedWords[0] === index)
//     	temp.push(selectedWords[0])

    console.log(temp)
    console.log()

    setSelectedWords([...temp]) 
    handleSelection();
  };

  const handleMouseMove = (index) => {
//     if (isDragging) {
//       setSelectedWords([...selectedWords, index]);
//     }
  };

  console.log(selectedWords)

  const handleKeyDown = (event) => {
    const key = event.key;
    const color = getColorForKey(key);
    const tag = getTagForKey(key)
    

      if (event.ctrlKey && event.key === 'z') {
	console.log(undoStack)
	undo();
      }
      else if(!event.ctrlKey && tag !== 'Pass' ){

	const _ = require('lodash');

	let tempTagData = _.cloneDeep(tagData);
	let tempColorData = _.cloneDeep(colorData);
	let tempDependenceData = _.cloneDeep(dependenceData)
	let temp = _.cloneDeep(data);
	
	
	let prevData = [...data];
	let prevColor = [...colorData];
	let prevTag = [...tagData];
	let prevDependenceData = [...dependenceData]


    console.log(prevDependenceData)


	// let temp = [...data]
	if( selectedWords.length > 0 && selectedText.split(" ")[0] !== data[currentIndex][selectedWords[0]] && selectedText.split(" ")[selectedText.length - 1] === data[currentIndex][selectedWords[selectedWords.length - 1]] ){
	
		console.log(selectedWords)
		let fh = temp[currentIndex][selectedWords[0]].substring(0,range[0])
		let sh = temp[currentIndex][selectedWords[0]].substring(range[0])
		console.log(fh)
		console.log(sh)

		// let fh1 = temp[currentIndex][selectedWords[selectedWords.length -1]].substring(0,range[1])
		// let sh1 = temp[currentIndex][selectedWords[selectedWords.length -1]].substring(range[1])

		temp[currentIndex][selectedWords[0]] = fh
		temp[currentIndex].splice(selectedWords[0] + 1, 0, sh);

		// temp[currentIndex][selectedWords[selectedWords.length -1 ]+1] = fh1
		// temp[currentIndex].splice(selectedWords[selectedWords.length -1] + 2, 0, sh1);

		// temp[currentIndex][selectedWords[0]][range] 
		tempTagData[currentIndex].splice(selectedWords[0],0,"O")
		tempColorData[currentIndex].splice(selectedWords[0],0,"white")
		tempDependenceData[currentIndex].splice(selectedWords[0],0,{role:'O'})

		

		

		for(let i =0;i< selectedWords.length; i++){
			
			tempColorData[currentIndex][selectedWords[i]+1] = color
	    
		    if(tag === 'O')
			    tempTagData[currentIndex][selectedWords[i]+1] =  tag
		    else
			    if(i === 0)
				    tempTagData[currentIndex][selectedWords[i]+1] =  'B-' + tag
			    else
				    tempTagData[currentIndex][selectedWords[i]+1] = 'I-' + tag
		}
	    
	}
	else if(selectedText.split(" ")[0] === data[currentIndex][selectedWords[0]] && selectedText.split(" ")[selectedText.length - 1] !== data[currentIndex][selectedWords[selectedWords.length - 1]]){
		let fh = temp[currentIndex][selectedWords[selectedWords.length - 1]].substring(0,range[1])
		let sh = temp[currentIndex][selectedWords[selectedWords.length - 1]].substring(range[1])

		console.log(fh)
		console.log(sh)

		// let fh1 = temp[currentIndex][selectedWords[selectedWords.length -1]].substring(0,range[1])
		// let sh1 = temp[currentIndex][selectedWords[selectedWords.length -1]].substring(range[1])

		temp[currentIndex][selectedWords[selectedWords.length - 1]] = fh
		temp[currentIndex].splice(selectedWords[selectedWords.length - 1] + 1, 0, sh);

		// temp[currentIndex][selectedWords[selectedWords.length -1 ]+1] = fh1
		// temp[currentIndex].splice(selectedWords[selectedWords.length -1] + 2, 0, sh1);

		// temp[currentIndex][selectedWords[0]][range] 
		tempTagData[currentIndex].splice(selectedWords[selectedWords.length-1]+1 ,0,"O")
		tempColorData[currentIndex].splice(selectedWords[selectedWords.length-1]+1,0,"white")
		tempDependenceData[currentIndex].splice(selectedWords[selectedWords.length-1]+1,0,{role:'O'})

		

		for(let i =0;i< selectedWords.length; i++){
			
			tempColorData[currentIndex][selectedWords[i]] = color
			
		    if(tag === 'O')
			    tempTagData[currentIndex][selectedWords[i]] =  tag
		    else{
			
			    if(i === 0)
				    tempTagData[currentIndex][selectedWords[i]] =  'B-' + tag
			    else
				    tempTagData[currentIndex][selectedWords[i]] = 'I-' + tag
		    }
		}

		console.log(tempColorData)

	}
	else if(selectedText.split(" ")[0] !== data[currentIndex][selectedWords[0]] && selectedText.split(" ")[selectedText.length - 1] !== data[currentIndex][selectedWords[selectedWords.length - 1]]){
		let fh = temp[currentIndex][selectedWords[0]].substring(0,range[0])
		let sh = temp[currentIndex][selectedWords[0]].substring(range[0])

		console.log(fh)
		console.log(range[1])

		

		// let fh1 = temp[currentIndex][selectedWords[selectedWords.length -1]].substring(0,range[1])
		// let sh1 = temp[currentIndex][selectedWords[selectedWords.length -1]].substring(range[1])

		

		// console.log(fh1)
		// console.log(sh1)

		let a = 1

		temp[currentIndex][selectedWords[0]] = fh
		temp[currentIndex].splice(selectedWords[0] + 1, 0, sh);

		// console.log(range[1])
		console.log(temp[currentIndex][selectedWords[selectedWords.length - 1] + 1 ])
		
	
		
		let fh1 = temp[currentIndex][selectedWords[selectedWords.length -1]+1].substring(0,range[1])
		let sh1 = temp[currentIndex][selectedWords[selectedWords.length -1]+1].substring(range[1])


		if( range[1] !== temp[currentIndex][selectedWords[selectedWords.length - 1] + 1 ].length  ){
			temp[currentIndex][selectedWords[selectedWords.length -1 ]+1] = fh1
			temp[currentIndex].splice(selectedWords[selectedWords.length -1] + 2, 0, sh1);
			a+=1
			tempTagData[currentIndex].splice(selectedWords[0] ,0,"O")
			tempColorData[currentIndex].splice(selectedWords[0],0,"white")
			tempDependenceData[currentIndex].splice(selectedWords[0],0,{role:'O'})
		}
		

		console.log(sh1)
		console.log(fh1)


		tempTagData[currentIndex].splice(selectedWords[selectedWords.length -1] + a,0,"O" )
		tempColorData[currentIndex].splice(selectedWords[selectedWords.length-1] + a,0,"white")
		tempDependenceData[currentIndex].splice(selectedWords[selectedWords.length-1]+a,0,{role:'O'} )

		// console.log(tempTagData)
		

		for(let i =0;i< selectedWords.length; i++){
			
			tempColorData[currentIndex][selectedWords[i] +1 ] = color
	    
		    if(tag === 'O')
			    tempTagData[currentIndex][selectedWords[i] +1] =  tag
		    else
			    if(i === 0)
				    tempTagData[currentIndex][selectedWords[i] +1] =  'B-' + tag
			    else
				    tempTagData[currentIndex][selectedWords[i] +1] = 'I-' + tag
		}

		
	}
	else{

		

	for(let i =0;i< selectedWords.length; i++){
		tempColorData[currentIndex][selectedWords[i]] = color
    
	    if(tag === 'O')
		    tempTagData[currentIndex][selectedWords[i]] =  tag
	    else{
	
		    if(i === 0)
			    tempTagData[currentIndex][selectedWords[i]] =  'B-' + tag
		    else
			    tempTagData[currentIndex][selectedWords[i]] = 'I-' + tag
	    		}
		}

	}


//     for(let i =0;i< selectedWords.length; i++){
//     	colorData[currentIndex][selectedWords[i]] = color

// 	if(tag === 'O')
// 		tempTagData[currentIndex][selectedWords[i]] =  tag
// 	else
// 		if(i === 0)
// 			tempTagData[currentIndex][selectedWords[i]] =  'B-' + tag
// 		else
// 			tempTagData[currentIndex][selectedWords[i]] = 'I-' + tag
//     }

	// await saveState(
   

	console.log(prevColor)

       const conditionToRemove = (element) => element === '';

	// Loop through array1 in reverse order to avoid index shifting during splice
	for (let i = temp[currentIndex].length - 1; i >= 0; i--) {
	  if (conditionToRemove(temp[currentIndex][i])) {
	    // Remove the element from array1
	    temp[currentIndex].splice(i, 1);
	
	    // Remove the corresponding element from array2
	    tempColorData[currentIndex].splice(i, 1);
	    tempTagData[currentIndex].splice(i,1)
	    tempDependenceData[currentIndex].splice(i,1)
	  }
	}

	let tempDependence = _.cloneDeep(dependence)
	let prevDependence = [...dependence]

	let a = 0


	if(temp[currentIndex][selectedWords[0]] !== prevData[currentIndex][selectedWords[0]] ){
		a+=1
		console.log(temp[currentIndex][selectedWords[0]])
		console.log(prevData[currentIndex][selectedWords[0]])
		for(let i=0;i<tempDependence.length;i++){
			console.log(tempDependence[i])
			if(tempDependence[i].index > selectedWords[0] ){
				tempDependence[i].index +=1
			}
		}
	}

	if(selectedWords.length > 1 && temp[currentIndex][selectedWords[selectedWords.length - 1]+a] !== prevData[currentIndex][selectedWords[selectedWords.length - 1]] ){
		
		for(let i=0;i<tempDependence.length;i++){
			if(tempDependence[i].index > selectedWords[selectedWords.length -1] ){
				tempDependence[i].index +=1
			}
		}
	}

    setUndoStack([...undoStack,{
	prevData: prevData,
	prevTag: prevTag,
	prevColor: prevColor,
	prevDependenceData: prevDependenceData,
	prevDependence: prevDependence
	// current: [...data]
    }])
   
    setData([...temp])
    setColorData([...tempColorData])
    setTagData([...tempTagData])
    setDependenceData([...tempDependenceData])
    setDependence([...tempDependence])
    setSelectedWords([])
    setSelectedText("")
    setRange(-1)

//     setUndoStack({
// 	prevData: [...prevData],
// 	prevTag: [...prevTag],
// 	prevColor: [...prevColor],
// 	// current: [...data]
//     })


    saveToLocalStorage(temp,tempColorData,tempTagData, tempDependenceData, tempDependence)

	}

  };

  const handleDoubleClick = (index)=>{
	if(tagData[currentIndex][index] !== 'O'){

		let tempFor = index + 1
		let array = [index]
		
		while(tagData[currentIndex][tempFor] !== 'O' && tagData[currentIndex][tempFor].indexOf('B-') === -1 ){
			array.push(tempFor)
			tempFor +=1;
		}


		
		let tempBack = index - 1
		while(tagData[currentIndex][index].indexOf('B-') === -1 && tagData[currentIndex][tempBack] !== '0'){
			if(tagData[currentIndex][tempBack].indexOf('B-') !== -1 ){
				array.unshift(tempBack)
				break
			}
			array.unshift(tempBack) 
			tempBack -=1

		}

		let temp = {}
		let rootArray = array.map(index => data[currentIndex][index]);

		temp['index'] = array[0]
		temp['root'] = rootArray.join(' ')

		let leaves = []

		for(let i =0; i< selectedEntity.length - 2 ;i++){
			let leaveArray = selectedEntity[i].map(index => data[currentIndex][index]);
			leaves.push(leaveArray.join(' '))
		}

		temp['leaves'] = leaves



		const _ = require('lodash');

		let tempDependenceData = _.cloneDeep(dependenceData)
		let prevDependenceData = [...dependenceData]



		for(let i =0;i<array.length;i++){
			tempDependenceData[currentIndex][array[i]] = {ind:temp.index, role:'root'} 
		}

		for(let i=0;i<selectedEntity.length - 2 ;i++){
			for(let j=0;j<selectedEntity[i].length;j++){
				tempDependenceData[currentIndex][selectedEntity[i][j]] = {ind:temp.index, role:'leave'}
			}
		}

		let tempDependence = _.cloneDeep(dependence)
		let prevDependence = [...dependence]

		let exist = false

		for(let i =0;i < tempDependence.length;i++ ){
			if(tempDependence[i].index === temp.index){
				exist = true
				tempDependence[i].leaves = [...tempDependence[i].leaves, ...temp.leaves]
			}
		}



		setUndoStack([...undoStack,{
			prevData: data,
			prevTag: tagData,
			prevColor: colorData,
			prevDependenceData: prevDependenceData,
			prevDependence: prevDependence


			
			// current: [...data]
		    }])
		   
		if (!exist)
			setDependence([...dependence,temp])
		else 
			setDependence([...tempDependence])
		setDependenceData([...tempDependenceData])
		setSelectedEntity([])
		saveToLocalStorage(data,colorData,tagData, tempDependenceData, tempDependence)

	}
  }


  const handleClick = (index) =>{

	if(tagData[currentIndex][index] !== 'O'){
		let tempFor = index + 1
		let array = [index]
		
		while(tagData[currentIndex][tempFor] !== 'O' && tagData[currentIndex][tempFor].indexOf('B-') === -1 ){
			array.push(tempFor)
			tempFor +=1;
		}




		
		let tempBack = index - 1
		while(tagData[currentIndex][index].indexOf('B-') === -1 && tagData[currentIndex][tempBack] !== '0'){
			if(tagData[currentIndex][tempBack].indexOf('B-') !== -1 ){
				array.unshift(tempBack)
				break
			}
			array.unshift(tempBack) 
			tempBack -=1

		}

		console.log(tagData[currentIndex][index])
		console.log(array)

		setSelectedEntity([...selectedEntity, array])
	}

  }

//   const handleKeyUp = () => {
//     setIsDragging(false);
//   };

  const getColorForKey = (key) => {
    // Add your logic for key-color mapping
    switch (key) {
	case 'r':
		return 'red';
	case 'a':
		return '#FF461F';
	case 'c':
		return '#F47983';
	case 'v':
		return '#FF143c'
	case 'h':
		return '#FFC773'
	case 'p':
		return '#70F3FF'
	case 'u':
		return '#4B5CC4'
	case 'd':
		return "#BCE672"
	case 'q':
		return "#75664D"
	case 'l':
		return "#FF2D51"
	case 'f':
		return "#DB5A6B"
	case 't':
		return "#FFA631"
	case 'o':
		return "white"
	default:
		return 'Pass'
      // Add more key-color mappings as needed
   
    }
  };
  

  const getTagForKey = (key) => {
	// Add your logic for key-color mapping
	switch (key) {
	  case 'r':
	    return 'RestaurantName';
	  case 'a':
	    return 'AttractionName';
	  case 'c':
	    return 'AccomodationName';
	  case 'v':
	    return 'Address'
	  case 'h':
		return 'Activity'
	  case 'p':
		return 'Price'
	  case 'u':
		return 'Unit'
	  case 'd':
		return "Description"
	  case 'q':
		return "Regulation"
	  case 'l':
		return "Contact"
	  case 'f':
		return "Food"
	  case 't':
		return "Tips"
	  case 'o':
		return "O"
	  default:
		return 'Pass'

	
	  // Add more key-color mappings as needed

	}
      };

//   const printSelectedIndexes = () => {
//     console.log("Selected indexes:", selectedWords);
//     setSelectedWords([]);
//   };

const spanStyle = {
	position: 'relative',
	display: 'inline-block',
	paddingBottom: '8px',
	 // Adjust as needed
	// marginBottom: '20px', // Adjust as needed
	// marginLeft:'2.5px',
	// marginRight:'2.5px'
      };
    
      const numberStyle = {
	position: 'absolute',
	bottom: '0',
	left: '58.5%',
	transform: 'translateX(-50%)',
	height:'10px',
	fontSize:'6px',
	width:'115%',
	backgroundColor: '#fff', // Background color to cover the border underneath the number
	// padding: '0 10px', // Adjust padding for the number
// Optional: Add border radius for a circular number
      };

console.log(dependenceData)

  return (
    <div style={{display:'flex'}} >

	{/* <h1 style={{marginBottom:'30px'}} >Tagging Tool</h1> */}

	<div style={{width:'75%'}} >

	<div style={{marginTop:'20px', textAlign:'center'}} >
			{currentIndex+1}/{data.length}
	</div>

      <div
	style = {{margin:'auto', width:'90%', border: '1px solid #1A43BF', borderRadius:'10px', marginTop:'5px', padding:'10px', height:'450px',overflowY:'scroll'}}
        tabIndex="0"
        onKeyDown={handleKeyDown}
        // onKeyUp={handleKeyUp}
      >


        {data.length > 0 && data[currentIndex].map((word, index) => (
	<span style={{backgroundColor: colorData[currentIndex][index]}} >
          <span
            key={index}
            className={selectedWords.includes(index) ? 'selected' : ''}
            style={{ ...spanStyle, flexGrow: 1}}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseMove(index)}
	    onMouseUp ={() => handleMouseUp(index) }
            onMouseDown={() => handleMouseDown(index)}
	    onDoubleClick={()=>{handleDoubleClick(index)}}
          >
            	{word}
		{dependence.length >0 && dependenceData[currentIndex][index].role !== 'O' && <span style={{...numberStyle,backgroundColor: dependenceData[currentIndex][index].role === 'root' ? 'black' : 'grey', color: dependenceData[currentIndex][index].role === 'root' ? 'white' : 'black' }}>
			{index === dependenceData[currentIndex][index].ind && <span>{dependenceData[currentIndex][index].ind}</span>}

			</span>}
          </span>
	
	{' '}
	</span>

        ))}
      </div>

      <div style = {{display:'flex',width:'90%', margin:'auto', marginTop:'30px', marginBottom:'30px' }} >
	<div style={{display:'flex', width:'50%'}} >
	<div >
		<Button variant='outlined' onClick = {movePrev} style = {{marginLeft:'0%'}} >
			previous
		</Button>
	</div>

	<div style={{marginLeft:'10px'}} >
		<Button variant='outlined' onClick = {moveNext} style = {{marginLeft:'0%'}} >
			next
		</Button>
	</div>
	</div>
	
	<div style={{width:'50%', marginLeft:'50%'}} >
	<Button variant='outlined' onClick = {saveData} >Save</Button>
	</div>
      </div>

      </div>

      <div style={{width:'20%', marginTop:'30px'}} >
	<div>
		<h2 style={{ textAlign:'center'}} >Danh sách các entity</h2>
		<Grid container spacing={3}>
			{Object.entries(keyTag).map(([key, value]) => (
				<Grid item xs={6} sx={{display:'flex'}} >
					{/* <div style={{display:'flex', border:'1px solid grey', borderRadius:'5px',width:'200px'}} > */}
						<div>{value}</div>
						<div style={{marginLeft:'10px'}} >{key}</div>
						<div style={{marginLeft: '10px', backgroundColor: colorTag[key], width:'10px'}} ></div>
					{/* </div> */}
				</Grid>
		) )}
		</Grid>
	</div>
	<div style={{marginTop:'30px'}} >
		<h2 style = {{textAlign:'center'}} >Liên kết của các entity</h2>
		{dependence.map(d=>(
			<div style={{display:'flex'}} >
				<div>{d.index}</div>
				<div style={{marginLeft:'10px'}} >{d.root}</div>
				{d.leaves.map(l=>(
					<div style={{marginLeft:'10px'}} >{l}</div>
				))}

			</div>
		))}
	</div>
	</div>


    </div>
  );
};

export default TaggingTool;

