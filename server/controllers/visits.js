const scrapeVisits = require("../scraping_functions/visits")
const isValidDateFormat = require("../helper_functions/isValidDateFormat")
const { BadRequestError } = require("../errors")

const getVisits = async (req, res) => {
	const { startDate, numOfDays, socketId } = req.query
	const sockets = req.sockets
	const socket = sockets.get(socketId)
	const parsedNumOfDays = Number(numOfDays)
	if (!Number.isFinite(parsedNumOfDays)) {
		throw new BadRequestError("NumOfDays must be a number")
	}
	const parsedStartDate = isValidDateFormat(startDate)
	if (!parsedStartDate) {
		throw new BadRequestError("Start date incorrect format")
	}
	const data = await scrapeVisits(startDate, numOfDays, socket)
	res.status(200).json(data)
}

module.exports = {
	getVisits
}
