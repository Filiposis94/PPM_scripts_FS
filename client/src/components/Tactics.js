import React from "react";
import axios from 'axios';
import TacticsSettings from "./TacticsSettings";
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
    console.log(tacticsResults);
    
    return (
        <div>
            <h2>Taktiky</h2>
            {popUp.isShown && <p className="popUp">{popUp.msg}</p>}
            {isLoading && <Loading task={props.task} progress={props.progress}/>}
            {!isLoading && <TacticsSettings handleSettings={handleSettings} handleSubmit={handleSubmit} settings={settings}/>}
            {Object.keys(tacticsResults).length >0 && <h3>Výsledek</h3>}
            {Object.keys(tacticsResults).length >0 && <div>
                <table>
                    <thead>
                        <tr>
                            <th>Hlavní taktika</th>
                            <th>Poměr taktiky</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>Normální</td>
                        <td>{tacticsResults.nor} %</td>
                        </tr>
                        <tr>
                        <td>Defenzivní</td>
                        <td>{tacticsResults.def} %</td>
                        </tr>
                        <tr>
                        <td>Ofenzivní</td>
                        <td>{tacticsResults.off} %</td>
                        </tr>
                        <tr>
                        <td>Aktivní napadání</td>
                        <td>{tacticsResults.akt} %</td>
                        </tr>
                        <tr>
                        <td>Protiútoky</td>
                        <td>{tacticsResults.pro} %</td>
                        </tr>
                        <tr>
                        <td>Kouskování hry</td>
                        <td>{tacticsResults.kou} %</td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <thead>
                        <tr>
                            <th>Přesilovky</th>
                            <th>Poměr taktiky</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>Střelba od modré</td>
                        <td>{tacticsResults.str} %</td>
                        </tr>
                        <tr>
                        <td>Deštník</td>
                        <td>{tacticsResults.des} %</td>
                        </tr>
                        <tr>
                        <td>Přetižení</td>
                        <td>{tacticsResults.pre} %</td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <thead>
                        <tr>
                            <th>Oslabení</th>
                            <th>Poměr taktiky</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>Diamant</td>
                        <td>{tacticsResults.dia} %</td>
                        </tr>
                        <tr>
                        <td>Pasivní obdélník</td>
                        <td>{tacticsResults.pas} %</td>
                        </tr>
                        <tr>
                        <td>Aktivní obdélník</td>
                        <td>{tacticsResults.akto} %</td>
                        </tr>
                    </tbody>
                </table>
            </div>}
        </div>
    );
};

export default Tactics;