const express = require('express');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const router = express.Router();

const verifyAuth = require('./utils/verify-auth');

//Add a Sprint Service
//Add a Sprint in the sprintCollection
//Suppose :
// PUT : {"name":"Bepp"}
// PUT : url?name=Bepp
router.put('/sprints/projects/:name', function (req, res) {
    const time = req.body.time;
    const startingDate = req.body.startingDate;
    const projectName = req.params.name;

    if (time === undefined || startingDate === undefined) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        const db = req.db;
        const sprintCollection = db.get('sprintCollection');

        verifyAuth(req, res, function () {

            const sprintQuery = { "projectName": projectName };
            db.get('sprintCollection').count(sprintQuery, function(error, count) {
             //add the sprint in the sprintCollection
                const sprintNumber = count + 1;
                const sprintData = { "number": sprintNumber.toString(), "time": time, "startingDate": startingDate, "projectName": projectName };
                sprintCollection.insert(sprintData, function (err, doc) {
                    if (err) {
                        res.status(500).send("There was a problem with the database while creating the sprint.");
                    }
                    else {
                        if (doc.nInserted !== 0) {
                            res.status(200).send({ success: true });
                        }
                        else {
                            res.status(409).send("There was a problem with the database while creating the sprint: no inserted document");
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
router.put('/sprints/:number/projects/:name/userStories/', function (req, res) {
    const description = req.body.description;
    const projectName = req.params.name;
    const sprintNumber = req.params.number;

    if (description === undefined) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        const db = req.db;
        const sprintCollection = db.get('sprintCollection');
        const projectCollection = db.get('projectCollection');

        verifyAuth(req, res, function () {
            projectCollection.findOne({ name: projectName, 'userStories.description': description }, function(err, userStory) {
                if (err) {
                    res.status(500).send("There was a problem with the database while updating the sprint: checking the userStory.");
                }
                else {
                    if (userStory.length != 0) {
                        const difficulty = userStory.userStories[0].difficulty;
                        const priority = userStory.userStories[0].priority;

                        //add the userStory in the sprintCollection
                        const updateSprint = { $addToSet: { userStories: { "description": description, "difficulty": difficulty, "priority": priority } } };
                        const sprintQuery = { number: sprintNumber, projectName: projectName };

                        sprintCollection.update(sprintQuery, updateSprint, function (err, doc) {
                            if (err) {
                                res.status(500).send("There was a problem with the database while updating the sprint: adding the userStory to the sprint's userStory list.");
                            }
                            else {
                                if (doc.nModified != 0) {
                                    res.status(200).send({ success: true });
                                }
                                else {
                                    res.status(409).send("There was a problem with the database while linking the userstory and the sprint: no updated document");
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
router.put('/sprints/:number/projects/:name/tasks/', function (req, res) {
    const description = req.body.description;
    const taskName = req.body.name;
    const projectName = req.params.name;
    const sprintNumber = req.params.number;

    if (description == null || taskName == null) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        const db = req.db;
        const sprintCollection = db.get('sprintCollection');

        verifyAuth(req, res, function () {

            sprintCollection.find({ projectName: projectName, number: sprintNumber, 'tasks.description': description }, function(err, task) {
                if (err) {
                    res.status(500).send("There was a problem with the database while updating the sprint: checking the task.");
                }
                else {
                    if (task.length === 0) {
                        //add the task in the sprintCollection
                        const updateSprint = { $addToSet: { tasks: { "description": description, "name": taskName } } };
                        const sprintQuery = { projectName: projectName, number: sprintNumber };
                        sprintCollection.update(sprintQuery, updateSprint, function (err, doc) {
                            if (err) {
                                res.status(500).send("There was a problem with the database while creating the task: adding the task to the sprint's task list failed.");
                            }
                            else {
                                if (doc.nModified != 0) {
                                    res.status(200).send({ success: true });
                                }
                                else {
                                    res.status(409).send("There was a problem with the database while creating the task: no updated document.");
                                }
                            }
                        });
                    }
                    else {
                        res.status(403).send("There was a problem with the database while creating the task: this description is already used with for this sprint and project.");
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
router.patch('/sprints/:number/projects/:name/', function (req, res) {
    const time = req.body.time;
    const startingDate = req.body.startingDate;
    const projectName = req.params.name;
    const sprintNumber = req.params.number;

    if (!time || !startingDate) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        const db = req.db;
        const sprintCollection = db.get('sprintCollection');

        verifyAuth(req, res, function () {

            const updateSprint = { $set: { time: time, startingDate: startingDate } };
            const sprintQuery = { projectName: projectName, number: sprintNumber };

            sprintCollection.update(sprintQuery, updateSprint, function (err, doc) {
                if (err) {
                    res.status(500).send("There was a problem with the database while updating the sprint: updating the sprint's starting date and time length.");
                }
                else {
                    if (doc.nModified > 0) {
                        res.status(200).send({ success: true });
                    }
                    else {
                        res.status(409).send("There was a problem with the database while updating the sprint: no updated document.");
                    }
                }
            });
        });
    }
});



//Add a Sprint Service
//Update a task in the sprint's array of tasks
//Suppose :
// PATCH : {"number":"2", "name":"Bepp", "oldName":"T1_P"}
// PATCH : url?number=2&name=Bepp&oldName=T1_P
router.patch('/sprints/:number/projects/:name/tasks/:oldName', function (req, res) {
    const description = req.body.description;
    const taskName = req.body.name;

    const projectName = req.params.name;
    const oldTaskName = req.params.oldName;
    const sprintNumber = req.params.number;

    if (!description || !taskName) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        const db = req.db;
        const sprintCollection = db.get('sprintCollection');

        verifyAuth(req, res, function () {

            const updateSprint = { $set: { "tasks.$": { "description": description, "name": taskName } } };
            const sprintQuery = { projectName: projectName, "number": sprintNumber, tasks: { $elemMatch: { "name": oldTaskName } } };

            sprintCollection.update(sprintQuery, updateSprint, function (err, doc) {
                if (err) {
                    res.status(500).send("There was a problem with the database while updating the project: updating the userStory in the project's userStory list.");
                }
                else {
                    if (doc.nModified > 0) {
                        res.status(200).send({ success: true });
                    }
                    else {
                        res.status(409).send("There was a problem with the database while updating the task: no updated document.");
                    }
                }
            });
        });
    }
});





//Add a Sprint Service
//Delete a task (by it's description) in the sprintCollection
//Suppose :
// DELETE : {"number":"2", "name":"Bepp"}
// DELETE : url?number=2&name=Bepp
router.delete('/sprints/:number/projects/:name/tasks/', function (req, res) {
    const taskDescription = req.body.description;
    const projectName = req.params.name;
    const sprintNumber = req.params.number;

    if (!taskDescription) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        const db = req.db;
        const sprintCollection = db.get('sprintCollection');

        verifyAuth(req, res, function () {
            const updateSprint = { $pull: { tasks: { "description": taskDescription } } };
            const sprintQuery = { projectName: projectName, number: sprintNumber };
            sprintCollection.update(sprintQuery, updateSprint, function (err, doc) {
                if (err) {
                    res.status(500).send("There was a problem with the database while updating the sprint: removing the task in the sprint's tasks list.");
                }
                else {
                    if (doc.nModified > 0) {
                        res.status(200).send({ success: true });
                    }
                    else {
                        res.status(409).send("Task not found.");
                    }
                }
            });
        });
    }
});

// Get service for sprint list of a given project
// projectName required in path
// token required for add a sprint
router.get('/projects/:projectName/sprints', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    verifyAuth(req, res, () => {

        const userLogin = req.decoded.login;
        const projectName = req.params.projectName;
        const db = req.db;

        db.collection("userCollection").findOne({ login: userLogin }, (userError, user) => {
            if (userError) {
                res.status(500).send("There was a problem with the database.");
            }
            else {
                // check if request project is a project of the auth user.
                let userAllowed = false;
                let indexProject = 0;
                const projectsList = user.projects || [];

                while (!userAllowed && indexProject < projectsList.length) {
                    console.log (`${projectsList[indexProject].name} / ${projectName}`)
                    userAllowed = (projectsList[indexProject].name === projectName);
                    indexProject++;
                }

                if (!user || !userAllowed) {
                    // user is not authorized, so throw error
                    res.status(401).send({
                        success: false,
                        message: `User isn't authorized to get this project sprints list.`
                    });
                }
                else {
                    db.collection("sprintCollection").find({ projectName: projectName }, {}, function (e, docs) {
                        if (e) {
                            res.status(500).send("There was a problem with the database.");
                        }
                        else {
                            res.status(200).send(docs || []);
                        }
                    });
                }
            }
        });
    });
});



module.exports = router;