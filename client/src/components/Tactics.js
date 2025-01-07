import React from "react";
import axios from 'axios';
import TacticsSettings from "./TacticsSettings";
import TacticsResults from "./TacticsResults";
import Loading from "./Loading";



function Tactics(props){
    const [tacticsResults, setTacticsResults] = React.useState({});
    const [settings, setSettings] = React.useState({
        teamId:'',
        numOfDays:60
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [popUp, setPopUp] = React.useState({
        msg:'',
        isShown: false
    });
    const [isLoadingNextOp, setIsLoadingNextOp] = React.useState(true);
    // EVENT HANDLERS
    function handlePopUp(message){
        setPopUp({
            msg: message,
            isShown:true
        });
        setTimeout(()=>{
            setPopUp({
                msg:'',
                isShown:false
            });
        }, 5000);
    };
    function handleSettings(event){
        const {value, name} = event.target;
        setSettings((prevSettings)=>{
            return {
                ...prevSettings,
                [name]:value
            };
        });
    };
    async function handleSubmit(){
        try {
            setIsLoading(true);
            const res = await axios.get(`/api/v1/scripts/tactics?teamId=${settings.teamId}&numOfDays=${settings.numOfDays}&socketId=${props.socketId}`);
            setTacticsResults(res.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            handlePopUp(error.response.data.msg);
            setIsLoading(false);
        };
    };
    React.useEffect(()=>{
        async function fetchData(){
            try {
                let res = await axios.get(`/api/v1/scripts/next-opponent`);
                setSettings((prevSettings)=>{
                    return {...prevSettings, teamId: res.data};
                });
                setIsLoadingNextOp(false);               
            } catch (error) {
                console.log(error);
                handlePopUp(error.response.data.msg);
                setIsLoadingNextOp(false);               
            }
        };
        fetchData();
    },[]); 
    return (
        <div>
            <h2>Taktiky</h2>
            {popUp.isShown && <p className="popUp">{popUp.msg}</p>}
            {isLoading && <Loading task={props.task} progress={props.progress}/>}
            {!isLoading && <TacticsSettings handleSettings={handleSettings} handleSubmit={handleSubmit} settings={settings} isLoadingNextOp={isLoadingNextOp}/>}
            {Object.keys(tacticsResults).length >0 && <h3>Výsledek</h3>}
            {Object.keys(tacticsResults).length >0 && <TacticsResults tacticsResults={tacticsResults}/>}
        </div>
    );
};

export default Tactics;