const puppeteer = require('puppeteer');
const URLcalendar = `https://hockey.powerplaymanager.com/cs/kalendar.html`;
const getPPMDate = require('../helper_functions/getPPMDate');
// require('dotenv').config();
const fs = require('fs');

const scrapeAvailableDates = async (startDate)=>{

    const paths = [
        '/usr/bin/chromium-browser',
        '/usr/bin/google-chrome-stable',
        '/usr/local/bin/chromium-browser',
        '/usr/local/bin/google-chrome-stable'
    ];
    
    paths.forEach(path => {
        if (fs.existsSync(path)) {
            console.log(`Chromium found at: ${path}`);
        } else {
            console.log(`Chromium not found at: ${path}`);
        }
    });

    // INITIALIZATION  
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath: process.env.NODE_ENV === 'production' ? '/usr/bin/chromium-browser': puppeteer.executablePath(),
        
    });
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
};

module.exports = scrapeAvailableDates;
