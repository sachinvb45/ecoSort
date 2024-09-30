const express = require('express');

const router = express.Router();

router.use('/regLoginRt', require('./regLoginRt'));
router.use('/gMapRt', require('./gMapRt'));
router.use('/wasteDescRt',require('./wasteDescRt'))
router.use('/recommendationsRt',require('./recommendationsRt'))


module.exports = router;
