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

  const [undoStack, setUndoStack] = useState([]);


  const LOCAL_STORAGE_KEY = 'tagging_tool_data';


  const saveToLocalStorage = (tempData, tempColorData, tempTagData) => {
    const currentState = {
      data: [...tempData],
      tagData: [...tempTagData],
      colorData: [...tempColorData],
      selectedWords: [...selectedWords],
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


	     setColorData(tempColorData)
	     setTagData(tempTagData)
	     setData(postData);
	    


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
	
	setCurrentIndex(currentIndex+1)
  }

  const movePrev = ()=>{
	setCurrentIndex(currentIndex-1)
  }

  const saveData = ()=>{



	let trainData = {
		'words': data[currentIndex],
		'tags': tagData[currentIndex]
	}
	
	// const jsonString = JSON.stringify(trainData[currentIndex], null, 2);
	axios.post('http://127.0.0.1:8000/SaveFile',{
			'data' : trainData,
			'index': currentIndex,
			'outputFile': window.location.href.split('/')[4].split(".")[0] 
    
		})
// 	const visitedObjects = new WeakSet();
// 	var fs = require('fs');


// 	const filePath = 'output.json';
// // 	// Convert the trainData array to a JSON string with circular reference handling
// 	const jsonString = JSON.stringify(trainData, null, 2);

// 	// Use fs.writeFile with a callback function
// 	fs.writeFile(filePath, jsonString, 'utf-8', function(err, result) {
// 		if(err) console.log('error', err);
// 	    });
      
//       // Create a Blob containing the JSON string
//       const blob = new Blob([jsonString], { type: 'application/json' });
         
//       // Create a download link
//       const downloadLink = document.createElement('a');
//       downloadLink.href = URL.createObjectURL(blob);
//       downloadLink.download = 'trainData.json';
         
//       // Append the link to the document and trigger a click event
//       document.body.appendChild(downloadLink);
//       downloadLink.click();
      
//       // Clean up by removing the link from the document
//       document.body.removeChild(downloadLink);


  }

  

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

  const handleWordClick = (index) => {
    if (isDragging) {
      return; // Ignore click if it's part of a drag action
    }

    const newSelectedWords = [...selectedWords];
    const indexOfWord = newSelectedWords.indexOf(index);

    if (indexOfWord === -1) {
      newSelectedWords.push(index);
    } else {
      newSelectedWords.splice(indexOfWord, 1);
    }

    setSelectedWords(newSelectedWords);
  };

  const handleMouseDown = (index) => {
    let d = [index]
//     setIsDragging(true);
    console.log(colorData)
    setSelectedWords([...d]);
  };

  const handleMouseUp = (index) => {
    setIsDragging(false);
    let temp = []
    for(let i=selectedWords[0];i<=index;i++){
	temp.push(i)
    }
    if(selectedWords[0] === index)
    	temp.push(selectedWords[0])

    console.log(colorData)
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
	let temp = _.cloneDeep(data);
	
	let prevData = [...data];
	let prevColor = [...colorData];
	let prevTag = [...tagData];


    console.log(prevColor)


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


		for(let i =0;i< selectedWords.length; i++){
			tempColorData[currentIndex][selectedWords[i]] = color
			
		    if(tag === 'O')
			    tempTagData[currentIndex][selectedWords[i]] =  tag
		    else
			    if(i === 0)
				    tempTagData[currentIndex][selectedWords[i]] =  'B-' + tag
			    else
				    tempTagData[currentIndex][selectedWords[i]] = 'I-' + tag
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
		}
		

		console.log(sh1)
		console.log(fh1)

		// temp[currentIndex][selectedWords[0]][range] 
		tempTagData[currentIndex].splice(selectedWords[0] ,0,"O")
		tempColorData[currentIndex].splice(selectedWords[0],0,"white")

		tempTagData[currentIndex].splice(selectedWords[selectedWords.length -1] + a,0,"O" )
		tempColorData[currentIndex].splice(selectedWords[selectedWords.length-1] + a,0,"white" )

		console.log(tempTagData)

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
	    else
		    if(i === 0)
			    tempTagData[currentIndex][selectedWords[i]] =  'B-' + tag
		    else
			    tempTagData[currentIndex][selectedWords[i]] = 'I-' + tag
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

    setUndoStack([...undoStack,{
	prevData: prevData,
	prevTag: prevTag,
	prevColor: prevColor,
	// current: [...data]
    }])
   
    setData([...temp])
    setColorData([...tempColorData])
    setTagData([...tempTagData])
    setSelectedWords([])
    setSelectedText("")
    setRange(-1)

//     setUndoStack({
// 	prevData: [...prevData],
// 	prevTag: [...prevTag],
// 	prevColor: [...prevColor],
// 	// current: [...data]
//     })

    saveToLocalStorage(temp,tempColorData,tempTagData)

	}

  };

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

  return (
    <div>

	<h1 style={{marginBottom:'30px'}} >Tagging Tool</h1>

	<div style={{width:'90%', margin:'auto'}} >
		<Grid container spacing={2}>
			{Object.entries(keyTag).map(([key, value]) => (
				<Grid item xs={3} sx={{display:'flex'}} >
					{/* <div style={{display:'flex', border:'1px solid grey', borderRadius:'5px',width:'200px'}} > */}
						<div>{value}</div>
						<div style={{marginLeft:'10px'}} >{key}</div>
						<div style={{marginLeft: '10px', backgroundColor: colorTag[key], width:'10px'}} ></div>
					{/* </div> */}
				</Grid>
		) )}
		</Grid>
	</div>


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
          <span
            key={index}
            className={selectedWords.includes(index) ? 'selected' : ''}
            style={{ backgroundColor: colorData[currentIndex][index] }}
            onClick={() => handleWordClick(index)}
            onMouseEnter={() => handleMouseMove(index)}
	    onMouseUp ={() => handleMouseUp(index) }
            onMouseDown={() => handleMouseDown(index)}
          >
            {word}{" "}
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
  );
};

export default TaggingTool;

