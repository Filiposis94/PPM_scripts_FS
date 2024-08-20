import React from "react";
import axios from "axios";
import Player from "./Player";
import FreemaMarketSettings from "./FreeMarketSettings";
import Loading from "./Loading";

function FreeMarket(props){
    const [settings, setSettings] = React.useState({
        cz:1800
    });
    const [players, setPlayers] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [popUp, setPopUp] = React.useState({
        msg:'',
        isShown: false
    });
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
            let res = await axios.get(`/api/v1/scripts/freemarket?cz=${settings.cz}&socketId=${props.socketId}`);
            setPlayers(res.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            handlePopUp(error.response.data.msg);
            setIsLoading(false);
        };
    };
    // RESULT ELEMENTS
    const playersElements = players.map((player)=><Player key={player.id} data={player} />);
    return (
        <div>
            <h2>Volní hráči</h2>
            {popUp.isShown && <p className="popUp">{popUp.msg}</p>}
            {!isLoading && <FreemaMarketSettings handleSubmit={handleSubmit} handleSettings={handleSettings} settings={settings}/>}
            {isLoading && <Loading task={props.task} progress={props.progress}/>}
            {playersElements.length > 0 && <h3>Vhodní hráči</h3>}
            {playersElements}
        </div>
    );
};

export default FreeMarket;