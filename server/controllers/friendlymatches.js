const scrapeAvailableDates = require("../scraping_functions/available-dates")
const scrapeTeams = require("../scraping_functions/getteams")
const getPPMDate = require("../helper_functions/getPPMDate")
const scrapeEverything = require("../scraping_functions/friendly-matches")
const { BadRequestError } = require("../errors")
const isValidDateFormat = require("../helper_functions/isValidDateFormat")

const getFriendlyMatches = async (req, res) => {
	const { tk, dates, socketId, moreData } = req.query
	const datesArray = dates.split(",").filter(isValidDateFormat)
	const sockets = req.sockets
	const socket = sockets.get(socketId)
	const actualBoolean = moreData === "true"

	const parsedTk = Number(tk)
	if (!Number.isFinite(parsedTk)) {
		throw new BadRequestError("TK must be a number")
	}
	const data = await scrapeEverything(datesArray, tk, socket, actualBoolean)
	res.status(200).json(data)
}
const getAvailableDates = async (_req, res) => {
	const startDate = getPPMDate("start", 0)
	const data = await scrapeAvailableDates(startDate)
	res.status(200).json(data)
}
const updateTeams = async (_req, res) => {
	await scrapeTeams()
	res.status(200).json({ msg: "Teamy úspěšně aktualizovány" })
}

module.exports = {
	getFriendlyMatches,
	getAvailableDates,
	updateTeams
}
