import React from "react";
import axios from 'axios';
import PowerSettings from "./PowerSettings";
import Loading from "./Loading";

function Power(props){
    const [popUp, setPopUp] = React.useState({
        msg:'',
        isShown: false
    });
    const [settings, setSettings] = React.useState({
        header:''
    });
    const [teamPowers, setTeamPowers] = React.useState([]);
    const [headers, setHeaders] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    
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
    async function handleUpdateTeams(){
        try {
            setPopUp({
                msg:'Aktualizuji teamy...',
                isShown:true
            });
            const res = await axios.get('/api/v1/scripts/teams-power');
            handlePopUp(res.data.msg);
        } catch (error) {
            console.log(error);
            handlePopUp(error.response.data.msg);
        };
    };
    async function handleSubmit(){
        try {
            setIsLoading(true);
            const res = await axios.get(`/api/v1/scripts/power?socketId=${props.socketId}&header=${settings.header}`);
            setTeamPowers(res.data.finalData);
            setHeaders(res.data.fullHeader.split(','));
            setIsLoading(false);               
        } catch (error) {
            console.log(error);
            handlePopUp(error.response.data.msg);            
            setIsLoading(false);
        };
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
    // ELEMENTS
    const tableHeader = headers.map(h=><th key={h}>{h}</th>);
    const powerTable = teamPowers.map(item=>{
        let teamPowers = [];
        if(item.prevData){
            let prevPowers = item.prevData.split(',');
            for(let i=0; i<prevPowers.length; i++){
                teamPowers.push(<td>{prevPowers[i]}</td>);
            };
        }
        teamPowers.push(<td>{item.power}</td>);
        teamPowers.unshift(<td>{item.name}</td>)
        return <tr>{teamPowers}</tr>
    })

    return (
        <div>
            <h2>Síly teamů</h2>
            {popUp.isShown && <p className="popUp">{popUp.msg}</p>}
            {isLoading && <Loading task={props.task} progress={props.progress}/>}
            {!isLoading &&
            <PowerSettings
            handleUpdateTeams={handleUpdateTeams}
            handleSubmit={handleSubmit}
            handleSettings={handleSettings}
            settings={settings}
               />        
            }
            <table>
                <thead>
                    <tr><th>Název teamu</th>{tableHeader}</tr>
                </thead>
                <tbody>
                    {powerTable}
                </tbody>
            </table>
        </div>
    );
};

export default Power;