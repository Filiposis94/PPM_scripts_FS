function VisitsData(props) {
	const visits = props.data
	return (
		<tr>
			<td>{visits.day}</td>
			<td>{visits.team}</td>
			<td>{visits.visitors}</td>
		</tr>
	)
}

export default VisitsData
