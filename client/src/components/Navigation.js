
function Navigation(props){
    return (
        <nav>
        <button className="button" onClick={()=>{props.handlePage('freemarket')}}>Volní hráči</button>
        <button className="button" onClick={()=>{props.handlePage('friendlymatch')}}>Přáteláky</button>
        <button className="button" onClick={()=>{props.handlePage('tactics')}}>Taktiky</button>
        <button className="button" onClick={()=>{props.handlePage('visits')}}>Návštěvnost</button>
        <button className="button" onClick={()=>{props.handlePage('power')}}>Síly teamů</button>
        <button className="button" onClick={()=>{props.handlePage('soonfreemarket')}}>Brzy volní hráči</button>
        </nav>
    );

}

export default Navigation;