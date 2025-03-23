import React from "react";

function PowerSettings(props){
      
    return (
        <div className="settings">
            <h3>Nastavení</h3>
            <p>
                <button className="button" onClick={props.handleUpdateTeams}>Aktualizuj teamy</button>
            </p>
            <form onSubmit={props.handleSubmit} autoComplete="off">

            <p> 
                <label htmlFor="header">Header:</label>
                <input type="text" name="header" value={props.settings.tk} onChange={props.handleSettings} required></input>
            </p>
            <button className="button">Stáhni sílu teamů</button>
            </form>
            
        </div>
    );
};

export default PowerSettings;