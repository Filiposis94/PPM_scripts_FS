const puppeteer = require('puppeteer');
const URLcalendar = `https://hockey.powerplaymanager.com/cs/kalendar.html`;
const getPPMDate = require('../helper_functions/getPPMDate');

const scrapeVisits = async (startDate, numOfDays, socket)=>{
    // INITALIZATION
    socket.emit('task', 'Zahajuji proces...')
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(URLcalendar, { waitUntil: 'networkidle0' });
    let finalData =[];
    // SCANNING CALENDAR
    socket.emit('task', 'Procházím kalendář...');
    for(let i=0; i<numOfDays; i++){
        // Emit progress
        const progress = Math.round(((i+1)/numOfDays)*100);
        socket.emit('progress',progress);
        let datePPM = getPPMDate(startDate,i)
        // console.log(datePPM);
        await page.goto(`${URLcalendar}?data=${129335}-${datePPM}`,{ waitUntil: 'load' });
        // EVALUATING SKIP - days NO match, only friendly match, no results for the match yet
        let skip = await page.evaluate(()=>{
            if(document.querySelector('div.calendary_center > span:nth-child(3)') && 
            document.querySelector('div.calendary_center > span:nth-child(3)').innerText.includes('Přátelský zápas') && 
            document.querySelector('div.result_center')){
                return false;
            } else {
                return true;
            };
        });
        if(skip){
            continue
        } else {
            // EVALUATE CALENDAR
            const dataCalendar = await page.evaluate(()=>{
                let dayOfSeason = document.getElementById('day_in_season').innerText.split(' ')[1];
                let urlMatch = document.querySelector('div.button.report_icon > a').href;
                return {dayOfSeason,urlMatch};
            });
            // EVALUATE MATCH REPORT
            await page.goto(dataCalendar.urlMatch, { waitUntil: 'load' });
            const dataMatch = await page.evaluate(()=>{
                let visitors = document.querySelector('div.report_head_content.info').innerHTML.split('<br>')[3].split(': ')[1];
                let team;
                let homeTeam = document.querySelector("div.report_header_left").innerText;
                let awayTeam = document.querySelector("div.report_header_right").innerText;
                if(homeTeam == 'HC Kosatky Chotěbuz'){
                    team = awayTeam;
                } else {
                    team = homeTeam;
                };
                return {visitors, team};             
            });
            // FINAL DATA
            finalData.push({day:dataCalendar.dayOfSeason, team: dataMatch.team, visitors: dataMatch.visitors});    
        }
    }
    socket.emit('task', '');
    socket.emit('progress', 0);
    await browser.close();
    return finalData;
};

module.exports = scrapeVisits;