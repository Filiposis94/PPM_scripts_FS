const scrapeFreeMarket = require("../scraping_functions/freemarket")
const scrapeSoonFreeMarket = require("../scraping_functions/soon-freemarket")
const Player = require("../models/Player")
const { BadRequestError } = require("../errors")

const getFreeMarket = async (req, res) => {
	const { cz, socketId, offset } = req.query
	const sockets = req.sockets
	const socket = sockets.get(socketId)
	const parsedOffset = Number(offset)
	const parsedCZ = Number(cz)
	if (!Number.isFinite(parsedOffset) || !Number.isFinite(parsedCZ)) {
		throw new BadRequestError("Offset or CZ must be a number")
	}
	const data = await scrapeFreeMarket(parsedCZ, socket, parsedOffset)
	res.status(200).json(data)
}

const updateSoonFreeMarket = async (req, res) => {
	const { socketId } = req.query
	const sockets = req.sockets
	const socket = sockets.get(socketId)
	const data = await scrapeSoonFreeMarket(socket)
	const currentPlayers = await Player.find({})

	for (let i = 0; i < data.length; i++) {
		const isInDb = currentPlayers.find(
			(player) => player.ppmId === Number(data[i].ppmId)
		)

		if (isInDb) {
			continue
		}
		await Player.create(data[i])
	}
	res.status(200).json({ msg: "Háči aktualizování" })
}
const getSoonFreeMarket = async (_req, res) => {
	const allPlayers = await Player.find({}).sort({ ufaFrom: 1 })
	res.status(200).json(allPlayers)
}

const updatePlayer = async (req, res) => {
	const {
		params: { ppmId }
	} = req
	await Player.findOneAndUpdate({ ppmId }, req.body, {
		new: true,
		runValidators: true
	})
	res.status(200).json({ msg: "Player updated" })
}

module.exports = {
	getFreeMarket,
	getSoonFreeMarket,
	updateSoonFreeMarket,
	updatePlayer
}
