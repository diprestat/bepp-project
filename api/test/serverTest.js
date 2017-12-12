var expect = require("chai").expect;
var request = require("request");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

describe("Scrum Management API", function () {

    const url = "http://localhost:8080/api/";

    describe("POST Créer un utilisateur", function () {
        const localurl = url + "users/";

        it("Bad request (missing Argument) : returns status 422", function (done) {
            request.post({
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                url: localurl,
                form: { login: "dprestat", password: "dp33", surname: "Dimitri" }
            }, function(error, response) {
                expect(response.statusCode).to.equal(422);
                done();
            });
        });

        it("Good request : returns status 200", function (done) {
            request.post({
                headers: { 'content-type': 'application/x-www-form-urlencoded'},
                url: localurl,
                form: { login: "dprestat", password: "dp33", name: "Prestat", surname: "Dimitri"}
            }, function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it("Another request : returns status 200", function (done) {
            request.post({
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                url: localurl,
                form: { login: "abounader", password: "ab33", name: "Bounader", surname: "Adrien" }
            }, function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it("Duplicate request : returns status 409", function (done) {
            request.post({
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                url: localurl,
                form: { login: "dprestat", password: "dp33", name: "Prestat", surname: "Dimitri" }
            }, function (error, response) {
                expect(response.statusCode).to.equal(409);
                done();
            });
        });

    });

    describe("POST Authentification", function () {
        var localurl = url + "users/token";

        it("Bad Request (missing arguments) : returns status 409", function (done) {
            request.post({
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                url: localurl,
                form: { password: "dp33" }
            }, function (error, response, body) {
                expect(response.statusCode).to.equal(422);
                done();
            });
        });

        it("Bad Request (not matching arguments) : returns status 409", function (done) {
            request.post({
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                url: localurl,
                form: { login: "dpresta", password: "dp33" }
            }, function (error, response) {
                expect(response.statusCode).to.equal(400);
                done();
            });
        });

        it("Good Request : returns status 200", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: localurl,
                form: {login: "dprestat", password: "dp33" }
            }, function (error, response) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
        it("fetched the associated user", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: localurl,
                form: {login: "dprestat", password: "dp33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                var token = bodyJson.token;
                jwt.verify(token, "12345", function (err, decoded) {
                    expect(decoded.login).to.equal("dprestat");
                    expect(decoded.password).to.equal("dp33");
                });
                done();

            });
        });
    });


    describe("POST Créer un projet", function () {
        var localurl = url + "projects/";
        var authurl = url + "users/token";

        it("Bad request (missing Argument) : returns status 422", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "dprestat", password: "dp33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                //done();
                request.post({
                    headers: { 'x-access-token': bodyJson.token },
                    url: localurl,
                    form: { name: "Bepp" }
                }, function (error, response) {
                    expect(response.statusCode).to.equal(422);
                    done();
                });

            });
        });

        it("Bad request (missing Token) : returns status 401", function (done) {
            request.post({
                url: localurl,
                form: {name: "Bepp"}
            }, function (error, response, body) {
                expect(response.statusCode).to.equal(422);
                done();
            });
        });

        it("Bad request (bad Token) : returns status 401", function (done) {
            request.post({
                headers: { 'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "abounad", password: "ab33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                //done();
                request.post({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { name: "Bepp", description: "Notre projet"}
                }, function(error, response, body) {
                    expect(response.statusCode).to.equal(401);
                    done();
                });

            });
        });

        it("Good request : returns status 200", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "dprestat", password: "dp33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                //done();
                request.post({
                    headers: {'x-access-token': bodyJson.token},
                    url: localurl,
                    form: {name: "Bepp", description: "Notre projet"}
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });

            });
        });


        it("Duplicate request : returns status 409", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "dprestat", password: "dp33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                //done();
                request.post({
                    headers: {'x-access-token': bodyJson.token},
                    url: localurl,
                    form: {name: "Bepp", description: "Notre projet"}
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(409);
                    done();
                });

            });
        });
    });


    describe("GET Obtenir un utilisateur", function () {
        var localurl = url + "users/dprestat";
        it("Good request : returns status 200", function (done) {
            request.get({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: localurl,
            }, function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it("fetched the associated user", function (done) {
            request.get({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: localurl,
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                var login = bodyJson.login;
                var password = bodyJson.password;
                var name = bodyJson.name;
                var surname = bodyJson.surname;

                expect(login).to.equal("dprestat");
                expect(password).to.equal("dp33");
                expect(name).to.equal("Prestat");
                expect(surname).to.equal("Dimitri");
                done();
            });
        });
    });

    describe("GET Obtenir un projet", function () {
        var localurl = url + "projects/Bepp";
        var authurl = url + "users/token";

        it("Bad request (missing Token) : returns status 401", function (done) {
            request.get({
                url: localurl,
            }, function (error, response, body) {
                expect(response.statusCode).to.equal(401);
                done();
            });
        });

        it("Bad request (bad Token) : returns status 401", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "abounad", password: "ab33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                //done();
                request.get({
                    headers: {'x-access-token': bodyJson.token},
                    url: localurl,
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(401);
                    done();
                });

            });
        });

        it("Bad request (Unauthorized Token) : returns status 403", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "abounader", password: "ab33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                //done();
                request.get({
                    headers: {'x-access-token': bodyJson.token},
                    url: localurl,
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(403);
                    done();
                });
            });
        });

        it("Good request : returns status 200", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "dprestat", password: "dp33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                //done();
                request.get({
                    headers: {'x-access-token': bodyJson.token},
                    url: localurl,
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });

            });
        });
    });

    describe("PUT Ajouter un utilisateur à un projet", function () {
        var localurl = url + "projects/Bepp/users/abounader";
        var authurl = url + "users/token";

        it("Bad request (missing Token) : returns status 401", function (done) {
            request.put({
                url: localurl,
            }, function (error, response, body) {
                expect(response.statusCode).to.equal(401);
                done();
            });
        });

        it("Bad request (bad Token) : returns status 401", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "abounad", password: "ab33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                //done();
                request.put({
                    headers: {'x-access-token': bodyJson.token},
                    url: localurl,
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(401);
                    done();
                });

            });
        });

        it("Bad request (Unauthorized Token) : returns status 403", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "abounader", password: "ab33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                //done();
                request.put({
                    headers: {'x-access-token': bodyJson.token},
                    url: localurl,
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(403);
                    done();
                });
            });
        });

        it("Good request : returns status 200", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "dprestat", password: "dp33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                //done();
                request.put({
                    headers: {'x-access-token': bodyJson.token},
                    url: localurl,
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });

            });
        });
    });


    describe("PUT Créer une user story", function () {
        const localurl = url + "userStories/projects/Bepp";
        const authurl = url + "users/token";

        it("Bad request (missing Argument) : returns status 422", function (done) {
            request.post({
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                url: authurl,
                form: { login: "dprestat", password: "dp33" }
            }, function (error, response, body) {
                const bodyJson = JSON.parse(body);
                request.put({
                    headers: { 'x-access-token': bodyJson.token },
                    url: localurl,
                    form: { description: "ma user story préférée" }
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(422);
                    done();
                });

            });
        });

        it("Bad request (missing Token) : returns status 401", function (done) {
            request.put({
                url: localurl,
                form: {name: "Bepp"}
            }, function (error, response, body) {
                expect(response.statusCode).to.equal(422);
                done();
            });
        });

        it("Bad request (bad Token) : returns status 401", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "abounad", password: "ab33"}
            }, function (error, response, body) {
                const bodyJson = JSON.parse(body);
                request.put({
                    headers: { 'x-access-token': bodyJson.token },
                    url: localurl,
                    form: { description: "ma_user_story_preferee", difficulty: "3" }
                }, function (error, response) {
                    expect(response.statusCode).to.equal(401);
                    done();
                });

            });
        });

        it("Good request : returns status 200", function (done) {
            request.post({
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                url: authurl,
                form: { login: "dprestat", password: "dp33" }
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                request.put({
                    headers: { 'x-access-token': bodyJson.token },
                    url: localurl,
                    form: { description: "ma_user_story_preferee", difficulty: "3" }
                }, function(error, response) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });

            });
        });

        it("Another Good request : returns status 200", function(done) {
            request.post({
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                url: authurl,
                form: { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.put({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { description: "my_best_user_story", difficulty: "3" }
                }, function(error, response) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });

            });
        });

        it("Bad request : returns status 409", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.put({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { description: "ma_user_story_preferee", difficulty: "4" }
                }, function(error, response) {
                    expect(response.statusCode).to.equal(409);
                    done();
                });

            });
        });


    });


    describe("PATCH Modifier une user story", function () {
        var localurl = url + "userStories/ma_user_story_preferee/projects/Bepp/";
        var authurl = url + "users/token";

        it("Bad request (missing Argument) : returns status 422", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "dprestat", password: "dp33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                request.patch({
                    headers: {'x-access-token': bodyJson.token},
                    url: localurl,
                    form: {description: "ma_user_story_pref"}
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(422);
                    done();
                });

            });
        });

        it("Bad request (missing Token) : returns status 40", function (done) {
            request.patch({
                url: localurl,
                form: {name: "Bepp"}
            }, function (error, response, body) {
                expect(response.statusCode).to.equal(422);
                done();
            });
        });

        it("Bad request (bad Token) : returns status 401", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "abounad", password: "ab33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                request.patch({
                    headers: { 'x-access-token': bodyJson.token },
                    url: localurl,
                    form: { description: "ma_user_story_pref", difficulty: "3" }
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(401);
                    done();
                });

            });
        });

        var localurl2 = url + "userStories/ma_user_story/projects/Bepp/";
        it("Bad request (UserStory not found) : returns status 409", function (done) {
            request.post({
                headers: { 'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "dprestat", password: "dp33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                request.patch({
                    headers: { 'x-access-token': bodyJson.token },
                    url: localurl2,
                    form: { description: "ma_user_story_pref3", difficulty: "3" }
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(409);
                    done();
                });
            });
        });

        it("Good request : returns status 200", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "dprestat", password: "dp33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                request.patch({
                    headers: {'x-access-token': bodyJson.token},
                    url: localurl,
                    form: {description: "my_prefered_user_story4", difficulty: "3"}
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });

            });
        });

    });


    describe("PATCH Modifier desrcription et difficulty d'une user story", function () {
        var localurl = url + "userStories/my_prefered_user_story4/projects/Bepp/user/Product%20Owner";
        var authurl = url + "users/token";

        it("Bad request (missing Argument) : returns status 422", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "dprestat", password: "dp33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                request.patch({
                    headers: {'x-access-token': bodyJson.token},
                    url: localurl
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(422);
                    done();
                });

            });
        });

        it("Bad request (missing Token) : returns status 401", function (done) {
            request.patch({
                url: localurl,
                form: {name: "Bepp"}
            }, function (error, response, body) {
                expect(response.statusCode).to.equal(422);
                done();
            });
        });

        it("Bad request (bad Token) : returns status 401", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "abounad", password: "ab33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                request.patch({
                    headers: {'x-access-token': bodyJson.token},
                    url: localurl,
                    form: {priority: "1"}
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(401);
                    done();
                });

            });
        });

        it("Bad request (UserStory not found) : returns status 409", function(done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "dprestat", password: "dp33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                request.patch({
                    headers: {'x-access-token': bodyJson.token},
                    url: url + "userStories/my_prefered_US/projects/Bepp/user/Product%20Owner",
                    form: {priority: "1"}
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(409);
                    done();
                });

            });
        });

        localurl = url + "userStories/my_prefered_user_story4/projects/Bepp/user/Product Owner";
        it("Good request : returns status 200", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "dprestat", password: "dp33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                request.patch({
                    headers: {'x-access-token': bodyJson.token},
                    url: url + "userStories/my_prefered_user_story4/projects/Bepp/user/Product%20Owner",
                    form: {priority: "1"}
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });

            });
        });

    });

    describe("DELETE Supprimer une user story", function () {
        var localurl = url + "userStories/my_prefered_user_story/projects/Bepp/";
        var authurl = url + "users/token";

        it("Bad request (missing Token) : returns status 401", function (done) {
            request.delete({
                url: localurl,
                form: {name: "Bepp"}
            }, function (error, response, body) {
                expect(response.statusCode).to.equal(401);
                done();
            });
        });

        it("Bad request (bad Token) : returns status 401", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "abounad", password: "ab33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                request.delete({
                    headers: {'x-access-token': bodyJson.token},
                    url: localurl
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(401);
                    done();
                });

            });
        });

        localurl = url + "userStories/my_prefered_US/projects/Bepp/";
        it("Bad request : returns status 409", function (done) {
            request.post({
                headers: { 'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: { login: "dprestat", password: "dp33" }
            }, function (error, response, body) {
                const bodyJson = JSON.parse(body);
                request.delete({
                    headers: { 'x-access-token': bodyJson.token },
                    url: url + "userStories/my_prefered_US/projects/Bepp/"
                }, function (error, response, body) {
                    expect(response.statusCode).to.equal(409);
                    done();
                });
            });
        });

        localurl = url + "userStories/my_prefered_user_story4/projects/Bepp/";
        it("Good request : returns status 200", function (done) {
            request.post({
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: authurl,
                form: {login: "dprestat", password: "dp33"}
            }, function (error, response, body) {
                var bodyJson = JSON.parse(body);
                request.delete({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     url + "userStories/my_prefered_user_story4/projects/Bepp/"
                }, function(error, response) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });

            });
        });
    });






    describe("POST Créer un sprint", function() {
        var localurl = url + "sprints/projects/Bepp";
        var authurl = url + "users/token";

        it("Bad request (missing Argument) : returns status 422", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.put({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { time: "2"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(422);
                    done();
                });

            });
        });

        it("Bad request (missing Token) : returns status 401", function(done) {
                request.put({
                    url:     localurl,
                    form:    { name: "Bepp"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(422);
                    done();
                });
        });

        it("Bad request (bad Token) : returns status 401", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "abounad", password: "ab33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.put({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { time: "2", startingDate: "15/12/2017"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(401);
                    done();
                });

            });
        });


        it("Good request : returns status 200", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.put({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { time: "2", startingDate: "15/12/2017"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });

            });
        });

        it("Good request : returns status 200", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.put({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { time: "3", startingDate: "29/12/2017"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });

            });
        });

    });




    describe("PUT Associer une UserStory à un sprint", function() {
        var localurl = url + "sprints/2/projects/Bepp/userStories";
        var authurl = url + "users/token";

        it("Bad request (missing Argument) : returns status 422", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.put({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { priority: 4}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(422);
                    done();
                });

            });
        });

        it("Bad request (missing Token) : returns status 40", function(done) {
                request.put({
                    url:     localurl,
                    form:    { name: "Bepp"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(422);
                    done();
                });
        });

        it("Bad request (bad Token) : returns status 401", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "abounad", password: "ab33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.put({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { description: "my_best_user_story", difficulty: 3, priority: 1}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(401);
                    done();
                });

            });
        });

        it("Good request : returns status 200", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.put({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { description: "my_best_user_story", difficulty: 3, priority: 1}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });

            });
        });

    });



    describe("PUT Créer une tache", function() {
        var localurl = url + "sprints/2/projects/Bepp/tasks/";
        var authurl = url + "users/token";

        it("Bad request (missing Argument) : returns status 422", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.put({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { description: "my_best_task"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(422);
                    done();
                });

            });
        });

        it("Bad request (missing Token) : returns status 401", function(done) {
            request.put({
                url:     localurl,
                form:    { name: "Bepp"}
            }, function(error, response) {
                expect(response.statusCode).to.equal(422);
                done();
            });
        });

        it("Bad request (bad Token) : returns status 401", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "abounad", password: "ab33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.put({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { description: "my_best_task_presentation", name: "T1_P"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(401);
                    done();
                });

            });
        });

        it("Good request : returns status 200", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.put({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { description: "my_best_task_presentation", name: "T1_P"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });

            });
        });

        it("Another Good request : returns status 200", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.put({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { description: "my_best_task_presentation_metier", name: "T1_PM"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });

            });
        });
    });






    describe("PATCH Modifier date debut et duree d'un sprint", function() {
        var localurl = url + "sprints/2/projects/Bepp/";
        var authurl = url + "users/token";

        it("Bad request (missing Argument) : returns status 422", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.patch({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl
                }, function(error, response) {
                    expect(response.statusCode).to.equal(422);
                    done();
                });

            });
        });

        it("Bad request (missing Token) : returns status 401", function(done) {
            request.patch({
                url:     localurl,
                form:    { name: "Bepp"}
            }, function(error, response) {
                expect(response.statusCode).to.equal(422);
                done();
            });
        });

        it("Bad request (bad Token) : returns status 401", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "abounad", password: "ab33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.patch({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { time: "1", startingDate: "10/12/2017"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(401);
                    done();
                });

            });
        });

        it("Bad request (not found) : returns status 409", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.patch({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     url + "sprints/2/projects/Bep/",
                    form:    { time: "1", startingDate: "10/12/2017"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(409);
                    done();
                });

            });
        });

        it("Good request : returns status 200", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.patch({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { time: "1", startingDate: "10/12/2017"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });

            });
        });

    });






    describe("PATCH Modifier description et nom d'une tache d'un sprint", function() {
        var localurl = url + "sprints/2/projects/Bepp/tasks/T1_P";
        var authurl = url + "users/token";

        it("Bad request (missing Argument) : returns status 422", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.patch({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { name: "T2_P"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(422);
                    done();
                });

            });
        });

        it("Bad request (missing Token) : returns status 401", function(done) {
            request.patch({
                url:     localurl,
                form:    { name: "Bepp"}
            }, function(error, response) {
                expect(response.statusCode).to.equal(422);
                done();
            });
        });

        it("Bad request (bad Token) : returns status 401", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "abounad", password: "ab33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.patch({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { name: "T2_P", description: "my_modified_task"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(401);
                    done();
                });

            });
        });

        it("Bad request (not found) : returns status 409", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.patch({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     url + "sprints/2/projects/Bepp/tasks/T3_P",
                    form:    { name: "T4_P", description: "my_modified_task"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(409);
                    done();
                });

            });
        });

        it("Good request : returns status 200", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.patch({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:    { name: "T2_P", description: "my_modified_task"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });

            });
        });

    });






    describe("DELETE Supprimer une tache", function() {
        var localurl = url + "sprints/2/projects/Bepp/tasks/";
        var authurl = url + "users/token";


        it("Bad request (missing Argument) : returns status 422", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.delete({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl
                }, function(error, response) {
                    expect(response.statusCode).to.equal(422);
                    done();
                });

            });
        });


        it("Bad request (missing Token) : returns status 401", function(done) {
            request.delete({
                url:     localurl,
                form:    { name: "Bepp"}
            }, function(error, response) {
                expect(response.statusCode).to.equal(422);
                done();
            });
        });

        it("Bad request (bad Token) : returns status 401", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "abounad", password: "ab33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.delete({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form: {description: "my_modified_task"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(401);
                    done();
                });

            });
        });

        it("Bad request (not found) : returns status 409", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.delete({
                    headers: {'x-access-token' : bodyJson.token},
                    url:    url + "sprints/2/projects/Bepp/tasks/",
                    form:   {description: "my_task"}
                }, function(error, response) {
                    expect(response.statusCode).to.equal(409);
                    done();
                });
            });
        });

        it("Good request : returns status 200", function(done) {
            request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     authurl,
                form:    { login: "dprestat", password: "dp33"}
            }, function(error, response, body) {
                var bodyJson = JSON.parse(body);
                request.delete({
                    headers: {'x-access-token' : bodyJson.token},
                    url:     localurl,
                    form:   {description: "my_modified_task"}
                }, function (error, response) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });

            });
        });
    });
});
