
const express = require('express')
const cors = require('cors');
const app = express()
const path = require('path');
var db = require('./db.json');

//Connect MongoDB
const bodyParser= require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

var fs = require('fs');

function readJSONFile(filename, callback) {
  fs.readFile(filename, function (err, data) {
    if(err) {
      callback(err);
      return;
    }
    try {
      callback(null, JSON.parse(data));
    } catch(exception) {
      callback(exception);
    }
  });
}
app.get('/preload', (req, res, next)=>{
  readJSONFile('./db.json', function (err, json) {
    if(err) { throw err; }
    res.json(json);
  });
})

//Upload dataPath to db
app.post('/upload-data', function(req,res,next){ 
  db = req.body; 
  
  fs.writeFile('./db.json', JSON.stringify(db), function writeJSON(err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(db));
  });
	return res.redirect('/');
}) 

app.listen(5000, () => {
  console.log('App listening on port 5000')
})
