import React from "react";
import Navigation from "./components/Navigation";
import NavigationHP from "./components/NavigationHP";
import FreeMarket from "./components/FreeMarket";
import FriendlyMatch from "./components/FriendlyMatch";
import Tactics from "./components/Tactics";
import Visits from "./components/Visits";
import ppmLogo from './img/ppm-logo.png';

import io from 'socket.io-client'
const URL = process.env.NODE_ENV === 'production' ? undefined :'http://localhost:4000';
const socket = io.connect(URL);

function App() {
  const [page, setPage] = React.useState('menu');
  const [taskProgress, setTaskProgress] = React.useState(0);
  const [task, setTask] = React.useState('');
  const [socketId, setSocketId] = React.useState('');
  
  // HANDLERS
  function handlePage(page){
    setPage(page);
  };

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

  // ELEMENTS
  let pageComponent;
  switch(page){
    case 'freemarket': pageComponent = <FreeMarket progress={taskProgress} task={task} socketId={socketId}/>;
    break;
    case 'friendlymatch': pageComponent = <FriendlyMatch progress={taskProgress} task={task} socketId={socketId} />;
    break;
    case 'tactics': pageComponent = <Tactics progress={taskProgress} task={task} socketId={socketId}/>;
    break;
    case 'visits': pageComponent = <Visits progress={taskProgress} task={task} socketId={socketId}/>;
    break;
    default: pageComponent = "";
  };

  // RENDERING
  return (
    <div className="container">
      <h1><img src={ppmLogo} alt="ppm-logo" onClick={()=>{handlePage('menu')}}></img></h1>
      {page === 'menu'? <NavigationHP handlePage={handlePage}/> : <Navigation handlePage={handlePage}/>}
      {pageComponent}
      </div>
  );
};

export default App;
