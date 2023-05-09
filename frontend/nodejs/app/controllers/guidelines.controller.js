const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();

// Language detection
exports.languageDetection = (req, res) => {
  const text = req.body.text;
  const result = lngDetector.detect(text, 1);

  if (result === undefined) {
    res.send({message: 'none'});
    return;
  }
  
  if (result.length === 0) {
    res.send({message: 'none'});
    return;
  }
  
  if (result[0].length === 0) {
    res.send({message: 'none'});
    return;
  }
  
  // Return the detected language and the probability
  const data = {
    language: result[0][0],
    probability: result[0][1],
  }
  res.send(data);
}

