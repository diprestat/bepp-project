var express = require('express');
var bodyParser = require("body-parser");
var monk = require('monk'); //we use monk to talk to MongoDB
var db = monk(process.env.MONGOLAB_URI || 'mongo:27017/nodetest1'); //our database is nodetest1
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var http = require('http');
var path = require('path');
var fs = require('fs');
const projects = require('./projects');
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

//Add a Project Service
//Suppose :
// POST : {"name":"foo", "description":"bar", "token":"token"}
// POST : url?name=foo&description=bar&token=token
router.post('/', function (req, res) {
    var name = req.body.name;
    var description = req.body.description;

    if (name == null || description == null) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        var token = req.body.token;

        var db = req.db;
        var userCollection = db.get('userCollection');
        var projectCollection = db.get('projectCollection')

        verifyAuth(req, res, function () {

            var userQuery = {login: req.decoded.login};
            var projectQuery = {name: name};
            //Is the project name available
            projectCollection.find(projectQuery, {}, function (e, doc) {
                if (e) {
                    res.status(500).send("There was a problem with the database while checking if the project already exists.");
                }
                else {
                    if (doc.length == 0) {
                        //Creation of the project
                        projectCollection.insert({
                            "name": name,
                            "description": description
                        }, function (err, docProject) {
                            if (err) {
                                res.status(500).send("There was a problem with the database while creating the project.");
                            }
                            else {
                                //Add the project to the user's list

                                if (req.decoded.project != undefined)
                                    delete req.decoded['project'];
                                console.log("Req decoded");
                                console.log(req.decoded);

                                req.decoded.role = "Développeur";

                                var updateProject = {$addToSet: {users: req.decoded}};
                                projectCollection.update(projectQuery, updateProject, {upsert: true}, function (err, doc) {
                                    if (err) {
                                        res.status(500).send("There was a problem with the database while creating the project: adding the user to the project's user list.");
                                    }
                                    else {
                                        //res.status(200).send({success: true});
                                    }
                                });

                                console.log("doc Project");
                                console.log(docProject);
                                if (docProject.users != undefined)
                                    delete docProject['users'];
                                //Add the user to the project's list
                                var updateUser = {$addToSet: {projects: docProject}};
                                userCollection.update(userQuery, updateUser, {upsert: true}, function (err, doc) {
                                    if (err) {
                                        res.status(500).send("There was a problem with the database while creating the project: adding the project to the user's project list.");
                                    }
                                    else {
                                        console.log("Updated : ");
                                        console.log(doc);
                                        res.status(200).send({success: true});
                                    }
                                });
                            }
                        });
                    }
                    else {
                        res.status(409).send("There is already a project with this name.");
                    }
                }
            });
        });
    }
});

//Get a Project Service
//From the Project Name
router.get('/:name', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var projectName = req.params.name;
    //Remplacer userTestJSON par une requête MangoDB qui sélectionne un projet selon son nom
    var db = req.db;

    // Find in a collection
    var query = {name: projectName};

    verifyAuth(req, res, function () {
        //Fetch Project
        db.collection("projectCollection").find(query, {}, function (e, docs) {
            if (docs.length != 0) {
                //Check if the user is in the project
                var found = false;
                console.log(docs);
                for (var i = 0; i < docs[0].users.length; i++) {
                    if (docs[0].users[i].login == req.decoded.login) {
                        found = true;
                    }
                }
                if (found) {
                    req.decoded.project=projectName;
                    res.status(200).send(docs);
                }
                else {
                    res.status(403);
                    res.send({error: 403});
                }
            }
            else {
                res.status(404);
                res.send({error: 404});
            }
        });
    });
});

//Add to the project with the "name" the User with the "login".
//Suppose :
// POST : {"name":"foo", "login":"bar"}
// POST : url?name=foo&login=bar
router.put('/:name/users/:login', function (req, res) {
    var projectName = req.params.name;
    var userLogin = req.params.login;

    var role = req.body.role;

    //Remplacer userTestJSON par une requête MangoDB qui sélectionne un user selon son login
    var db = req.db;

    verifyAuth(req, res, function () {
        var projectQuery = {name: projectName};
        var userQuery = {login: userLogin};

        var projectCollection = db.get("projectCollection");
        var userCollection = db.get("userCollection");

        projectCollection.find(projectQuery, {}, function (e, docsProject) {
            if (docsProject.length != 0) {


                var found = false;
                for (var i = 0; i < docsProject[0].users.length; i++) {
                    if (docsProject[0].users[i].login == req.decoded.login) {
                        found = true;
                    }
                }
                if (found) {
                    userCollection.find(userQuery, {}, function (e, docsUser) {
                        if (docsUser.length != 0) {

                            if (docsUser[0].projects != undefined)
                                delete docsUser[0]['projects'];

                            docsUser[0].role = role;

                            console.log("Add U: ");
                            console.log(projectQuery);
                            console.log(docsUser[0]);
                            projectCollection.update(projectQuery, {$addToSet: {users: docsUser[0]}}, {upsert: true}, function (err, doc) {
                                if (err) {
                                    throw err;
                                }
                                console.log("Update P :");
                                console.log(doc);
                                if (docsProject[0].users != undefined)
                                    delete docsProject[0]['users'];

                                console.log("Add P:");
                                console.log(userQuery);
                                console.log(docsProject[0]);

                                userCollection.update(userQuery, {$addToSet: {projects: docsProject[0]}}, {upsert: true}, function (err, doc) {
                                    if (err) {
                                        throw err;
                                    }
                                    console.log("Update U :");
                                    console.log(doc);
                                    res.status(200).send({success: true});
                                })
                            })
                        }
                        else {
                            res.status(404);
                            res.send({error: 404});
                        }
                    });
                }
                else {
                    res.status(403);
                    res.send({error: 403});
                }

            }
            else {
                res.status(404);
                res.send({error: 404});
            }
        });
    });
});

module.exports = router;