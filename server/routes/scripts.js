const express = require('express');
const router = express.Router();

const {getFreeMarket, getFriendlyMatches,getAvailableDates, getTactics, getVisits, getTeams, getNextOpponent} = require('../controllers/scripts');

router.route('/freemarket').get(getFreeMarket);
router.route('/friendly-matches').get(getFriendlyMatches);
router.route('/available-dates').get(getAvailableDates);
router.route('/tactics').get(getTactics);
router.route('/visits').get(getVisits);
router.route('/teams').get(getTeams);
router.route('/next-opponent').get(getNextOpponent);

module.exports = router;

