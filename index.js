const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv-defaults').config();
const mongo = require('./mongo');
mongo.connect();
const app = express();
const server = http.createServer(app);
const APIroute = require('./routes/api')
const DBroute = require('./routes/db')
app.use(express.json());
app.use(cors());
app.use('/api', APIroute);
app.use('/db', DBroute);

app.use(express.static(path.join(__dirname, '/frontend/build')));

app.get('/term-of-use', (req, res) => {
  res.sendFile(path.join(__dirname, '/term-of-use.html'));
});

app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, '/privacy-policy.html'));
});

app.get('*', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, '/frontend/build')}); 
});



const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server listening at ${server.address().port}`);
});
