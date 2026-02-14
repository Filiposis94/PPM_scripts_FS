const puppeteer = require("puppeteer")
const URL = `https://hockey.powerplaymanager.com/cs/liga.html`
const fs = require("node:fs")
const path = require("node:path")

const scrapeTeams = async () => {
	const leaguePath = path.join(__dirname, "../files/leagues.txt")
	const leagues = fs.readFileSync(leaguePath, { encoding: "utf8" }).split("\n")
	// INITIALIZATION
	const browser = await puppeteer.launch({ headless: true })
	const page = await browser.newPage()
	await page.goto(URL, { waitUntil: "networkidle0" })
	await page.setViewport({ width: 1400, height: 720 })
	const finalData = []
	// UPDATING TEAMS IN EACH LEAGUE
	for (let i = 0; i < leagues.length; i++) {
		// console.log(`Updating ${leagues[i]}`);
		await page.goto(`${URL}?data=${leagues[i]}`, { waitUntil: "load" })
		const leagueData = await page.evaluate(() => {
			const teams = document.getElementsByClassName("link_name")
			const teamsID = []
			for (let j = 0; j < teams.length; j++) {
				const teamURL = teams[j].getAttribute("href")
				const splited = teamURL.split("=")[1].split("-")[0]
				teamsID.push(splited)
			}
			return teamsID
		})
		finalData.push(leagueData)
	}
	await browser.close()
	// WRITING DATA
	const txtData = finalData.map((item) => item.join("\n")).join("\n")
	const teamsPath = path.join(__dirname, "../files/teams.txt")
	fs.writeFileSync(teamsPath, txtData, { encoding: "utf8" })
}

module.exports = scrapeTeams
