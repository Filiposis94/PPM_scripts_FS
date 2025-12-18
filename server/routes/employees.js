const express = require('express');
const router = express.Router();

const {getEmployeeHistory} = require('../controllers/employees');
router.route('/').get(getEmployeeHistory);

module.exports = router;
