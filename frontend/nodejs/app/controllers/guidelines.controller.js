const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();

const ProfanityFilter = require('bad-words');
const profanityFilter = new ProfanityFilter();

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

// Profanity detection
exports.profanityDetection = (req, res) => {
  const text = req.body.text;

  if (profanityFilter.isProfane(text))
    res.send({profanity: 'true'});
  else
    res.send({profanity: 'false'});
}

