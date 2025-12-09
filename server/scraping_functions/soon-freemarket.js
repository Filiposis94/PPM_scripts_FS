const puppeteer = require('puppeteer');
const URLmarket = `https://hockey.powerplaymanager.com/cs/trh.html`;

const scrapeSoonFreeMarket = async(socket)=>{
    // INITIALIZATION  
    socket.emit('task', 'Zahajuji proces...');
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(URLmarket, { waitUntil: 'networkidle0' });
    // 1. GETTING LIST OF PLAYERS AVAILABLE
    
    // FILLING MARKET INPUTS
    await page.select('#market_type','1');
    await page.type('input[name=age_from]', '26');
    await page.type('input[name=contract_to]', '40');
    await page.type('input[name=index_skill_from', '2000');

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
    socket.emit('task', 'Shromažďuji hráče...');
    do{
        // Scaning rows on a page
        const tempArray = await page.evaluate(()=>{
            let infoArray = [];
            let allRows = document.querySelectorAll('#table-1 > tbody > tr');
            for(let i = 1; i<allRows.length + 1; i++){
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
                    
                    const ppmId = link.split('=')[1].split('-')[0];

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
                        prs,
                        ppmId
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
        const newLength = await page.evaluate(()=>{
            return document.querySelectorAll('#table-1 > tbody > tr').length;   

        });
        listLength = newLength;
        marketPage++
    } while (listLength >0);
    socket.emit('task', 'Procházím hráče...');
    for(let i=0; i<allPlayers.length;i++){
        // Emiting progress
        const progress = Math.round(((i+1)/allPlayers.length)*100);
        socket.emit('progress',progress);

        const playerLink = `https://hockey.powerplaymanager.com/cs/historie-hrace.html?data=${allPlayers[i].ppmId}`
        await page.goto(playerLink, { waitUntil: 'networkidle0' });
        const dateOfEnteringUfa = await page.evaluate(()=>{
        const tables = document.querySelectorAll('table.table')
        const lastTable = tables[tables.length -1]
        const rows = lastTable.querySelectorAll('tbody tr')
        let dateOfLastSigning;
        for(let j=rows.length -1; j>=0; j--){
            const cells = rows[j].querySelectorAll('td');
            if(cells[2].innerText.trim() === 'Prodloužení smlouvy'){
                dateOfLastSigning = cells[0].innerText.trim()
                break 
            }
        }
        const today = new Date()
        const daysSinceLastSigning = Math.floor((today - new Date(dateOfLastSigning))/1000/60/60/24)
        let addedDays;
        if(daysSinceLastSigning < 112){
            addedDays = 112 - daysSinceLastSigning - 14
        } else {
            addedDays = 112 - daysSinceLastSigning % 112 - 14
        }
        const futureDate = new Date();
        futureDate.setDate(today.getDate()+ addedDays)
        futureDate.setHours(7, 0, 0, 0);
        return futureDate.toISOString();
        })
        allPlayers[i].ufaFrom = new Date(dateOfEnteringUfa);
        const dateOfLeavingUfa = new Date(dateOfEnteringUfa);
        dateOfLeavingUfa.setDate(dateOfLeavingUfa.getDate()+7)
        allPlayers[i].ufaTo = dateOfLeavingUfa;
    }
    
    
    await browser.close();
    socket.emit('task',''); //Reseting the value
    
    return allPlayers;
};

module.exports = scrapeSoonFreeMarket;