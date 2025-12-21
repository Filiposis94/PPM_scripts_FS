const scrapeAvailableDates = require('../scraping_functions/available-dates');
const scrapeTeams = require('../scraping_functions/getteams');
const getPPMDate = require('../helper_functions/getPPMDate');
const scrapeEverything = require('../scraping_functions/friendly-matches');


const getFriendlyMatches = async (req, res)=>{
    const {tk, dates, socketId, moreData} = req.query;
    const datesArray = dates.split(',');
    const sockets = req.sockets;
    const socket = sockets.get(socketId);
    const actualBoolean = moreData === 'true'? true : false

    const data = await scrapeEverything(datesArray, tk, socket, actualBoolean);
    res.status(200).json(data);
};
const getAvailableDates = async (req, res)=>{
    const startDate = getPPMDate('start', 0);
    const data = await scrapeAvailableDates(startDate);
    res.status(200).json(data);
};
const updateTeams = async (req, res)=>{
    await scrapeTeams();
    res.status(200).json({msg:'Teamy úspěšně aktualizovány'})
};

module.exports = {
    getFriendlyMatches,
    getAvailableDates,
    updateTeams
}