const URLlogin = `https://hockey.powerplaymanager.com/cs/`

const login = async (page) => {
	/* Go to the PPM home page and wait for it to load */
	await page.goto(URLlogin, { waitUntil: "networkidle0" })
	// login
	await page.setViewport({ width: 1400, height: 720 })
	await page.click("#login > div.login_label")
	await page.type(
		"#login_form > form > div:nth-child(2) > input[type=text]",
		process.env.PPM_LOGIN
	)
	await page.type(
		"#login_form > form > div:nth-child(3) > input[type=password]",
		process.env.PPM_PASSWORD
	)
	await Promise.all([
		page.click("#login_form > form > div.login_submit > input[type=submit]"),
		page.waitForNavigation({ waitUntil: "networkidle0" })
	])
}

module.exports = login
