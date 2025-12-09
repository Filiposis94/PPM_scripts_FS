const scrapeFreeMarket = require('../scraping_functions/freemarket');
const scrapeSoonFreeMarket = require('../scraping_functions/soon-freemarket')
const Player = require('../models/Player')

const getFreeMarket = async (req, res)=>{
    const {cz, socketId, offset} = req.query;
    const sockets = req.sockets;
    const socket = sockets.get(socketId);
    const data = await scrapeFreeMarket(cz, socket, offset);
    res.status(200).json(data);
};

const updateSoonFreeMarket = async (req, res)=>{
    const {socketId} = req.query 
    const sockets = req.sockets;
    const socket = sockets.get(socketId);
    const data = await scrapeSoonFreeMarket(socket);
    const currentPlayers = await Player.find({})

    for(let i=0; i<data.length; i++){
        const isInDb = currentPlayers.find(player=> player.ppmId === Number(data[i].ppmId))
        if(!isInDb){
            await Player.create(data[i])
        } else {continue}
    }
    res.status(200).json({msg: 'Háči aktualizování'})
}
const getSoonFreeMarket = async (req, res)=>{
    const allPlayers = await Player.find({}).sort({ufaFrom: 1})
    res.status(200).json(allPlayers)
}

const updatePlayer = async (req, res) =>{
    const {params: {ppmId}} = req;
    await Player.findOneAndUpdate({ppmId}, req.body, {new:true, runValidators:true});
    res.status(200).json({msg: 'Player updated'})
} 

module.exports = {
    getFreeMarket,
    getSoonFreeMarket,
    updateSoonFreeMarket,
    updatePlayer
}