const getPPMDateMinus = (datePPM, days) => {
	let dateObject
	if (datePPM === "start") {
		dateObject = new Date()
	} else {
		const splitPPMDate = datePPM.split("-")
		const date = `${splitPPMDate[2]}-${splitPPMDate[1]}-${splitPPMDate[0]}`
		dateObject = new Date(date)
		dateObject.setDate(dateObject.getDate() - days)
	}
	const day = `0${dateObject.getDate()}`.slice(-2)
	const month = `0${dateObject.getMonth() + 1}`.slice(-2)
	const year = dateObject.getFullYear()
	result = `${day}-${month}-${year}`
	return result
}

module.exports = getPPMDateMinus
