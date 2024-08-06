import React from "react";

function TacticsSettings(props){

    return(
        <div className="settings">
            <h3>Nastavení</h3>
            <p>
                <label htmlFor="teamId">Team ID:</label>
                <input type="number" name="teamId" value={props.settings.teamId} onChange={props.handleSettings}></input>
            </p>
            <p>
                <label htmlFor="numOfDays">Dní zpětně: </label>
                <input type="number" name="numOfDays" value={props.settings.numOfDays} onChange={props.handleSettings}></input>
            </p>
            <button className="button" onClick={props.handleSubmit}>Spustit</button>
        </div>
    );
};

export default TacticsSettings;