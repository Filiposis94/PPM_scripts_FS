const puppeteer = require('puppeteer');
const URLmarket = `https://hockey.powerplaymanager.com/cs/trh.html`;

const scrapeFreeMarket = async(cz, socket, offset)=>{
    // INITIALIZATION  
    socket.emit('task', 'Zahajuji proces...');
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(URLmarket, { waitUntil: 'networkidle0' });
    // 1. GETTING LIST OF PLAYERS AVAILABLE
    // FILLING MARKET INPUTS
    await page.select('#market_type','3');
    // Bid closing based on offset
    await page.type('input[name=contract_from]', `${8 + Number(offset)}`)
    await page.type('input[name=contract_to]', `${8 + Number(offset)}`);
    await page.type('input[name=index_skill_from', cz);
    await page.click('#filter_market > form > table:nth-child(5) > tbody > tr > td:nth-child(1) > button');
    await page.waitForNetworkIdle();
    // GETTING UNIQUE ID OF SEARCH FOR PAGINATION
    const idOfSearch = await page.evaluate(()=>{
        return document.querySelector('center:nth-child(6) > div > ul > li:nth-child(2) > a').href.split('-')[1];
    });
    // OTHER VARS FOR SCANING
    let marketPage = 2;
    let allPlayers = [];
    let listLength;
    // Scan first page, go to next, if there are rows do it again
    // console.log('Phase 1 Gathering players');
    socket.emit('task', 'Shromažďuji hráče...');
    do{
        // Scaning rows on a page
        const tempArray = await page.evaluate(()=>{
            let infoArray = [];
            let allRows = document.querySelectorAll('#table-1 > tbody > tr');
            for(let i = 1; i<allRows.length + 1; i++){
                // for(let i = 1; i<2; i++){ //DEV
                // Scaning each player 
                    let name = document.querySelector(`#table-1 > tbody > tr:nth-child(${i}) > td.name > a.link_name`).innerText;
                    let link = document.querySelector(`#table-1 > tbody > tr:nth-child(${i}) > td.name > a.link_name`).href;
                    let age = document.querySelector(`#table-1 > tbody > tr:nth-child(${i}) > td[title=Věk]`).innerText;
                    let sv = document.querySelector(`#table-1 > tbody > tr:nth-child(${i}) > td[title='Sportovní výdrž']`).innerText;
                    let bra = document.querySelector(`#table-1 > tbody > tr:nth-child(${i}) > td[title=Brána]`).innerHTML.split('<')[0];
                    let obr = document.querySelector(`#table-1 > tbody > tr:nth-child(${i}) > td[title=Obrana]`).innerHTML.split('<')[0];
                    let uto = document.querySelector(`#table-1 > tbody > tr:nth-child(${i}) > td[title=Útok]`).innerHTML.split('<')[0];
                    let str = document.querySelector(`#table-1 > tbody > tr:nth-child(${i}) > td[title=Střela]`).innerHTML.split('<')[0];
                    let nah = document.querySelector(`#table-1 > tbody > tr:nth-child(${i}) > td[title=Nahrávka]`).innerHTML.split('<')[0];
                    let tec = document.querySelector(`#table-1 > tbody > tr:nth-child(${i}) > td[title=Technika]`).innerHTML.split('<')[0];
                    let agr = document.querySelector(`#table-1 > tbody > tr:nth-child(${i}) > td[title=Agresivita]`).innerHTML.split('<')[0];
                    let zku = document.querySelector(`#table-1 > tbody > tr:nth-child(${i}) > td[title=Zkušenost]`).innerText;
                    let prs = document.querySelector(`#table-1 > tbody > tr:nth-child(${i}) > td[title='Preferovaná strana']`).innerText;
                    
                    infoArray.push({
                        name,
                        link,
                        age,
                        sv,
                        bra,
                        obr,
                        uto,
                        str,
                        nah,
                        tec,
                        agr,
                        zku,
                        prs
                    });
                } 
            return infoArray;
        });
        // Pushing each player object from from temp page array to final array
        for(let i=0; i<tempArray.length; i++){
            allPlayers.push(tempArray[i]);
        };
        // Checking if next page has some rows
        await page.goto(`https://hockey.powerplaymanager.com/cs/trh.html?data=${marketPage}-${idOfSearch}`,{ waitUntil: 'networkidle0' });
        const newLenght = await page.evaluate(()=>{
            return document.querySelectorAll('#table-1 > tbody > tr').length;   

        });
        listLength = newLenght;
        marketPage++
    } while (listLength >0);
    // 2. CHECKING MANAGERS OF THOSE PLAYERS
    socket.emit('task', 'Procházím managery...');
    // console.log('Phase 2 checking managers');
    for(let i=0; i<allPlayers.length;i++){
        // Emiting progress
        // console.log(`Progress ${i+1}/${allPlayers.length}`);
        const progress = Math.round(((i+1)/allPlayers.length)*100);
        socket.emit('progress',progress);
        // GOING TO HISTORY PAGE OF A PLAYER
        const playerId = allPlayers[i].link.split('=')[1].split('-')[0];
        allPlayers[i].id = playerId; //FOR React key
        const historyLink = `https://hockey.powerplaymanager.com/cs/historie-hrace.html?data=${playerId}`;
        await page.goto(historyLink, { waitUntil: 'networkidle0' });
        // FINDING LAST TEAM OF THE PLAYER
        const teamLink = await page.evaluate(()=>{
            // Last owner trade
            let lastOwner = document.querySelectorAll('.name')[1];
            if(lastOwner){
                return lastOwner.childNodes[2].href;
            } else{
                return document.querySelector('div.white_box.left_corner_none > table:nth-child(4) > tbody > tr:nth-child(1) > td.tr0td2 > a').href;
            };
        });
        // GOING TO TO TEAM PAGE
        await page.goto(teamLink, { waitUntil: 'networkidle0' });
        // FINDING MANAGER PROFILE URL
        const profileLink = await page.evaluate(()=>{
            let profile = document.querySelector('div.h1_header > div:nth-child(1) > div:nth-child(4) > a');
            if(profile && profile.title != 'Pozvi kamaráda do ligy'){
                return profile.href;
            }
            else {
                return 'Bez manažera';
            };
        });
        // GOING TO MANAGER PROFILE URL AND GETTING LAST LOGIN - IF POSSIBLE
        if(profileLink != 'Bez manažera'){
            await page.goto(profileLink, { waitUntil: 'networkidle0' });
            const lastLogin = await page.evaluate(()=>{
                return document.querySelectorAll('.table_profile > tbody > tr:nth-child(1)')[1].innerText;
            });
            allPlayers[i].lastLogin = lastLogin;
        } else {
            allPlayers[i].lastLogin = '00-Bez manažera'
        };
    };
    await browser.close();
    // 3. SORTING AND EXPORTING DATA
    socket.emit('task',''); //Reseting the value
    allPlayers.sort((a, b)=>{
        if(a.lastLogin > b.lastLogin){
            return 1;
        } else if(b.lastLogin > a.lastLogin){
            return -1;
        } else return 0;
        });
    return allPlayers;
};

module.exports = scrapeFreeMarket;