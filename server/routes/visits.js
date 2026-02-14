const express = require("express")
const router = express.Router()

const { getVisits } = require("../controllers/visits")
router.route("/").get(getVisits)

module.exports = router
