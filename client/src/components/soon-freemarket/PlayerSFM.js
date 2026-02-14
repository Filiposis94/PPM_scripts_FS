function PlayerSFM(props) {
	const player = props.data

	let ufaDate
	if (new Date(player.ufaFrom) > new Date()) {
		ufaDate = player.ufaFrom.split("T")[0]
	} else {
		const days = 1000 * 60 * 60 * 24
		const daysLeft = Math.ceil((new Date(player.ufaTo) - new Date.now()) / days)
		ufaDate = `On UFA (${daysLeft})`
	}
	const interestedIn = player.interestedIn
	return (
		<div className="flex player">
			<div className="attribute">
				<p className="attribute-name">Name</p>
				<p>
					<a href={player.link} target="blank">
						{player.name}
					</a>
				</p>
			</div>
			<div className="attribute">
				<p className="attribute-name">Age</p>
				<p>{player.age}</p>
			</div>
			<div className="attribute">
				<p className="attribute-name">SV</p>
				<p>{player.sv}</p>
			</div>
			<div className="attribute">
				<p className="attribute-name">Bra</p>
				<p>{player.bra}</p>
			</div>
			<div className="attribute">
				<p className="attribute-name">Obr</p>
				<p>{player.obr}</p>
			</div>
			<div className="attribute">
				<p className="attribute-name">Uto</p>
				<p>{player.uto}</p>
			</div>
			<div className="attribute">
				<p className="attribute-name">Str</p>
				<p>{player.str}</p>
			</div>
			<div className="attribute">
				<p className="attribute-name">Nah</p>
				<p>{player.nah}</p>
			</div>
			<div className="attribute">
				<p className="attribute-name">Tec</p>
				<p>{player.tec}</p>
			</div>
			<div className="attribute">
				<p className="attribute-name">Agr</p>
				<p>{player.agr}</p>
			</div>
			<div className="attribute">
				<p className="attribute-name">Zku</p>
				<p>{player.zku}</p>
			</div>
			<div className="attribute">
				<p className="attribute-name">Prs</p>
				<p>{player.prs}</p>
			</div>
			<div className="attribute">
				<p className="attribute-name">UFA date</p>
				<p title={player.ufaTo}>{ufaDate}</p>
			</div>
			<div className="attribute">
				<p className="attribute-name">Interested</p>
				<input
					type="checkbox"
					checked={interestedIn}
					onChange={() => {
						props.handleToggle(player.ppmId, !interestedIn)
					}}
				/>
			</div>
		</div>
	)
}

export default PlayerSFM
