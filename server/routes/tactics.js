const express = require("express")
const router = express.Router()

const { getNextOpponent, getTactics } = require("../controllers/tactics")
router.route("/").get(getTactics)
router.route("/next-opponent").get(getNextOpponent)

module.exports = router
