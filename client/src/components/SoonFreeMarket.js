import React from "react";
import axios from "axios";
import PlayerSFM from "./PlayerSFM";
import Loading from "./Loading";

function SoonFreeMarket(props){
    const [players, setPlayers] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [popUp, setPopUp] = React.useState({
        msg:'',
        isShown: false
    });
    
    const handlePopUp = React.useCallback((message)=>{
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
    },[]);
   
    const fetchData = React.useCallback(async ()=>{
        try {
            let res = await axios.get(`/api/v1/scripts/soonfreemarket`);
            setPlayers(res.data);
        } catch (error) {
            console.log(error);
            handlePopUp(error.response.data.msg);
        }
    },[handlePopUp]);
    async function handleSubmit(){
        try {
            setIsLoading(true);
            let res = await axios.patch(`/api/v1/scripts/soonfreemarket?socketId=${props.socketId}`);
            handlePopUp(res.data.msg)
            setIsLoading(false);
            fetchData()
        } catch (error) {
            console.log(error);
            handlePopUp(error.response.data.msg);
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
        await axios.patch(`/api/v1/scripts/soonfreemarket/${id}`,{
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
            {popUp.isShown && <p className="popUp">{popUp.msg}</p>}
            {!isLoading && <div className="settings"><button className="button" onClick={handleSubmit}> Aktualizuj hráče</button></div>}
            {isLoading && <Loading task={props.task} progress={props.progress}/>}
            {playersElements.length > 0 && <h3>Vhodní hráči - {playersElements.length}</h3>}
            {playersElements}
        </div>
    );
};

export default SoonFreeMarket;