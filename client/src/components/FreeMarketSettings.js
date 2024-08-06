import React from "react";

function FreemaMarketSettings(props){ 
    return(
        <div className="settings">
            <h3>Nastavení</h3>
            <p>
                <label htmlFor="cz">CZ:</label>
                <input type="number" value={props.settings.cz} name="cz" onChange={props.handleSettings}></input>
                <button className="button" onClick={props.handleSubmit}>Spustit</button>
            </p>
        </div>
    );

};

export default FreemaMarketSettings;