const express = require('express');
const constants = require('./utils/api-constants');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const router = express.Router();

//Authentification Service
//Check Login Password
router.post('/token', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const userLogin = req.body.login;
    const userPassword = req.body.password;

    if (userLogin == null || userPassword == null) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        //Compléter le service REST qui vérifie que la BD contient bien le login et le password d'un utilisateur(connexion d'un utilisateur US1)
        // Set our internal DB variable
        var db = req.db;

        // Find in a collection
        var query = {login: userLogin, password: userPassword};

        db.collection("userCollection").find(query, {}, function (e, docs) {
            if (docs.length != 0) {
                const token = jwt.sign(docs[0], constants.superSecret);
                res.json({
                    success: true,
                    message: 'Authentication succeded!',
                    token: token
                });
            }
            else {
                res.status(400).json({success: false, message: 'Authentication failed. Wrong login/password.'});
            }
        });
    }
});

//Add a User Service
//Suppose :
// POST : {"name":"foo", "surname":"bar", "login":"user", "password":"pwd"}
// POST : url?name=foo&surname=bar&login=user&password=pwd
router.post('/', function (req, res) {
    var name = req.body.name;
    var surname = req.body.surname;
    var login = req.body.login;
    var password = req.body.password;

    if (name == null || surname == null || login == null || password == null) {
        res.status(422).send("Missing Arguments.");
    }
    else {
        var db = req.db;
        var collection = db.get('userCollection');

        //Check if login already exists
        collection.find({ login: login }, {}, function (err, doc) {
            if (err) {
                res.status(500).send("There was a problem with the database while checking if the login already exists.");
            }
            else {
                if (doc.length == 0) {
                    //Add the user
                    collection.insert({
                        "name": name,
                        "surname": surname,
                        "login": login,
                        "password": password
                    }, function (err) {
                        if (err) {
                            res.status(500).send("There was a problem with the database while adding the user.");
                        }
                        else {
                            res.status(200).send({ success: true });
                        }
                    });
                }
                else {
                    res.status(409).send("There is already a user with this login.");
                }
            }
        });
    }
});


//Get a User Service
//From the Login
router.get('/:login', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var userLogin = req.params.login;
    //Remplacer userTestJSON par une requête MangoDB qui sélectionne un user selon son login
    var db = req.db;

    // Find in a collection
    var query = { login: userLogin };

    db.collection("userCollection").find(query, {}, function (e, docs) {
        if (docs.length > 0) {
            res.status(200).send(docs[0]);
        }
        else {
            res.status(404);
            res.send({ error: 404 });
        }
    });
});


module.exports = router;