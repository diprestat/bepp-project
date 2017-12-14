import {browser, by, element} from "protractor";

describe('Addind a new Sprint to the project', function() {
    it('The Sprint is successfully added', function() {

        browser.get('http://localhost:8080/');

        //Fill the email and password fields and submit
        element(by.name('email')).sendKeys('test@bepp.fr');
        element(by.name('password')).sendKeys('123');

        element(by.name('login')).click();

        browser.wait(function () {
            return element(by.name('ProjetTest')).isPresent();
        }, 5000);

        //Choose the ProjectTest project
        element(by.name('ProjetTest')).click();

        browser.wait(function () {
            return element(by.name('sprints')).isPresent();
        }, 5000);

        //Choose the project backlog
        element(by.name('sprints')).click();
        browser.sleep(500);

        element(by.name('newsprint')).click();

        element(by.name('start_date')).sendKeys('15/12/2017');
        element(by.name('end_date')).sendKeys('22/12/2017');

        //Choose the project backlog
        element(by.name('addsprint')).click();
        browser.sleep(500);

        //Click to logout
        element(by.name('logout')).click();

    });
});
