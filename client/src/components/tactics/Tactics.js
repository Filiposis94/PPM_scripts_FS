import React from "react";
import axios from 'axios';
import TacticsSettings from "./TacticsSettings";
import TacticsResults from "./TacticsResults";
import Loading from "../Loading";
import { usePopup } from "../../hooks/handlePopUp";



function Tactics(props){
    const {popup, showPopup} = usePopup()
    const [tacticsResults, setTacticsResults] = React.useState({});
    const [settings, setSettings] = React.useState({
        teamId:'',
        numOfDays:60
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingNextOp, setIsLoadingNextOp] = React.useState(true);
    // EVENT HANDLERS
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
            const res = await axios.get(`/api/v1/tactics?teamId=${settings.teamId}&numOfDays=${settings.numOfDays}&socketId=${props.socketId}`);
            setTacticsResults(res.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            showPopup(error.response.data.msg);
            setIsLoading(false);
        };
    };
    React.useEffect(()=>{
        async function fetchData(){
            try {
                let res = await axios.get(`/api/v1/tactics/next-opponent`);
                setSettings((prevSettings)=>{
                    return {...prevSettings, teamId: res.data};
                });
                setIsLoadingNextOp(false);               
            } catch (error) {
                console.log(error);
                showPopup(error.response.data.msg);
                setIsLoadingNextOp(false);               
            }
        };
        fetchData();
    },[showPopup]); 
    return (
        <div>
            <h2>Taktiky</h2>
            {popup.isShown && <p className="popUp">{popup.msg}</p>}
            {isLoading && <Loading task={props.task} progress={props.progress}/>}
            {!isLoading && <TacticsSettings handleSettings={handleSettings} handleSubmit={handleSubmit} settings={settings} isLoadingNextOp={isLoadingNextOp}/>}
            {Object.keys(tacticsResults).length >0 && <h3>Výsledek</h3>}
            {Object.keys(tacticsResults).length >0 && <TacticsResults tacticsResults={tacticsResults}/>}
        </div>
    );
};

export default Tactics;