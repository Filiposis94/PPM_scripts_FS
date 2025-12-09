const express = require('express');
const router = express.Router();

const { getPower, getTeamsPower, updatePowers} = require('../controllers/powers');
router.route('/').get(getPower).patch(updatePowers);
router.route('/teams').patch(getTeamsPower)

module.exports = router;
