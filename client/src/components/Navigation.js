import { useLocation, Link } from "react-router-dom";


function Navigation(){
    const location = useLocation();
    return (
    location.pathname !== "/" ? <nav>
        <Link to="freemarket"><button className="button" >Volní hráči</button></Link>
        <Link to="friendly-match"><button className="button" >Přáteláky</button></Link>
        <Link to="tactics"><button className="button" >Taktiky</button></Link>
        <Link to="visits"><button className="button" >Návštěvnost</button></Link>
        <Link to="power"><button className="button" >Síly teamů</button></Link>
        <Link to="soon-freemarket"><button className="button" >Brzy volní hráči</button></Link>
        <Link to="employees"><button className="button" >Trh historie zaměstnanci</button></Link>
        </nav> : null
    )

}

export default Navigation;