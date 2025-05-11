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
        header:'',
        league: 'all',
        sort: ''
    });
    const [teamPowers, setTeamPowers] = React.useState([]);
    const [headers, setHeaders] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [update, setUpdate] = React.useState('Default');
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
            const res = await axios.patch(`/api/v1/scripts/power?socketId=${props.socketId}&header=${settings.header}`);
            handlePopUp(res.data.msg);
            setIsLoading(false);
            setUpdate('Updated');               
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
    function handeSort(column){
        setSettings((prevSettings)=>{
            return {
                ...prevSettings,
                sort: column
            };
        });
    };
    React.useEffect(()=>{
            async function fetchData(){
                try {
                    if(settings.league === 'all'){
                        let res = await axios.get(`/api/v1/scripts/power?sort=${settings.sort}`);
                        setHeaders(res.data.headers);
                        setTeamPowers(res.data.teams);
                    } else {
                        let res = await axios.get(`/api/v1/scripts/power?league=${settings.league}&sort=${settings.sort}`);
                        setTeamPowers(res.data.teams);
                    }
                } catch (error) {
                    console.log(error);
                    handlePopUp(error.response.data.msg);
                }
            };
            fetchData();
        },[update, settings]);
    // ELEMENTS
    let tableHeader;
    if(headers.length>0){
        tableHeader = headers[0].rounds.map((h, i)=><th key={h} onClick={()=>handeSort(i)}>{h}</th>);
    };
    const powerTable = teamPowers.map(item=>{
        let teamPowers = [];
        for(let i=0; i<item.powers.length; i++){
            teamPowers.push(<td key={i}>{item.powers[i]}</td>);
        };
        teamPowers.unshift(<td key={item.name}>{item.name}</td>)      
        return <tr key={item.ppmId}>{teamPowers}</tr>
    });
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