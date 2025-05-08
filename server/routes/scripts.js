const express = require('express');
const router = express.Router();

const {getFreeMarket, getFriendlyMatches,getAvailableDates, getTactics, getVisits, getTeams, getNextOpponent, getTeamsPower, getPower, updatePowers} = require('../controllers/scripts');

router.route('/freemarket').get(getFreeMarket);
router.route('/friendly-matches').get(getFriendlyMatches);
router.route('/available-dates').get(getAvailableDates);
router.route('/tactics').get(getTactics);
router.route('/visits').get(getVisits);
router.route('/teams').get(getTeams);
router.route('/next-opponent').get(getNextOpponent);
router.route('/teams-power').get(getTeamsPower);
router.route('/power').get(getPower).patch(updatePowers);

module.exports = router;

