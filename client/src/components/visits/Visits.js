import axios from "axios"
import React from "react"
import { usePopup } from "../../hooks/handlePopUp"
import Loading from "../Loading"
import VisitsData from "./VisitsData"
import VisitsSettings from "./VisitsSettings"

function Visits(props) {
	const { popup, showPopup } = usePopup()
	const [settings, setSettings] = React.useState({
		startDate: "",
		numOfDays: 30
	})
	const [visitsResults, setVisitResults] = React.useState([])
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
			if (settings.startDate) {
				setIsLoading(true)
				const splitSD = settings.startDate.split("-")
				const flippedSD = `${splitSD[2]}-${splitSD[1]}-${splitSD[0]}`
				const res = await axios.get(
					`/api/v1/visits?startDate=${flippedSD}&numOfDays=${settings.numOfDays}&socketId=${props.socketId}`
				)
				setVisitResults(res.data)
				setIsLoading(false)
			}
		} catch (error) {
			console.log(error)
			showPopup(error.response.data.msg)
			setIsLoading(false)
		}
	}
	// ELEMENTS
	const visitsElements = visitsResults.map((visits) => (
		<VisitsData key={visits.day} data={visits} />
	))
	return (
		<div>
			<h2>Návštěvnost</h2>
			{popup.isShown && <p className="popUp">{popup.msg}</p>}
			{isLoading && <Loading task={props.task} progress={props.progress} />}
			{!isLoading && (
				<VisitsSettings
					handleSettings={handleSettings}
					handleSubmit={handleSubmit}
					settings={settings}
				/>
			)}
			{visitsElements.length > 0 && <h3>Výsledek</h3>}
			{visitsElements.length > 0 && (
				<table>
					<thead>
						<tr>
							<th>Den sezóny</th>
							<th>Team</th>
							<th>Návštěvnost</th>
						</tr>
					</thead>
					<tbody>{visitsElements}</tbody>
				</table>
			)}
		</div>
	)
}

export default Visits
