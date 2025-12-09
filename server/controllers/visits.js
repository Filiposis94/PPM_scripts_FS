const scrapeVisits = require('../scraping_functions/visits');

const getVisits = async (req, res)=>{
    const {startDate, numOfDays, socketId} = req.query;
    const sockets = req.sockets;
    const socket = sockets.get(socketId);
    const data = await scrapeVisits(startDate, numOfDays, socket);
    res.status(200).json(data);
};

module.exports = {
    getVisits
}