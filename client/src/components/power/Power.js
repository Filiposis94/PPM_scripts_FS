import axios from "axios"
import React from "react"
import { usePopup } from "../../hooks/handlePopUp"
import Loading from "../Loading"
import PowerSettings from "./PowerSettings"

function Power(props) {
	const { popup, showPopup } = usePopup()
	const [settings, setSettings] = React.useState({
		header: "",
		league: "all",
		sort: ""
	})
	const [teamPowers, setTeamPowers] = React.useState([])
	const [headers, setHeaders] = React.useState([])
	const [isLoading, setIsLoading] = React.useState(false)
	// EVENT HANDLERS

	async function handleUpdateTeams() {
		try {
			showPopup("Aktualizuji teamy...")
			const res = await axios.get("/api/v1/powers/teams")
			showPopup(res.data.msg)
		} catch (error) {
			console.log(error)
			showPopup(error.response.data.msg)
		}
	}
	async function handleSubmit() {
		try {
			setIsLoading(true)
			const res = await axios.patch(
				`/api/v1/powers?socketId=${props.socketId}&header=${settings.header}`
			)
			showPopup(res.data.msg)
			setIsLoading(false)
		} catch (error) {
			console.log(error)
			showPopup(error.response.data.msg)
			setIsLoading(false)
		}
	}
	function handleSettings(event) {
		const { value, name } = event.target
		setSettings((prevSettings) => {
			return {
				...prevSettings,
				[name]: value
			}
		})
	}
	function handeSort(column) {
		setSettings((prevSettings) => {
			return {
				...prevSettings,
				sort: column
			}
		})
	}

	const fetchData = React.useCallback(async () => {
		try {
			if (settings.league === "all") {
				const res = await axios.get(`/api/v1/powers?sort=${settings.sort}`)
				setHeaders(res.data.headers)
				setTeamPowers(res.data.teams)
			} else {
				const res = await axios.get(
					`/api/v1/powers?league=${settings.league}&sort=${settings.sort}`
				)
				setHeaders(res.data.headers)
				setTeamPowers(res.data.teams)
			}
		} catch (error) {
			console.log(error)
			showPopup(error.response.data.msg)
		}
	}, [settings, showPopup])
	React.useEffect(() => {
		fetchData()
	}, [fetchData])
	// ELEMENTS
	let tableHeader
	if (headers.length > 0) {
		tableHeader = headers[0].rounds.map((h, i) => (
			<th key={h} onClick={() => handeSort(i)}>
				{h}
			</th>
		))
	}
	const powerTable = teamPowers.map((item) => {
		const teamPowers = []
		for (let i = 0; i < item.powers.length; i++) {
			teamPowers.push(<td key={i}>{item.powers[i]}</td>)
		}
		teamPowers.unshift(<td key={item.name}>{item.name}</td>)
		return <tr key={item.ppmId}>{teamPowers}</tr>
	})
	return (
		<div>
			<h2>Síly teamů</h2>
			{popup.isShown && <p className="popUp">{popup.msg}</p>}
			{isLoading && <Loading task={props.task} progress={props.progress} />}
			{!isLoading && (
				<PowerSettings
					handleUpdateTeams={handleUpdateTeams}
					handleSubmit={handleSubmit}
					handleSettings={handleSettings}
					settings={settings}
				/>
			)}
			<div className="table-container">
				<table>
					<thead>
						<tr>
							<th>Název teamu</th>
							{tableHeader}
						</tr>
					</thead>
					<tbody>{powerTable}</tbody>
				</table>
			</div>
		</div>
	)
}

export default Power
