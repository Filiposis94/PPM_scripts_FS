import React from "react";
import Navigation from "./components/Navigation";
import NavigationHP from "./components/NavigationHP";
import FreeMarket from "./components/FreeMarket";
import FriendlyMatch from "./components/FriendlyMatch";
import Tactics from "./components/Tactics";
import Visits from "./components/Visits";
import Power from "./components/Power";
import SoonFreeMarket from "./components/SoonFreeMarket"
import ppmLogo from './img/ppm-logo.png';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import io from 'socket.io-client'
const URL = process.env.NODE_ENV === 'production' ? undefined :'http://localhost:4000';
const socket = io.connect(URL);

function App() {
  const [taskProgress, setTaskProgress] = React.useState(0);
  const [task, setTask] = React.useState('');
  const [socketId, setSocketId] = React.useState('');
  
  // IO HANDLERS
  React.useEffect(()=>{
    function handleTaskProgress(data){
      setTaskProgress(data);
    };
    function handleTask(data){
      setTask(data);
    };
    function onConnect(){
      setSocketId(socket.id);
    };
    socket.on('connect', onConnect);
    socket.on('progress', handleTaskProgress);
    socket.on('task', handleTask);
    return ()=>{
      socket.off('progress', handleTaskProgress);
      socket.off('task', handleTask);
      socket.off('connect', onConnect);
    }
  },[]);

  return (
    <BrowserRouter>
    <div className="container">
      <h1><Link to="/"><img src={ppmLogo} alt="ppm-logo"/></Link></h1>
      <Navigation/>
      <Routes>
        <Route path="/" element={<NavigationHP/>}/>
        <Route path="/freemarket" element={<FreeMarket progress={taskProgress} task={task} socketId={socketId}/>}/>
        <Route path="/friendly-match" element={<FriendlyMatch progress={taskProgress} task={task} socketId={socketId}/>}/>
        <Route path="/tactics" element={<Tactics progress={taskProgress} task={task} socketId={socketId}/>}/>
        <Route path="/visits" element={<Visits progress={taskProgress} task={task} socketId={socketId}/>}/>
        <Route path="/powers" element={<Power progress={taskProgress} task={task} socketId={socketId}/>}/>
        <Route path="/soon-freemarket" element={<SoonFreeMarket progress={taskProgress} task={task} socketId={socketId}/>}/>
      </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
