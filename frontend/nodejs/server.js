const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const path_ = __dirname + '/app/views/';
const app = express();

app.use(express.static(path_));

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: 'POST, GET, PUT, OPTIONS, DELETE'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(path_ + 'index.html');
});

require('./app/routes/guidelines.routes')(app);
require('./app/routes/summarization.routes')(app);

// Set port, listen for requests
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});