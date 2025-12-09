const express = require('express');
const router = express.Router();

const {getFreeMarket,  updateSoonFreeMarket, getSoonFreeMarket, updatePlayer} = require('../controllers/freemarket');
router.route('/').get(getFreeMarket);
router.route('/soon').get(getSoonFreeMarket).post(updateSoonFreeMarket)
router.route('/soon/:ppmId').patch(updatePlayer)

module.exports = router;
