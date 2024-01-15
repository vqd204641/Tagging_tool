import logo from './logo.svg';
import './App.css';
import TaggingTool from './TaggingTool';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InputLink from './InputLink';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/taging/:path' element = {<TaggingTool/>} />
        <Route path = '/' element = {<InputLink/>}/>
  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
