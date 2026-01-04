import clipboard from '../img/clipboard.svg';
import hockey from '../img/hockey.svg';
import magGlass from '../img/mag-glass.svg';
import people from '../img/people.svg';
import graph from '../img/graph.svg'
import { Link } from 'react-router-dom';
function NavigationHP(){
    return (
        <nav>   
        <div className="button hp-button" ><Link to="freemarket"><div>Volní hráči<img className="hp-img" src={magGlass} alt="magnifying glass"></img></div></Link></div>
        <div className="button hp-button" ><Link to="friendly-match"><div>Přáteláky<img className="hp-img" src={hockey} alt="hockey"></img></div></Link></div>
        <div className="button hp-button" ><Link to="tactics"><div>Taktiky<img className="hp-img" src={clipboard} alt="clipboard"></img></div></Link></div>
        <div className="button hp-button" ><Link to="visits"><div>Návštěvnost<img className="hp-img" src={people} alt="people"></img></div></Link></div>
        <div className="button hp-button" ><Link to="power"><div>Síly teamů<img className="hp-img" src={graph} alt="people"></img></div></Link></div>
        <div className="button hp-button" ><Link to="soon-freemarket"><div>Brzy volní hráči<img className="hp-img" src={magGlass} alt="people"></img></div></Link></div>
        <div className="button hp-button" ><Link to="employees"><div>Trh historie zaměstnanci<img className="hp-img" src={magGlass} alt="people"></img></div></Link></div>
        </nav>
    );

};

export default NavigationHP;