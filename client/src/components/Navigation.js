import { Link, useLocation } from "react-router-dom"

function Navigation() {
	const location = useLocation()
	return location.pathname !== "/" ? (
		<nav>
			<Link to="freemarket">
				<button type="button" className="button">
					Volní hráči
				</button>
			</Link>
			<Link to="friendly-match">
				<button type="button" className="button">
					Přáteláky
				</button>
			</Link>
			<Link to="tactics">
				<button type="button" className="button">
					Taktiky
				</button>
			</Link>
			<Link to="visits">
				<button type="button" className="button">
					Návštěvnost
				</button>
			</Link>
			<Link to="power">
				<button type="button" className="button">
					Síly teamů
				</button>
			</Link>
			<Link to="soon-freemarket">
				<button type="button" className="button">
					Brzy volní hráči
				</button>
			</Link>
			<Link to="employees">
				<button type="button" className="button">
					Trh historie zaměstnanci
				</button>
			</Link>
		</nav>
	) : null
}

export default Navigation
