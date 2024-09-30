const express = require('express');

const router = express.Router();
const recommendationsCt = require('../Controller/recommendationsCt');

router.post('/store', recommendationsCt.store);
router.post('/track', recommendationsCt.track);
router.post('/feedback', recommendationsCt.feedback);
router.post('/getHist', recommendationsCt.getHist);

router.post('/getFeedbacks', recommendationsCt.getFeedbacks);

module.exports = router;
