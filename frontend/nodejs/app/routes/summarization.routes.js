module.exports = app => {
    const summarization = require('../controllers/summarization.controller');

    var router = require('express').Router();

    app.use('/summarization', router);

    // Init the summarization endpoint
    router.post('/init', summarization.initSummarizationModule);

    // Summarization
    router.post('/summarization', summarization.summarizeArticle);
};
