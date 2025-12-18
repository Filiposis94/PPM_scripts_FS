const puppeteer = require('puppeteer');
const URLmarket = `https://hockey.powerplaymanager.com/cs/top-prodeje-zamestnancu.html?data=lastday`;

const scrapeEmployeeHistory = async(socket)=>{
    // INITIALIZATION  
    // socket.emit('task', 'Zahajuji proces...');
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(URLmarket, { waitUntil: 'networkidle0' });
    // 1. GETTING LAST DAY TRADES
    // GETTING UNIQUE ID OF SEARCH FOR PAGINATION
    // OTHER VARS FOR SCANING
    let marketPage = 2;
    let allEmployees = [];
    let listLength;
    // Scan first page, go to next, if there are rows do it again
    // socket.emit('task', 'Shromažďuji data o zaměstnancích...');
    do{
        // Scaning rows on a page
        const tempArray = await page.evaluate(()=>{
            let infoArray = [];
            let allRows = document.querySelectorAll('#table-1 > tbody > tr');
            for(let i = 0; i<allRows.length; i++){
                // Scaning each player 
                    const name = allRows[i].querySelectorAll(`td.name > a`)[1].innerText;
                    const link = allRows[i].querySelectorAll(`td.name > a`)[1].href;
                    const time = allRows[i].querySelectorAll(`td.name > div`)[0].innerText.split(' (')[0]
                    const price = allRows[i].querySelectorAll(`td`)[1].innerText.replace(' ','');
                    const age = allRows[i].querySelectorAll(`td`)[2].innerText;
                    const type = allRows[i].querySelectorAll(`td`)[3].innerText;
                    const prk = allRows[i].querySelectorAll(`td`)[4].innerText;
                    const att1 = allRows[i].querySelectorAll(`td`)[5].innerHTML.split('<')[0];
                    const att2 = allRows[i].querySelectorAll(`td`)[6].innerHTML.split('<')[0];
                    const cz = allRows[i].querySelectorAll(`td`)[7].innerText;
                    const ppmId = link.split('=')[1].split('-')[0];

                    infoArray.push({
                        name,
                        link,
                        time,
                        ppmId,
                        price,
                        age,
                        type,
                        prk,
                        att1,
                        att2,
                        cz
                    });
                } 
            return infoArray;
        });
        // Pushing each player object from from temp page array to final array
        for(let i=0; i<tempArray.length; i++){
            allEmployees.push(tempArray[i]);
        };
        // Checking if next page has some rows
        await page.goto(`https://hockey.powerplaymanager.com/cs/top-prodeje-zamestnancu.html?data=lastday-${marketPage}`,{ waitUntil: 'networkidle0' });
        const newLenght = await page.evaluate(()=>{
            return document.querySelectorAll('#table-1 > tbody > tr').length;   

        });
        listLength = newLenght;
        marketPage++
    } while (listLength >0);
    // socket.emit('progress', 100)
    await browser.close();
    // 3. EXPORTING DATA
    // socket.emit('task',''); //Reseting the value
    return allEmployees;
};

module.exports = scrapeEmployeeHistory;