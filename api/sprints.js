var express = require('express');
var bodyParser = require("body-parser");
var monk = require('monk');	//we use monk to talk to MongoDB
var db = monk('mongo:27017/nodetest1');	//our database is nodetest1
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
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
//Add a Sprint in the sprintCollection
//Suppose :
// PUT : {"name":"Bepp"}
// PUT : url?name=Bepp
router.put('/projects/:name', function (req, res) {
    var time = req.body.time;
    var startingDate = req.body.startingDate;
    var projectName = req.params.name;

    if (time === undefined || startingDate === undefined) {
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
                var sprintData = {"number": sprintNumber.toString(), "time": time, "startingDate": startingDate, "projectName": projectName};
                sprintCollection.insert(sprintData, function (err, doc) {
                    if (err) {
                        res.status(500).send("There was a problem with the database while creating the sprint.");
                    }
                    else {
                        if (doc.nInserted != 0){
                            res.status(200).send({success: true});
                        }
                        else{
                            res.status(409).send("There was a problem with the database while creating the sprint: no inserted document")
                        }
                    }
                });
            });
        });

    }
});





//Add a Sprint Service
//Add an userStory in the sprintCollection array: userStories
//Suppose :
// PUT : {"number":"2", "name":"Bepp"}
// PUT : url?number=2&name=Bepp
router.put('/:number/projects/:name/userStories/', function (req, res) {
    var description = req.body.description;
    var projectName = req.params.name;
    var sprintNumber = req.params.number;

    if (description === undefined) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        var db = req.db;
        var sprintCollection = db.get('sprintCollection');
        var projectCollection = db.get('projectCollection');

        verifyAuth(req, res, function () {
            projectCollection.findOne({name: projectName, 'userStories.description': description}, function(err, userStory) {
                if (err) {
                    res.status(500).send("There was a problem with the database while updating the sprint: checking the userStory.");
                }
                else {
                    if(userStory.length!=0) {
                        var difficulty = userStory.userStories[0].difficulty;
                        var priority = userStory.userStories[0].priority;

                        //add the userStory in the sprintCollection
                        var updateSprint = {$addToSet: {userStories: {"description": description, "difficulty": difficulty, "priority": priority}}};
                        var sprintQuery = {number: sprintNumber, projectName: projectName};

                        sprintCollection.update(sprintQuery, updateSprint, function (err, doc) {
                            if (err) {
                                res.status(500).send("There was a problem with the database while updating the sprint: adding the userStory to the sprint's userStory list.");
                            }
                            else {
                                if (doc.nModified != 0){
                                    res.status(200).send({success: true});
                                }
                                else{
                                    res.status(409).send("There was a problem with the database while linking the userstory and the sprint: no updated document")
                                }
                            }
                        });
                    }
                }
            });
        });
    }
});







// Add a Sprint Service
// Add a task in the sprintCollection array: tasks
// Suppose :
// PUT : {"number":"2", "name":"Bepp"}
// PUT : url?number=2&name=Bepp
router.put('/:number/projects/:name/tasks/', function (req, res) {
    var description = req.body.description;
    var taskName = req.body.name;
    var projectName = req.params.name;
    var sprintNumber = req.params.number;

    if (description == null || taskName == null) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        var db = req.db;
        var sprintCollection = db.get('sprintCollection');

        verifyAuth(req, res, function () {

            sprintCollection.find({projectName: projectName, number: sprintNumber,'tasks.description': description}, function(err, task) {
                if (err) {
                    res.status(500).send("There was a problem with the database while updating the sprint: checking the task.");
                }
                else {
                    if (task.length==0) {
                        //add the task in the sprintCollection
                        var updateSprint = {$addToSet: {tasks: {"description": description, "name": taskName}}};
                        var sprintQuery = {projectName: projectName, number: sprintNumber};
                        sprintCollection.update(sprintQuery, updateSprint, function (err, doc) {
                            if (err) {
                                res.status(500).send("There was a problem with the database while creating the task: adding the task to the sprint's task list failed.");
                            }
                            else {
                                if (doc.nModified != 0){
                                    res.status(200).send({success: true});
                                }
                                else{
                                    res.status(409).send("There was a problem with the database while creating the task: no updated document.")
                                }
                            }
                        });
                    }
                    else{
                        res.status(403).send("There was a problem with the database while creating the task: this description is already used with for this sprint and project.")
                    }
                }
            });
        });
    }
});



//Add a Sprint Service
//Update a sprint
//Suppose :
// PATCH : {"number":"2", "name":"Bepp"}
// PATCH : url?number=2&name=Bepp
router.patch('/:number/projects/:name/', function (req, res) {
    var time = req.body.time;
    var startingDate = req.body.startingDate;
    var projectName = req.params.name;
    var sprintNumber = req.params.number;

    if (time == null || startingDate == null) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        var db = req.db;
        var sprintCollection = db.get('sprintCollection');

        verifyAuth(req, res, function () {

            var updateSprint = {$set: {time: time, startingDate: startingDate}};
            var sprintQuery = {projectName: projectName, number: sprintNumber};

            sprintCollection.update(sprintQuery, updateSprint, function (err, doc) {
                if (err) {
                    res.status(500).send("There was a problem with the database while updating the sprint: updating the sprint's starting date and time length.");
                }
                else{
                    if (doc.nModified != 0) {
                        res.status(200).send({success: true});
                    }
                    else{
                        res.status(409).send("There was a problem with the database while updating the sprint: no updated document.");
                    }
                }
            });
        });
    }
});



//Add a Sprint Service
//Update a userStory in the project's array of userStories
//Suppose :
// PATCH : {"number":"2", "name":"Bepp"}
// PATCH : url?number=2&name=Bepp
router.patch('/:number/projects/:name/tasks/:oldName', function (req, res) {
    var description = req.body.description;
    var taskName = req.body.name;
    var projectName = req.params.name;
    var oldTaskName = req.params.oldName;
    var sprintNumber = req.params.number;

    if (description == null || taskName == null) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        var db = req.db;
        var sprintCollection = db.get('sprintCollection');

        verifyAuth(req, res, function () {

            var updateSprint = {$set: {"tasks.$": {"description": description, "name": taskName}}};
            var sprintQuery = {projectName: projectName, "number": sprintNumber, tasks: { $elemMatch: {"name": oldTaskName}}};

            sprintCollection.update(sprintQuery, updateSprint, function (err, doc) {
                if(err){
                    res.status(500).send("There was a problem with the database while updating the project: updating the userStory in the project's userStory list.");
                }
                else{
                    if (doc.nModified != 0) {
                        res.status(200).send({success: true});
                    }
                    else{
                        res.status(409).send("There was a problem with the database while updating the task: no updated document.");
                    }
                }
            });
        });
    }
});

module.exports = router;