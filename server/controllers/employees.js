const scrapeEmployeeHistory = require('../scraping_functions/employee-history')
const Employee = require('../models/Employee')

const updateEmployeeHistory = async (req, res)=>{
    res.status(202).json({status:'started'});
    setImmediate(async ()=>{
        console.log('Starting scrape')
        const data = await scrapeEmployeeHistory();
        console.log('Scrape finished successfully')
        const startOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setUTCHours(23, 59, 59, 999);
        console.log('Saving to DB...')
        
        const currentDayTrades = await Employee.find({tradedAt: { $gte: startOfDay, $lt: endOfDay } })
        
        for(let i=0; i<data.length; i++){
            const isInDb = currentDayTrades.find(emp=> emp.ppmId === Number(data[i].ppmId))
            const  [hours, minutes, seconds] = data[i].time.split(':').map(Number)
            
            if(!isInDb){
                const date = new Date()
                await Employee.create({...data[i], tradedAt:date.setUTCHours(hours, minutes, seconds)})
            } else {continue}
        }
    })
}

module.exports = {
    updateEmployeeHistory
}