import clipboard from '../img/clipboard.svg';
import hockey from '../img/hockey.svg';
import magGlass from '../img/mag-glass.svg';
import people from '../img/people.svg';
import graph from '../img/graph.svg'
import { Link } from 'react-router-dom';
function NavigationHP(){
    return (
        <nav>   
        <div className="button hp-button" ><Link to="/freemarket">Volní hráči<img className="hp-img" src={magGlass} alt="magnifying glass"></img></Link></div>
        <div className="button hp-button" ><Link to="firendly-match">Přáteláky<img className="hp-img" src={hockey} alt="hockey"></img></Link></div>
        <div className="button hp-button" ><Link to="tactics">Taktiky<img className="hp-img" src={clipboard} alt="clipboard"></img></Link></div>
        <div className="button hp-button" ><Link to="visits">Návštěvnost<img className="hp-img" src={people} alt="people"></img></Link></div>
        <div className="button hp-button" ><Link to="power">Síly teamů<img className="hp-img" src={graph} alt="people"></img></Link></div>
        <div className="button hp-button" ><Link to="soon-freemarket">Brzy volní hráči<img className="hp-img" src={magGlass} alt="people"></img></Link></div>
        </nav>
    );

};

export default NavigationHP;