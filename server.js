const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const port = 3001;
const cors= require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
    };
    app.use(allowCrossDomain);
    app.use(cors());
const routes = require('./routes/routes.js')(app, fs);

const server = app.listen(port, () => {
    console.log('API Server listening on port %s...', server.address().port);
});