import React from "react"

function TacticsResults(props) {
	const [tacticScreen, setTacticScreen] = React.useState("main")

	const mainTactics = props.tacticsResults.all.map((t) => (
		<tr key={t.day}>
			<td>
				<a href={t.link} target="blank">
					{t.matchType}
				</a>
				:
			</td>
			<td>{t.mainTactics}</td>
		</tr>
	))
	const ppTactics = props.tacticsResults.all.map((t) => (
		<tr key={t.day}>
			<td>
				<a href={t.link} target="blank">
					{t.matchType}
				</a>
				:
			</td>
			<td>{t.ppTactics}</td>
		</tr>
	))
	const pkTactics = props.tacticsResults.all.map((t) => (
		<tr key={t.day}>
			<td>
				<a href={t.link} target="blank">
					{t.matchType}
				</a>
				:
			</td>
			<td>{t.pkTactics}</td>
		</tr>
	))

	const handleScreen = (screen) => {
		setTacticScreen(screen)
	}

	let tacticsDisplay
	switch (tacticScreen) {
		case "main":
			tacticsDisplay = mainTactics
			break
		case "pp":
			tacticsDisplay = ppTactics
			break
		case "pk":
			tacticsDisplay = pkTactics
			break
		default:
			tacticsDisplay = ""
	}

	return (
		<div>
			<table>
				<thead>
					<tr>
						<th>Hlavní taktika</th>
						<th>Poměr taktiky</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Normální</td>
						<td>{props.tacticsResults.nor} %</td>
					</tr>
					<tr>
						<td>Defenzivní</td>
						<td>{props.tacticsResults.def} %</td>
					</tr>
					<tr>
						<td>Ofenzivní</td>
						<td>{props.tacticsResults.off} %</td>
					</tr>
					<tr>
						<td>Aktivní napadání</td>
						<td>{props.tacticsResults.akt} %</td>
					</tr>
					<tr>
						<td>Protiútoky</td>
						<td>{props.tacticsResults.pro} %</td>
					</tr>
					<tr>
						<td>Kouskování hry</td>
						<td>{props.tacticsResults.kou} %</td>
					</tr>
				</tbody>
			</table>
			<table>
				<thead>
					<tr>
						<th>Přesilovky</th>
						<th>Poměr taktiky</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Střelba od modré</td>
						<td>{props.tacticsResults.str} %</td>
					</tr>
					<tr>
						<td>Deštník</td>
						<td>{props.tacticsResults.des} %</td>
					</tr>
					<tr>
						<td>Přetižení</td>
						<td>{props.tacticsResults.pre} %</td>
					</tr>
				</tbody>
			</table>
			<table>
				<thead>
					<tr>
						<th>Oslabení</th>
						<th>Poměr taktiky</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Diamant</td>
						<td>{props.tacticsResults.dia} %</td>
					</tr>
					<tr>
						<td>Pasivní obdélník</td>
						<td>{props.tacticsResults.pas} %</td>
					</tr>
					<tr>
						<td>Aktivní obdélník</td>
						<td>{props.tacticsResults.akto} %</td>
					</tr>
				</tbody>
			</table>
			<p className="settings">
				{" "}
				&gt; Střelba &gt; Pasivní &gt; Přetižení &gt; Diamant &gt; Deštník &gt;
				Aktivní &gt;
			</p>
			<p className="settings">
				<button
					type="button"
					className="button"
					onClick={() => {
						handleScreen("main")
					}}
				>
					Hlavní
				</button>
				<button
					type="button"
					className="button"
					onClick={() => {
						handleScreen("pp")
					}}
				>
					Přesilovky
				</button>
				<button
					type="button"
					className="button"
					onClick={() => {
						handleScreen("pk")
					}}
				>
					Oslabení
				</button>
			</p>
			<table>
				<thead>
					<tr>
						<th>Zápas</th>
						<th>Taktiky</th>
					</tr>
				</thead>
				<tbody>{tacticsDisplay}</tbody>
			</table>
		</div>
	)
}

export default TacticsResults
