const scrapePower = require('../scraping_functions/team-power');
const scrapeTeamsPower = require('../scraping_functions/getteams-power');

const Team = require('../models/Team');
const Header = require('../models/Header');

const getTeamsPower = async (req, res)=>{
    await scrapeTeamsPower();
    res.status(200).json({msg:'Teamy úspěšně aktualizovány'})
};

const getPower = async (req, res)=>{
    const {league, sort} = req.query;
    const pipeline = [];

    if(league){
        pipeline.push({$match: {league}});
    } else {
        pipeline.push({$match: {}});
    };   
    if(sort != ''){       
        pipeline.push({
            $addFields:{
                sortingPower: {$arrayElemAt: ['$powers', Number(sort)]}
            }
        });
        pipeline.push({
            $sort: {sortingPower: -1}
        });   
    };
    const teams = await Team.aggregate(pipeline);
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
                powers:[Number(data[i].power)]
            });
        };
    } else {
        for(let i=0; i<data.length; i++){
            const team = await Team.findOne({ppmId:data[i].id});
            const prevPowers = team.powers;
            const newPowers = [...prevPowers, Number(data[i].power)];
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
    getTeamsPower,
    getPower,
    updatePowers
}