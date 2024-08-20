import React from "react";
import axios from 'axios';
import Match from "./Match";
import FriendlyMatchSettings from "./FriendlyMatchSettings";
import Loading from "./Loading";

function FriendlyMatch(props){
    const [availableDates, setAvailableDates] = React.useState([]);
    const [isloadingDates, setIsLoadingDates] = React.useState(true);
    const [popUp, setPopUp] = React.useState({
        msg:'',
        isShown: false
    });
    const [settings, setSettings] = React.useState({
        tk:400
    });
    const [availableMatches, setAvailableMatches] = React.useState([]);
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
            const res = await axios.get('/api/v1/scripts/teams');
            handlePopUp(res.data.msg);
        } catch (error) {
            console.log(error);
            handlePopUp(error.response.data.msg);
        };
    };
    function handleSelect(clickedDate){
        setAvailableDates((prevAvailableDates)=>{
            let newDates = prevAvailableDates.map((date)=>{
                return clickedDate === date.value ? {...date, isSelected:!date.isSelected} : date;
            });
            return newDates;
        });
    };
    async function handleSubmit(){
        try {
            if(availableDates.filter(date => date.isSelected === true).length >0 ){
                setIsLoading(true);
                const joinedDates = availableDates.filter(date=>date.isSelected).map(date=>date.value).join(',');
                const res = await axios.get(`/api/v1/scripts/friendly-matches?dates=${joinedDates}&tk=${settings.tk}&socketId=${props.socketId}`);
                setAvailableMatches(res.data);
                setIsLoading(false); 
            };            
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
    React.useEffect(()=>{
        async function fetchData(){
            try {
                let res = await axios.get(`/api/v1/scripts/available-dates`);
                setAvailableDates(res.data.map((date)=>{
                    return {
                        value:date,
                        isSelected:false
                    }
                }));
                setIsLoadingDates(false);
            } catch (error) {
                console.log(error);
                handlePopUp(error.response.data.msg);
                setIsLoadingDates(false);
            }
        };
        fetchData();
    },[]);
    // ELEMENTS
    const matchElements = availableMatches.map((match)=><Match key={match.id} data={match}/>);
    return (
        <div>
            <h2>Přátelské zápasy</h2>
            {popUp.isShown && <p className="popUp">{popUp.msg}</p>}
            {isLoading && <Loading task={props.task} progress={props.progress}/>}
            {!isLoading &&
            <FriendlyMatchSettings 
            popUp={popUp}
            handleUpdateTeams={handleUpdateTeams}
            handleSubmit={handleSubmit}
            handleSettings={handleSettings}
            handleSelect={handleSelect}
            settings={settings}
            isLoadingDates={isloadingDates}
            availableDates={availableDates}
            />        
            }
            {matchElements.length>0 && <h3>Vhodné zápasy</h3>}
            {matchElements.length>0 && <table>
                <thead>
                    <tr>
                    <th>Stadion</th>
                    <th>TK</th>
                    <th>SP</th>
                    <th>BP</th>
                    </tr>
                </thead>
                <tbody>
                    {matchElements}
                </tbody>
            </table>}
        </div>
    );
};

export default FriendlyMatch;