const getPPMDate = require("../helper_functions/getPPMDate")
const scrapeTactics = require("../scraping_functions/tactics")
const scrapeNextOpponent = require("../scraping_functions/next-opponent")

const getNextOpponent = async (_req, res) => {
	const data = await scrapeNextOpponent()
	res.status(200).json(data)
}

const getTactics = async (req, res) => {
	const { numOfDays, teamId, socketId } = req.query
	const startDate = getPPMDate("start", 0)
	const sockets = req.sockets
	const socket = sockets.get(socketId)
	const data = await scrapeTactics(startDate, numOfDays, teamId, socket)
	res.status(200).json(data)
}

module.exports = {
	getNextOpponent,
	getTactics
}
