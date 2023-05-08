const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const path_ = __dirname + '/app/views/';
const app = express();

app.use(express.static(path_));

// app.use('*', function (req, res) {
//   res.sendFile(path.join(path_, 'index.html'));
// });

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function (req,res) {
  res.sendFile(path_ + "index.html");
});

require("./app/routes/turorial.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});