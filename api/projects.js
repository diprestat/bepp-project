const express = require('express');
const router = express.Router();

const verifyAuth = require('./utils/verify-auth');

//Add a Project Service
//Suppose :
// POST : {"name":"foo", "description":"bar", "token":"token"}
// POST : url?name=foo&description=bar&token=token
router.post('/', function (req, res) {
    var name = req.body.name;
    var description = req.body.description;

    if (!name || !description) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        const db = req.db;
        const userCollection = db.get('userCollection');
        const projectCollection = db.get('projectCollection');

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
                                projectCollection.update(projectQuery, updateProject, {upsert: true}, function (err) {
                                    if (err) {
                                        res.status(500).send("There was a problem with the database while creating the project: adding the user to the project's user list.");
                                    }
                                    else {
                                        //res.status(200).send({success: true});
                                    }
                                });

                                console.log("doc Project");
                                console.log(docProject);
                                if (docProject.users != undefined) {
                                    delete docProject.users;
                                }
                                //Add the user to the project's list
                                var updateUser = { $addToSet: { projects: docProject } };
                                userCollection.update(userQuery, updateUser, {upsert: true}, function (err, doc) {
                                    if (err) {
                                        res.status(500).send("There was a problem with the database while creating the project: adding the project to the user's project list.");
                                    }
                                    else {
                                        console.log("Updated : ");
                                        console.log(doc);
                                        res.status(200).send({ success: true });
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
    var query = { name: projectName };

    verifyAuth(req, res, function () {
        //Fetch Project
        db.collection("projectCollection").find(query, {}, function (e, docs) {
            if (docs.length > 0) {
                //Check if the user is in the project
                var found = false;
                console.log(docs);
                for (var i = 0; i < docs[0].users.length; i++) {
                    if (docs[0].users[i].login === req.decoded.login) {
                        found = true;
                    }
                }
                if (found) {
                    req.decoded.project = projectName;
                    res.status(200).send(docs);
                }
                else {
                    res.status(403);
                    res.send({ error: 403 });
                }
            }
            else {
                res.status(404);
                res.send({ error: 404 });
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