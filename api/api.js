const env = require ('./utils/environment');

const express = require('express');
const bodyParser = require('body-parser');
const monk = require('monk'); //we use monk to talk to MongoDB
const db = monk(env.DB_URL);
const http = require('http');
const path = require('path');
const fs = require('fs');

const users = require('./users');
const projects = require('./projects');
const userStories = require('./userStories');
const sprints = require('./sprints');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    next();
});

// API location
app.use('/api/users', users);
app.use('/api/projects', projects);
app.use('/api/userStories', userStories);
app.use('/api', sprints);

////// Attach application /////

// Catch all other routes and return an application file
app.get(['/', '/:requested'], function (req, res, next) {
    const requestedFileName = req.params.requested ? req.params.requested : 'index.html';

    const requestedPath = path.join(__dirname, '../web-app/dist', requestedFileName);

    // if redirected file exists, then redirect it else go to next catch
    if (fs.existsSync(requestedPath)) {
        res.sendFile(requestedPath);
    }
    else {
        next();
    }
});

///// else page introuvable
app.use(function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

// Get port from environment and store in Express.
const port = process.env.PORT || '8080';
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port, function () {
    console.log("API running on localhost:" + port);
});
