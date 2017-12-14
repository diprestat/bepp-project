import {browser, by, element} from "protractor";

describe('Creating a project', function() {

    it("The test should be successful if the user creates a project and he's redirected to this project overview", function() {

        browser.get('http://localhost:8080/');

        browser.sleep(1000);

        //Fill the email and password fields and submit
        element(by.name('email')).sendKeys('test@bepp.fr');
        element(by.name('password')).sendKeys('123');

        element(by.name('login')).click();

        //Waiting form to appear
        browser.wait(function() {
            return element(by.name('newproject')).isPresent();
        }, 5000);

        element(by.name('newproject')).click();

        browser.wait(function() {
            return element(by.name('addproject')).isPresent();
        }, 5000);

        // Fill the project info form
        element(by.name('project-name')).sendKeys('ProjetTest');
        element(by.name('datedebut')).sendKeys('17112017');
        element(by.name('description')).sendKeys('This is a test project');

        element(by.name('addproject')).click();

        browser.sleep(3000);

        //Expect to go the project overview page
        expect(browser.getCurrentUrl()).toEqual("http://localhost:8080/#/dashboard/projects/ProjetTest/overview");

        browser.sleep(1000);

        //Click to logout
        element(by.name('logout')).click();
    });
});
