import { useLocation, Link } from "react-router-dom";


function Navigation(props){
    const location = useLocation();
    return (
    location.pathname !== "/" ? <nav>
        <button className="button" ><Link to="freemarket">Volní hráči</Link></button>
        <button className="button" ><Link to="friendly-match">Přáteláky</Link></button>
        <button className="button" ><Link to="tactics">Taktiky</Link></button>
        <button className="button" ><Link to="visits">Návštěvnost</Link></button>
        <button className="button" ><Link to="power">Síly teamů</Link></button>
        <button className="button" ><Link to="soon-freemarket">Brzy volní hráči</Link></button>
        <button className="button" ><Link to="employees">Trh historie zaměstnanci</Link></button>
        </nav> : null
    )

}

export default Navigation;