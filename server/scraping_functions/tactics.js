const puppeteer = require('puppeteer');
const URLcalendar = `https://hockey.powerplaymanager.com/cs/kalendar.html`;
const getPPMDateMinus = require('../helper_functions/getPPMDateMinus');

const scrapeTactics = async (startDate, numOfDays, teamId, socket)=>{
    // INITIALIZATION
    socket.emit('task', 'Zahajuji proces...');
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(URLcalendar, { waitUntil: 'networkidle0' });
    let finalData = [];
    socket.emit('task', 'Procházím kalendář...' ); 
    // CHECKING CALENDAR
    for(let i=1; i<=numOfDays; i++){
        // EMIT Progesss
        const progress = Math.round((i/numOfDays)*100);
        socket.emit('progress',progress);
        let datePPM = getPPMDateMinus(startDate,i);
        // console.log(datePPM);
        await page.goto(`${URLcalendar}?data=${teamId}-${datePPM}`,{ waitUntil: 'load' });
        // EVALUATE SKIP - if there was a match
        let skip = await page.evaluate(()=>{
            if(document.querySelector('div.calendary_center > span:nth-child(3)')){
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
                let matchType = document.querySelector('div.calendary_center > span:nth-child(3)').innerText;
                let urlMatch = document.querySelector('div.button.report_icon > a').href;
                return {dayOfSeason, matchType, urlMatch};
            });
            // EVALUATE MATCH REPORT
            await page.goto(dataCalendar.urlMatch, { waitUntil: 'load' });
            const dataMatch = await page.evaluate((teamId)=>{
                let mainTactics;
                let ppTactics;
                let pkTactics;
                let homeTeamUrl = document.querySelector('#top > div:nth-child(12) > table > tbody > tr:nth-child(1) > td.left_align.tr1td1 > a').href;
                let sOindicator = document.querySelector('.info').innerText.includes('Po samostatných nájezdech');
                // IF Shoot Out
                if(sOindicator){
                    if(homeTeamUrl.includes(teamId)){
                        mainTactics = document.querySelectorAll('.white_box')[9].querySelectorAll('tr')[2].childNodes[1].innerText;
                        ppTactics = document.querySelectorAll('.white_box')[9].querySelectorAll('tr')[3].childNodes[1].innerText;
                        pkTactics = document.querySelectorAll('.white_box')[9].querySelectorAll('tr')[4].childNodes[1].innerText;
                    } else{
                        mainTactics = document.querySelectorAll('.white_box')[9].querySelectorAll('tr')[2].childNodes[5].innerText;
                        ppTactics = document.querySelectorAll('.white_box')[9].querySelectorAll('tr')[3].childNodes[5].innerText;
                        pkTactics = document.querySelectorAll('.white_box')[9].querySelectorAll('tr')[4].childNodes[5].innerText;
                    };
                } else {
                    if(homeTeamUrl.includes(teamId)){
                        mainTactics = document.querySelectorAll('.white_box')[8].querySelectorAll('tr')[2].childNodes[1].innerText;
                        ppTactics = document.querySelectorAll('.white_box')[8].querySelectorAll('tr')[3].childNodes[1].innerText;
                        pkTactics = document.querySelectorAll('.white_box')[8].querySelectorAll('tr')[4].childNodes[1].innerText;
                    } else{
                        mainTactics = document.querySelectorAll('.white_box')[8].querySelectorAll('tr')[2].childNodes[5].innerText;
                        ppTactics = document.querySelectorAll('.white_box')[8].querySelectorAll('tr')[3].childNodes[5].innerText;
                        pkTactics = document.querySelectorAll('.white_box')[8].querySelectorAll('tr')[4].childNodes[5].innerText;
                    };
                };
                return {mainTactics, ppTactics, pkTactics};  
            }, teamId);
            // FINAL DATA
            finalData.push({day:dataCalendar.dayOfSeason, matchType:dataCalendar.matchType, link:dataCalendar.urlMatch, mainTactics: dataMatch.mainTactics, ppTactics:dataMatch.ppTactics, pkTactics:dataMatch.pkTactics});
        };
    };
    // JOINING DATA AND SENDING FINAL OBJECT
    const mainAr = finalData.map(data=>data.mainTactics).join(' / ').split(' / ');
    const ppAr = finalData.map(data=>data.ppTactics).join(' / ').split(' / ');
    const pkAr = finalData.map(data=>data.pkTactics).join(' / ').split(' / ');
    
    const nor = mainAr.filter(tactic => tactic === 'Normální');
    const def = mainAr.filter(tactic => tactic === 'Defenzivní');
    const off = mainAr.filter(tactic => tactic === 'Ofenzivní');
    const akt = mainAr.filter(tactic => tactic === 'Aktivní napadání');
    const pro = mainAr.filter(tactic => tactic === 'Protiútoky');
    const kou = mainAr.filter(tactic => tactic === 'Kouskování hry');
    
    const str = ppAr.filter(tactic => tactic === 'Střelba od modré');
    const des = ppAr.filter(tactic => tactic === 'Deštník');
    const pre = ppAr.filter(tactic => tactic === 'Přetížení');
    
    const dia = pkAr.filter(tactic => tactic === 'Diamant');
    const akto = pkAr.filter(tactic => tactic === 'Aktivní obdélník');
    const pas = pkAr.filter(tactic => tactic === 'Pasivní obdélník');

    const finalObj = {
        nor: Math.round((nor.length/mainAr.length)*100),
        def: Math.round((def.length/mainAr.length)*100),
        off: Math.round((off.length/mainAr.length)*100),
        akt: Math.round((akt.length/mainAr.length)*100),
        pro: Math.round((pro.length/mainAr.length)*100),
        kou: Math.round((kou.length/mainAr.length)*100),
        str: Math.round((str.length/ppAr.length)*100),
        des: Math.round((des.length/ppAr.length)*100),
        pre: Math.round((pre.length/ppAr.length)*100),
        dia: Math.round((dia.length/pkAr.length)*100),
        akto: Math.round((akto.length/pkAr.length)*100),
        pas: Math.round((pas.length/pkAr.length)*100),
        all: finalData
    };
    socket.emit('task', '');
    await browser.close();
    return finalObj;
};

module.exports = scrapeTactics;