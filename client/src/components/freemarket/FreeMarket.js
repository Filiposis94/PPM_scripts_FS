import axios from "axios"
import React from "react"
import { usePopup } from "../../hooks/handlePopUp"
import Loading from "../Loading"
import FreemaMarketSettings from "./FreeMarketSettings"
import Player from "./Player"

function FreeMarket(props) {
	const { popup, showPopup } = usePopup()
	const [settings, setSettings] = React.useState({
		cz: 1800,
		offset: 0
	})
	const [players, setPlayers] = React.useState([])
	const [isLoading, setIsLoading] = React.useState(false)

	// EVENT HANDLERS
	function handleSettings(event) {
		const { value, name } = event.target
		setSettings((prevSettings) => {
			return {
				...prevSettings,
				[name]: value
			}
		})
	}
	async function handleSubmit() {
		try {
			setIsLoading(true)
			const res = await axios.get(
				`/api/v1/freemarket?cz=${settings.cz}&socketId=${props.socketId}&offset=${settings.offset}`
			)
			setPlayers(res.data)
			setIsLoading(false)
		} catch (error) {
			console.log(error)
			showPopup(error.response.data.msg)
			setIsLoading(false)
		}
	}
	// RESULT ELEMENTS
	const playersElements = players.map((player) => (
		<Player key={player.id} data={player} />
	))
	return (
		<div>
			<h2>Volní hráči</h2>
			{popup.isShown && <p className="popUp">{popup.msg}</p>}
			{!isLoading && (
				<FreemaMarketSettings
					handleSubmit={handleSubmit}
					handleSettings={handleSettings}
					settings={settings}
				/>
			)}
			{isLoading && <Loading task={props.task} progress={props.progress} />}
			{playersElements.length > 0 && <h3>Vhodní hráči</h3>}
			{playersElements}
		</div>
	)
}

export default FreeMarket
