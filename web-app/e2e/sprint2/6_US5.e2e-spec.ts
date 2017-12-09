import {browser, by, element} from "protractor";

describe('Adding a Userstory to the backlog', function() {
    it('The userstory added successfully', function() {

        browser.get('http://localhost:8080/');

        //Fill the email and password fields and submit
        element(by.name('email')).sendKeys('test@bepp.fr');
        element(by.name('password')).sendKeys('123');

        element(by.name('login')).click();

        browser.wait(function() {
            return element(by.name('ProjetTest')).isPresent();
        }, 5000);

        //Choose the ProjectTest project
        element(by.name('ProjetTest')).click();

        browser.wait(function() {
            return element(by.name('backlog')).isPresent();
        }, 5000);

        //Choose the project backlog
        element(by.name('backlog')).click();
        browser.sleep(1000);

        //Click on Add US button
        element(by.name('newus')).click();
        browser.sleep(500);

        //Fill the US form
        element(by.name('us')).sendKeys("En tant que test user Je souhaite tester l'appli");
        element(by.name('difficulty')).sendKeys('1');

        //Add the US
        element(by.name('addus')).click();

        //Click on Add US button
        element(by.name('newus')).click();
        browser.sleep(500);

        //Fill the US form
        element(by.name('us')).sendKeys("En tant que user Je souhaite utiliser l'appli");
        element(by.name('difficulty')).sendKeys('4');

        //Add the US
        element(by.name('addus')).click();

        //Click to logout
        element(by.name('logout')).click();
    });
});


