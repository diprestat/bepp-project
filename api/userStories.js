const express = require('express');
const env = require ('./utils/environment');
const monk = require('monk');	//we use monk to talk to MongoDB
const db = monk(env.DB_URL);	//our database is nodetest1
const router = express.Router();
const verifyAuth = require('./utils/verify-auth');

// Make our db accessible to our router
router.use(function (req, res, next) {
    req.db = db;
    next();
});

//Add a UserStory Service
//Add an userStory in the projectCollection array: userStories
//Suppose :
// PUT : {"name":"foo"}
// PUT : url?name=foo
router.put('/projects/:name', function (req, res) {
    var description = req.body.description;
    var difficulte = req.body.difficulte;
    var projectName = req.params.name;

    if (description == null || difficulte == null) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        var db = req.db;
        var projectCollection = db.get('projectCollection');

        verifyAuth(req, res, function () {

            //add the userStory in the projectCollection
            var updateProject = {$addToSet: {userStories: {"description": description, "difficulty": difficulte}}};
            var projectQuery = {name: projectName};
            projectCollection.update(projectQuery, updateProject, function (err, doc) {
                    if (err) {
                        res.status(500).send("There was a problem with the database while updating the project: adding the userStory to the project's userStory list.");
                    }
                    else {
                        res.status(200).send({success: true});
                    }
            });
        });
    }
});


//Add a UserStory Service
//Update a userStory in the project's array of userStories
//Suppose :
// PATCH : {"id":"usid", "name":"project1"}
// PATCH : url?id=usid&name=project1
router.patch('/:oldDescription/projects/:name/', function (req, res) {
    var description = req.body.description;
    var difficulte = req.body.difficulte;
    var priority = req.body.priority;
    var projectName = req.params.name;
    var userStoryOldDescription = req.params.oldDescription;

    if (description == null || difficulte == null) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        var db = req.db;
        var projectCollection = db.get('projectCollection');

        verifyAuth(req, res, function () {
            //update the userStory in the projectCollection's array

            var updateProject = {$set: {"userStories.$": {"description": description, "difficulty": difficulte}}};
            
            var projectQuery = {name: projectName, userStories: { $elemMatch: {"description": userStoryOldDescription}}};
            //REQUETE QUI FONCTIONNE DANS MONGO
            //db.projectCollection.update({name: "Bepp", "userStories.description": "ma_user_story_preferee", "userStories.difficulty": "3"}, {$set: {"userStories.$.description": "mon_us", "userStories.$.difficulty": 4}})

            /*var updateProject = {$set: {"userStories.$.description": description, "userStories.$.difficulty": difficulte}}};
            var projectQuery = {name: projectName, "userStories.description": userStoryOldDescription};*/
            console.log(projectQuery);
            console.log(updateProject);

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
                else{
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
        projectCollection.update(projectQuery, updateProject, {}, function (err, doc, toto ) {
            console.log("Delete");
            console.log(JSON.stringify(doc));
            console.log (JSON.stringify(toto))
            if (doc.nModified !== 0) {
                if (err) {
                    res.status(500).send("There was a problem with the database while updating the project: removing the userStory in the project's userStory list.");
                }
                else {
                    res.status(200).send({ success: true, toto: userStoryDescription });
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