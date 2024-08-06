const puppeteer = require('puppeteer');
const URLcalendar = `https://hockey.powerplaymanager.com/cs/kalendar.html`;
const getPPMDate = require('../helper_functions/getPPMDate');

const scrapeAvailableDates = async (startDate)=>{
    try {
        // INITIALIZATION  
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.goto(URLcalendar, { waitUntil: 'networkidle0' });
        let finalData = [];
        // CHECKING CALENDAR FOR AVAILABLE DATES FOR FRIENDLY MATCH
        for(let i=1; i<=30; i++){
            // GOING TO CALENDAR
            let datePPM = getPPMDate(startDate,i);
            await page.goto(`${URLcalendar}?data=${129335}-${datePPM}`,{ waitUntil: 'load' });
            // console.log(datePPM);
            // EVALUATING SKIP
            let skip = await page.evaluate(()=>{
                if(document.querySelector('div.calendary_to_text') && document.querySelector('div.calendary_to_text').innerText.includes('V tento den není naplánovaný žádný zápas')){
                    return false;
                } else {
                    return true;
                };  
            });
            if(skip){
                continue
            } else {
                finalData.push(datePPM);   
            };
        };
        await browser.close();
        return finalData;
    } catch (error) {
        console.log(error);
    };
};

module.exports = scrapeAvailableDates;
