const express = require('express');
const router = express.Router();

const { getFriendlyMatches, getAvailableDates, updateTeams} = require('../controllers/friendlymatches');
router.route('/').get(getFriendlyMatches);
router.route('/dates').get(getAvailableDates)
router.route('/teams').patch(updateTeams)

module.exports = router;
