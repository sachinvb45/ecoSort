const express = require('express');

const router = express.Router();
const wasteDescCt = require('../Controller/wasteDescCt');

router.get('/wasteData', wasteDescCt.wasteData);

module.exports = router;
