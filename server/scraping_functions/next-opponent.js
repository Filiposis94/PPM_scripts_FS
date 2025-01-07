const puppeteer = require('puppeteer');
const URLcalendar = `https://hockey.powerplaymanager.com/cs/kalendar.html`;
const getPPMDate = require('../helper_functions/getPPMDate');

const scrapeNextOpponent = async (startDate)=>{
    // INITIALIZATION  
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(URLcalendar, { waitUntil: 'networkidle0' });
    let finalData = [];
    let today = getPPMDate('start', 0);
    let tommorow = getPPMDate(today,1);
    
    // GOING TO CALENDAR
    await page.goto(`${URLcalendar}?data=${129335}-${today}`,{ waitUntil: 'load' });
    // CHECK IF SMALL ICON H or A
    let resultToday = await page.evaluate(()=>{
        return document.querySelector("div.calendary  div.type_selected  div.cal_h_a") ? false : true;
    });
    let todayOp = await page.evaluate(()=>{
        let link = document.querySelector("div.calendary div.type_selected div.cal_teamname > a").href;
        return link.split('=')[1].split('-')[0];       
        
    });
    await page.goto(`${URLcalendar}?data=${129335}-${tommorow}`,{ waitUntil: 'load' });
    let tommorowOp = await page.evaluate(()=>{
        let link = document.querySelector("div.calendary div.type_selected div.cal_teamname > a").href;
        return link.split('=')[1].split('-')[0];       
        
    });
    
    await browser.close();
    return resultToday ? tommorowOp : todayOp;
    
};

module.exports = scrapeNextOpponent;
