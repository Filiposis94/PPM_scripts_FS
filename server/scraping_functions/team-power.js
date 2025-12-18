const puppeteer = require('puppeteer');
const URLteam =`https://hockey.powerplaymanager.com/cs/tym.html`;
const fs = require('fs');
const path = require('path')

const scrapePower = async(socket)=>{
    socket.emit('task', 'Zahajuji proces...');
    // GETTING TEAMS
    const teamsPath = path.join(__dirname, '../files/teams-power.txt');      
    const teams = fs.readFileSync(teamsPath, {encoding: 'utf8'}).split('\n');
    // INITIALIZATION
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(URLteam, { waitUntil: 'networkidle0' });
    let finalData = [];
    socket.emit('task', 'Sbírám data...');
    // GATHERING INFORMATION
    for(let i=0; i< teams.length; i++){
        // Emiting progress
        const progress = Math.round(((i+1)/teams.length)*100);
        socket.emit('progress',progress);
        // console.log(`Progress ${i+1}/${teams.length}`)
        await page.goto(`${URLteam}?data=${teams[i]}`, { waitUntil: 'load' });
        // GATHERING TEAM DATA
        const teamData = await page.evaluate(()=>{
            let power = document.querySelector('div.profile_center_column > table:nth-child(1) > tbody > tr:nth-child(5) > td.tr0td2 > strong').innerText;   
            let name = document.querySelector('div.main_content > div.column_center_full > div.white_box.left_corner_none > div.profile_center_column > table:nth-child(3) > thead > tr > td.left_align').innerText;   
            let league = document.querySelector("body > div:nth-child(5) > div.h1_div > div.h1_header > div:nth-child(1) > div:nth-child(3) > a").innerText;
            return {
            power,
            name,
            league
            };
        });
        // PUSHING FINAL DATA OF A MATCH       
        finalData.push({id:`${teams[i]}`, power:teamData.power, name:teamData.name, league:teamData.league});       
    };
    await browser.close();
    socket.emit('task',''); //Reseting the value
    socket.emit('progress',0);
    return finalData;
};

module.exports = scrapePower;