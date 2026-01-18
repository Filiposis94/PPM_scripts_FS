import React from "react";

function FreemaMarketSettings(props){ 
    return(
        <div className="settings">
            <h3>Nastavení</h3>
            <p>
                <select name="offset" onChange={props.handleSettings}>
                    <option value="0">No offset</option>
                    <option value="1">+1 Day</option>
                    <option value="2">+2 Days</option>
                    <option value="3">+3 Days</option>
                </select>
            </p>
            <p>
                <label htmlFor="cz">CZ:</label>
                <input type="number" value={props.settings.cz} name="cz" onChange={props.handleSettings}></input>
                <button className="button" onClick={props.handleSubmit}>Spustit</button>
            </p>
        </div>
    );

};

export default FreemaMarketSettings;