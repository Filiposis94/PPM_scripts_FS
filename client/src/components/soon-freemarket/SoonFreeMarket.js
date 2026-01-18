import React from "react";
import axios from "axios";
import PlayerSFM from "./PlayerSFM";
import Loading from "../Loading";
import { usePopup } from "../../hooks/handlePopUp";

function SoonFreeMarket(props){
    const {popup, showPopup} = usePopup()
    const [players, setPlayers] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    
    const handlePopUpCallback = React.useCallback((message)=>showPopup(message),[showPopup]);
   
    const fetchData = React.useCallback(async ()=>{
        try {
            let res = await axios.get(`/api/v1/freemarket/soon`);
            setPlayers(res.data);
        } catch (error) {
            console.log(error);
            handlePopUpCallback(error.response.data.msg);
        }
    },[handlePopUpCallback]);
    async function handleSubmit(){
        try {
            setIsLoading(true);
            let res = await axios.post(`/api/v1/freemarket/soon?socketId=${props.socketId}`);
            handlePopUpCallback(res.data.msg)
            setIsLoading(false);
            fetchData()
        } catch (error) {
            console.log(error);
            handlePopUpCallback(error.response.data.msg);
            setIsLoading(false);
        };
    };
    async function handleToggle(id, newState){
        setPlayers(prevPlayers=>{
            const newPlayers = prevPlayers.map((p)=>{
               return p.ppmId === id ? {...p, isInterested:newState} : p
            })
            return newPlayers
        })
        await axios.patch(`/api/v1/freemarket/soon/${id}`,{
        interestedIn: newState
        })
        fetchData();
    }

    React.useEffect(()=>{
        fetchData()
    },[fetchData]);
    // RESULT ELEMENTS
    const playersElements = players.map((player)=><PlayerSFM key={player.ppmId} data={player} handleToggle={handleToggle} />);
    return (
        <div>
            <h2>Volní hráči - brzy na trhu</h2>
            {popup.isShown && <p className="popUp">{popup.msg}</p>}
            {!isLoading && <div className="settings"><button className="button" onClick={handleSubmit}> Aktualizuj hráče</button></div>}
            {isLoading && <Loading task={props.task} progress={props.progress}/>}
            {playersElements.length > 0 && <h3>Vhodní hráči - {playersElements.length}</h3>}
            {playersElements}
        </div>
    );
};

export default SoonFreeMarket;