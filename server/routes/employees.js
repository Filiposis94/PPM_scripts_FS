const express = require('express');
const router = express.Router();

const {updateEmployeeHistory} = require('../controllers/employees');
router.route('/').post(updateEmployeeHistory);

module.exports = router;
