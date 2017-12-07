var express = require('express');
var bodyParser = require("body-parser");
var monk = require('monk');	//we use monk to talk to MongoDB
var db = monk('mongo:27017/nodetest1');	//our database is nodetest1
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var http = require('http');
var path = require('path');
var fs = require('fs');
const sprints = require('./sprints');
const router = express.Router();

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Make our db accessible to our router
router.use(function (req, res, next) {
    req.db = db;
    next();
});

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



//Add a Sprint Service
//Add an Sprint in the projectCollection array: sprint
//Suppose :
// PUT : {"name":"Bepp"}
// PUT : url?name=foo
router.put('/projects/:name', function (req, res) {
    var duree = req.body.duree;
    var date_debut = req.body.date_debut;
    var projectName = req.params.name;

    if (duree === undefined || date_debut === undefined) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        var db = req.db;
        var sprintCollection = db.get('sprintCollection');

        verifyAuth(req, res, function () {

            var sprintQuery={"projectName": projectName};
            db.get('sprintCollection').count(sprintQuery,function(error, count) {
             //add the sprint in the sprintCollection
                var sprintNumber=count+1;
                sprintData = {"number": sprintNumber, "duree": duree, "date_debut": date_debut, "projectName": projectName};
                sprintCollection.insert(sprintData, function (err, doc) {
                    if (err) {
                        res.status(500).send("There was a problem with the database while creating the sprint.");
                    }
                    else {
                        res.status(200).send({success: true});
                    }
                });
            });
        });

    }
});





module.exports = router;