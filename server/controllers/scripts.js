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

const Team = require('../models/Team');
const Header = require('../models/Header');

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
    const {league} = req.query;
    const queryObject = {};

    if(league){
        queryObject.league = league;
    }

    const teams = await Team.find(queryObject);
    const headers = await Header.find();
    res.status(200).json({teams, headers});
};
const updatePowers = async (req, res)=>{
    const {socketId, header} = req.query;
    const sockets = req.sockets;
    const socket = sockets.get(socketId);
    const data = await scrapePower(socket);
    const teamsDB = await Team.find();
    const headersDB = await Header.find();   
    if(teamsDB.length < 1){
        for(let i=0; i< data.length; i++){
            const newTeam = await Team.create({
                name: data[i].name,
                league: data[i].league,
                ppmId: data[i].id,
                powers:[data[i].power]
            });
        };
    } else {
        for(let i=0; i<data.length; i++){
            const team = await Team.findOne({ppmId:data[i].id});
            const prevPowers = team.powers;
            const newPowers = [...prevPowers, data[i].power];
            const updatedTeam = await Team.findOneAndUpdate({ppmId:data[i].id}, {powers:newPowers})
        }
    }
    if(headersDB.length < 1){
        const newHeader = await Header.create({rounds:[header]})
    } else {
        const roundsArr = headersDB[0].rounds;
        const newValues = [...roundsArr, header];
        const updateHeaders = await Header.findOneAndUpdate({_id: headersDB[0]._id}, {rounds:newValues});
    };

    res.status(200).json({msg:'Síly úspěšně aktualizovány'})
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
    getPower,
    updatePowers
};