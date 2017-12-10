var express = require('express');
var bodyParser = require("body-parser");
var monk = require('monk'); //we use monk to talk to MongoDB
var db = monk(process.env.MONGOLAB_URI || 'mongo:27017/nodetest1'); //our database is nodetest1
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var http = require('http');
var path = require('path');
var fs = require('fs');

const users = require('./users');
const projects = require('./projects');
const userStories = require('./userStories');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
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

app.set('superSecret', "12345"); // secret variable

// route middleware to verify a token
function verifyAuth(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                res.success(401).json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        res.status(401).send({
            success: false,
            message: 'No token provided.'
        });
    }

}

////// Attach application /////

// Catch all other routes and return an application file
app.get(['/', '/:requested'], function (req, res, next) {
    var requestedFileName = req.params.requested ? req.params.requested : 'index.html';

    var requestedPath = path.join(__dirname, '../web-app/dist', requestedFileName);

    // if redirected file exists, then redirect it else go to next catch
    if (fs.existsSync(requestedPath)) {
        res.sendFile(requestedPath);
    }
    else {
        next();
    }
});

///// else page introuvable
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

// Get port from environment and store in Express.
var port = process.env.PORT || '8080';
app.set('port', port);

// Create HTTP server.
var server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port, function () {
    console.log("API running on localhost:" + port);
});
