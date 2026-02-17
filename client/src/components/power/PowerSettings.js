function PowerSettings(props) {
	return (
		<div className="settings">
			<h3>Nastavení</h3>
			<p>
				<button
					type="button"
					className="button"
					onClick={props.handleUpdateTeams}
				>
					Aktualizuj teamy
				</button>
			</p>
			<form onSubmit={props.handleSubmit} autoComplete="off">
				<p>
					<label htmlFor="header">Header:</label>
					<input
						type="text"
						name="header"
						value={props.settings.tk}
						onChange={props.handleSettings}
						required
					></input>
				</p>
				<button type="submit" className="button">
					Stáhni sílu teamů
				</button>
				<select name="league" onChange={props.handleSettings}>
					<option value="all">All</option>
					<option value="I.1">I.1</option>
					<option value="II.1">II.1</option>
					<option value="II.2">II.2</option>
					<option value="II.3">II.3</option>
					<option value="II.4">II.4</option>
				</select>
			</form>
		</div>
	)
}

export default PowerSettings
