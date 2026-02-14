function AvailableDate(props) {
	const classes = props.data.isSelected === true ? "button green" : "button"
	return (
		<button
			type="button"
			className={classes}
			onClick={() => {
				props.handleSelect(props.data.value)
			}}
		>
			{props.data.value}
		</button>
	)
}

export default AvailableDate
