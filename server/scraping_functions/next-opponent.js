const puppeteer = require("puppeteer")
const URLcalendar = `https://hockey.powerplaymanager.com/cs/kalendar.html`
const getPPMDate = require("../helper_functions/getPPMDate")

const scrapeNextOpponent = async () => {
	// INITIALIZATION
	const browser = await puppeteer.launch({ headless: true })
	const page = await browser.newPage()
	await page.goto(URLcalendar, { waitUntil: "networkidle0" })
	const today = getPPMDate("start", 0)
	const tommorow = getPPMDate(today, 1)

	// GOING TO CALENDAR
	await page.goto(`${URLcalendar}?data=${129335}-${today}`, {
		waitUntil: "load"
	})
	// CHECK IF SMALL ICON H or A
	const resultToday = await page.evaluate(() => {
		return !document.querySelector(
			"div.calendary  div.type_selected  div.cal_h_a"
		)
	})
	const todayOp = await page.evaluate(() => {
		const link = document.querySelector(
			"div.calendary div.type_selected div.cal_teamname > a"
		).href
		return link.split("=")[1].split("-")[0]
	})
	await page.goto(`${URLcalendar}?data=${129335}-${tommorow}`, {
		waitUntil: "load"
	})
	const tommorowOp = await page.evaluate(() => {
		const link = document.querySelector(
			"div.calendary div.type_selected div.cal_teamname > a"
		).href
		return link.split("=")[1].split("-")[0]
	})

	await browser.close()
	return resultToday ? tommorowOp : todayOp
}

module.exports = scrapeNextOpponent
