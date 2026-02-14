const express = require("express")
const router = express.Router()

const {
	updateEmployeeHistory,
	getEmployees
} = require("../controllers/employees")
router.route("/").post(updateEmployeeHistory).get(getEmployees)

module.exports = router
