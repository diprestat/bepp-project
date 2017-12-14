const express = require('express');
const router = express.Router();
const verifyAuth = require('./utils/verify-auth');

//Add a UserStory Service
//Add an userStory in the projectCollection array: userStories
//Suppose :
// PUT : {"name":"foo"}
// PUT : url?name=foo
router.put('/projects/:name', function (req, res) {
    var description = req.body.description;
    var difficulty = req.body.difficulty;
    var projectName = req.params.name;

    if (description == null || difficulty == null) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        var db = req.db;
        var projectCollection = db.get('projectCollection');

        verifyAuth(req, res, function () {
            projectCollection.findOne({ name: projectName, 'userStories.description': description}, function(err, userStory) {
                if(err) {
                    res.status(500).send("There was a problem with the database while creating the userStory: checking if the userStory description is already used.");
                }
                else {
                    if(userStory == null) {
                        //add the userStory in the projectCollection
                        var updateProject = {$addToSet: {userStories: {"description": description, "difficulty": difficulty}}};
                        var projectQuery = {name: projectName};
                        projectCollection.update(projectQuery, updateProject, function (err) {
                            if (err) {
                                res.status(500).send("There was a problem with the database while creating the userStory: adding the userStory to the project's userStory list.");
                            }
                            else {
                                res.status(200).send({ success: true });
                            }
                        });
                    }
                    else {
                        res.status(409).send("There was a problem with the database while creating the userStory: this description is already used in this project.");
                    }
                }
            });
        });
    }
});


//Add a UserStory Service
//Update a userStory in the project's array of userStories
//Suppose :
// PATCH : {"oldDescription":"ma_description", "name":"project1"}
// PATCH : url?oldDescription=ma_description&name=project1
router.patch('/:oldDescription/projects/:name/', function (req, res) {
    var description = req.body.description;
    var difficulty = req.body.difficulty;
    var projectName = req.params.name;
    var userStoryOldDescription = req.params.oldDescription;

    if (description == null || difficulty == null) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        var db = req.db;
        var projectCollection = db.get('projectCollection');

        verifyAuth(req, res, function () {
            //update the userStory in the projectCollection's array

            var updateProject = {$set: {"userStories.$": {"description": description, "difficulty": difficulty}}};
            
            var projectQuery = {name: projectName, userStories: { $elemMatch: {"description": userStoryOldDescription}}};

            projectCollection.update(projectQuery, updateProject, function (err, doc) {
                console.log("Request (Patch): " + projectName + " " + description + " " + userStoryOldDescription);
                console.log(doc);
                if (doc.nModified != 0) {
                    if (err) {
                        res.status(500).send("There was a problem with the database while updating the project: updating the userStory in the project's userStory list.");
                    }
                    else {
                        res.status(200).send({success: true});
                    }
                }
                else {
                    res.status(409).send("UserStory not found.");
                }
            });
        });
    }
});


//Add a UserStory Service
//Delete a userStory (by it's description) in the projectCollection. Also update the project's array of userStories
//Suppose :
// DELETE : {"description":"foo"}
// DELETE : url?description=foo
router.delete('/:description/projects/:name', function (req, res) {
    var projectName = req.params.name;
    var userStoryDescription = req.params.description;

    var db = req.db;
    var projectCollection = db.get('projectCollection');

    verifyAuth(req, res, function () {
        //Update projectCollection by removing the userstory of it's list
        const updateProject = { $pull: { userStories: { "description": userStoryDescription } } };
        const projectQuery = { name: projectName };
        console.log(projectQuery);
        console.log(updateProject);
        projectCollection.update(projectQuery, updateProject, {}, function (err, doc) {
            console.log("Delete");
            console.log(doc);
            if (doc.nModified !== 0) {
                if (err) {
                    res.status(500).send("There was a problem with the database while updating the project: removing the userStory in the project's userStory list.");
                }
                else {
                    res.status(200).send({ success: true });
                }
            }
            else {
                res.status(409).send("UserStory not found.");
            }
        });
    });
});



//Add a UserStory Service
//Update the priority of a userStory in the projectCollection.
//Suppose :
// PATCH : {"description":"usdescription", "name":"project1", "role":"PO"}
// PATCH : url?description=usdescription&name=project1&role=PO
router.patch('/:description/projects/:name/user/:role', function (req, res) {
    var priority = req.body.priority;
    var projectName = req.params.name;
    var userStoryDescription = req.params.description;
    var userRole = req.params.role;

    if (priority == null) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        if(userRole == "Product Owner"){
            var db = req.db;
            var projectCollection = db.get('projectCollection');

            verifyAuth(req, res, function () {

                //update the userStory in the projectCollection's array
                var updateProject = {$set: {"userStories.$.priority" : priority}};
                var projectQuery = {name: projectName, userStories: { $elemMatch: {"description": userStoryDescription}}};
                projectCollection.update(projectQuery, updateProject, function (err, doc) {
                    console.log("Request (PatchPrio): " + userStoryDescription);
                    console.log(doc);
                    if (doc.nModified != 0) {
                        if (err) {
                            res.status(500).send("There was a problem with the database while updating the userStory's priority.");
                        }
                        else {
                            res.status(200).send({success: true});
                        }
                    }
                    else{
                        res.status(409).send("UserStory not found.");
                    }
                });

            });
        }  
        else{
            res.status(403).send("User not allowed.");
        }
    }
});

module.exports = router;