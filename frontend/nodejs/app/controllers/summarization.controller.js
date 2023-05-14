const endpoint = 'https://us-central1-bart-proj.cloudfunctions.net/uninsider-bart-cnn-cors-all-global'

// Initialize the summarization module
exports.initSummarizationModule = async (_, res) => {
    let response = null;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({article: 'init'}),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*',
        }
      });
    } catch (e) {
      res.send({summary: 'cannot initialize the summarization model'});
    }

    if (response.ok)
      res.send({summary: 'successfully initialized the summarization model'});

    res.send({summary: 'cannot initialize the summarization model'});
}

// Summarize the article
exports.summarizeArticle = async (req, res) => {
    let response = null;
    try {
        // Send the request to the server
        let content = JSON.stringify({article: req.body.article});
        // console.log(content);
        response = await fetch(endpoint, {
          method: 'POST',
          body: content,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
          }
        });
    } catch (e) {
      res.send({summary: 'none'});
    }

    // Check if the response is ok
    if (!response.ok)
      res.send({summary: 'none'});
    
    // Parse the response
    if (response.body == null)
      res.send({summary: 'none'});

    // Successfully summarized the text
    // Convert `ReadableStream` to `string` and update the UI
    var summary = await response.text();

    // Ensure that the summary ends with a period (.)
    // Find the last index of the period (.)
    let lastPeriodIndex = summary.lastIndexOf('.');

    // Cut the summary at the last period (.)
    if (lastPeriodIndex != -1)
      summary = summary.substring(0, lastPeriodIndex + 1);

    res.send({summary: summary});
}
