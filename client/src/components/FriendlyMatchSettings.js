import React from "react";
import Date from "./Date";

function FriendlyMatchSettings(props){
    let datesElements = props.availableDates.map((date)=><Date key={date.value} data={date} handleSelect={props.handleSelect}/>);
      
    if(datesElements.length < 1){
        datesElements = 'Nejsou dostupné žádné volné dny';
    };
    return (
        <div className="settings">
            <h3>Nastavení</h3>
            <p>
                <button className="button" onClick={props.handleUpdateTeams}>Aktualizuj teamy</button>
            </p>
            <p>{props.isLoadingDates ? 'Načítám volné dny...' : datesElements}</p>
            <p>
                <label htmlFor="tk">TK:</label>
                <input type="number" name="tk" value={props.settings.tk} onChange={props.handleSettings}></input>
            </p>
            <button className="button" onClick={props.handleSubmit}>Najdi zápasy</button>
            
        </div>
    );
};

export default FriendlyMatchSettings;