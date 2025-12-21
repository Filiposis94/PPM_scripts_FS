const puppeteer = require('puppeteer');
const URLcalendar = `https://hockey.powerplaymanager.com/cs/kalendar.html`;
const URLteam =`https://hockey.powerplaymanager.com/cs/tym.html`;
const URLstadium = `https://hockey.powerplaymanager.com/cs/stadion.html`
const URLhistory = `https://hockey.powerplaymanager.com/cs/historie-tymu.html`
const fs = require('fs');
const path = require('path')

const scrapeEverything = async(dates, tk, socket, moreData)=>{
    socket.emit('task', 'Zahajuji proces...');
    // GETTING TEAMS
    const teamsPath = path.join(__dirname, '../files/teams.txt');      
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
            let stadium = document.querySelector('div.profile_center_column > table:nth-child(3) > tbody > tr:nth-child(4) > td.tr1td2.left_align').innerText;
            let tk = document.querySelector('div.profile_center_column > table:nth-child(1) > tbody > tr:nth-child(6) > td > div:nth-child(2)').innerText.trim();
            let position = document.querySelectorAll('div.h1_add_info')[1].innerText.split('Pozice ')[1].split(')')[0]
            // Clearing bad data from teams without manager
            if(tk.includes('/')){
            tk = 0;
            };
            return {
            stadium,
            tk,
            position
            };
        });
        // SKIPPING TEAMS WITH LOW TK
        if(teamData.tk.length <6){continue};
        if(teamData.tk < tk){continue};
        //SKIP MY TEAM
        if(teams[i] === '129335'){continue}
        // GATHERING STADIUM DATA
        await page.goto(`${URLstadium}?data=${teams[i]}`, {waitUntil: 'load'});
        const stadiumData = await page.evaluate(()=>{
            let smallPucks = document.querySelectorAll('img[src="https://appspowerplaymanager.vshcdn.net/images/hockey/icon_puck/puck_14_on.png"]').length;
            let bigPucks = document.querySelectorAll('img[src="https://appspowerplaymanager.vshcdn.net/images/hockey/icon_puck/puck_30_on.png"]').length; 
            return {
            smallPucks,
            bigPucks
            };
        });
        let npPlacement;
        if(moreData){
            let url = `${URLhistory}?data=${teams[i]}`
            await page.goto(url, { waitUntil: 'load' });
            const historyData = await page.evaluate(()=>{
                const historyRows = document.querySelectorAll('#table-2 > tbody > tr')
                for(let i = 0; i < historyRows.length; i++){
                    if(historyRows[i].innerText.includes('árodního poháru') || historyRows[i].innerText.includes('árodním poháru')){
                        return {
                            npPlacement: historyRows[i].innerText.includes('\t')? historyRows[i].innerText.trim().split()[2] : historyRows[i].innerText.trim()
                        }
                    }
                }
            })  
            npPlacement = historyData.npPlacement             
        }
        // SCANNING CALENDAR
        for(let j=0; j< dates.length; j++){
            let url = `${URLcalendar}?data=${teams[i]}-${dates[j]}`;
            await page.goto(url, { waitUntil: 'load' });                
            let data = await page.evaluate(() => {
                let availability
                if(document.querySelector('.type_head')){
                    availability = 'match'
                } else {
                    availability = 'free'
                }
                return {availability};
            });
            // PUSHING FINAL DATA OF A MATCH
            const finalObject = {id:`${teams[i]}-${dates[j]}`, date: dates[j],url, availability:data.availability, capacity:teamData.stadium, tk:teamData.tk, position: teamData.position, sP:stadiumData.smallPucks, bP:stadiumData.bigPucks}
            if(moreData){
                finalObject.npPlacement = npPlacement
            }
            finalData.push(finalObject)
        };
    };
    await browser.close();
    socket.emit('task',''); //Reseting the value
    socket.emit('progress', 0)
    // FILTERING AND SORTING DATA
    let filteredData = finalData.filter(item =>item.availability == 'free');
    filteredData.sort((a, b)=>{
    if(a.tk > b.tk){
        return -1;
    } else if(b.tk > a.tk){
        return 1;
    } else return 0;
    });
    return filteredData;
};

module.exports = scrapeEverything;