import React from "react";

function VisitsSettings(props){
    return(
        <div className="settings">
            <h3>Nastavení</h3>
            <p>
                <label htmlFor="startDate">Počáteční datum:</label>
                <input type="date" value={props.settings.startDate} name="startDate" onChange={props.handleSettings}></input>
            </p>
            <p>
                <label htmlFor="numOfDays">Počet dní:</label>
                <input type="number" value={props.settings.numOfDays} name="numOfDays" onChange={props.handleSettings}></input>
            </p>
            <button className="button" onClick={props.handleSubmit}>Odeslat</button>
        </div>
    );
};

export default VisitsSettings

