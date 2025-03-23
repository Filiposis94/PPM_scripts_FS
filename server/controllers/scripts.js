const getPPMDate = require('../helper_functions/getPPMDate');
const scrapeFreeMarket = require('../scraping_functions/freemarket');
const scrapeAvailableDates = require('../scraping_functions/available-dates');
const scrapeTeams = require('../scraping_functions/getteams');
const scrapeEverything = require('../scraping_functions/friendly-matches');
const scrapeVisits = require('../scraping_functions/visits');
const scrapeTactics = require('../scraping_functions/tactics');
const scrapeNextOpponent = require('../scraping_functions/next-opponent');
const scrapePower = require('../scraping_functions/team-power');
const scrapeTeamsPower = require('../scraping_functions/getteams-power');

const getFreeMarket = async (req, res)=>{
    const {cz, socketId} = req.query;
    const sockets = req.sockets;
    const socket = sockets.get(socketId);
    const data = await scrapeFreeMarket(cz, socket);
    res.status(200).json(data);
};
const getFriendlyMatches = async (req, res)=>{
    const {tk, dates, socketId} = req.query;
    const datesArray = dates.split(',');
    const sockets = req.sockets;
    const socket = sockets.get(socketId);
    const data = await scrapeEverything(datesArray, tk, socket);
    res.status(200).json(data);
};
const getAvailableDates = async (req, res)=>{
    const startDate = getPPMDate('start', 0);
    const data = await scrapeAvailableDates(startDate);
    res.status(200).json(data);
};
const getTactics = async (req, res)=>{
    const {numOfDays, teamId, socketId} = req.query;
    const startDate = getPPMDate('start', 0);
    const sockets = req.sockets;
    const socket = sockets.get(socketId);
    const data = await scrapeTactics(startDate, numOfDays, teamId, socket);
    res.status(200).json(data);
};
const getVisits = async (req, res)=>{
    const {startDate, numOfDays, socketId} = req.query;
    const sockets = req.sockets;
    const socket = sockets.get(socketId);
    const data = await scrapeVisits(startDate, numOfDays, socket);
    res.status(200).json(data);
};
const getTeams = async (req, res)=>{
    await scrapeTeams();
    res.status(200).json({msg:'Teamy úspěšně aktualizovány'})
};

const getNextOpponent = async (req, res) =>{
    const data = await scrapeNextOpponent();
    res.status(200).json(data);
};

const getTeamsPower = async (req, res)=>{
    await scrapeTeamsPower();
    res.status(200).json({msg:'Teamy úspěšně aktualizovány'})
};

const getPower = async (req, res)=>{
    const {socketId, header} = req.query;
    const sockets = req.sockets;
    const socket = sockets.get(socketId);
    const data = await scrapePower(socket, header);
    res.status(200).json(data);
};

module.exports = {
    getFreeMarket,
    getFriendlyMatches,
    getTactics,
    getVisits,
    getAvailableDates,
    getTeams,
    getNextOpponent,
    getTeamsPower,
    getPower
};