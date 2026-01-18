import React from "react"

function TacticsSettings(props){
    const mainTactics = [1,2,3,4,5,6]
    const secondaryTactics = [1,2,3]
    const [randomizedMain, setRandomizedMain] = React.useState([]);
    const [randomizedSecondary, setRandomizedSecondary] = React.useState([]);
    
    const generateRandomTactics = (tacticsList, stateSetter)=>{
        const tempAr = tacticsList.map(t => t)
        let randomized = []
        for (let i = 0; i<6; i++){
            const randomIndex = Math.floor(Math.random() * tempAr.length)
           randomized.push(tempAr.splice(randomIndex,1)[0])
        }
        stateSetter(randomized)
    }
    return(
        <div className="settings">
            <h3>Nastavení</h3>
            {props.isLoadingNextOp && <p>Načítám ID nejbližšího soupeře...</p>}
            <p>
                <label htmlFor="teamId">Team ID:</label>
                <input type="number" name="teamId" value={props.settings.teamId} onChange={props.handleSettings}></input>
            </p>
            <p>
                <label htmlFor="numOfDays">Dní zpětně: </label>
                <input type="number" name="numOfDays" value={props.settings.numOfDays} onChange={props.handleSettings}></input>
            </p>
            <button className="button" onClick={props.handleSubmit}>Spustit</button>
            <h3>Randomizer</h3>
            <button className="button" onClick={()=>generateRandomTactics(mainTactics, setRandomizedMain)}>Generate main</button>
            <button className="button" onClick={()=>generateRandomTactics(secondaryTactics, setRandomizedSecondary)}>Generate secondary</button>
            {randomizedMain.length > 0 && <p><b>Main:</b> {randomizedMain.map(t=> <span key={t}>{t}</span>)}</p>}
            {randomizedSecondary.length > 0 && <p><b>Secondary:</b> {randomizedSecondary.map(t=> <span key={t}>{t}</span>)}</p>}
        </div>
    );
};

export default TacticsSettings;