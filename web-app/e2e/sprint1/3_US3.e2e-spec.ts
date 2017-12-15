import {browser, by, element} from "protractor";

describe('Verifiying a project existance', function() {

    it("The test should be successful if last created project exists in the left bar", function() {

        //Go to login page
        browser.get('http://localhost:8080/');

        //Fill the email and password fields
        element(by.name('email')).sendKeys('test@bepp.fr');
        element(by.name('password')).sendKeys('123');

        //Click on login
        element(by.name('login')).click();

        browser.sleep(1000);

        //Choose the last created project
        element(by.name('ProjetTest')).click();

        browser.sleep(1000);

        //Expect to get the created project overview page
        expect(browser.getCurrentUrl()).toEqual("http://localhost:8080/#/dashboard/projects/ProjetTest/overview");

        browser.sleep(3000);

        //Click to logout
        element(by.name('logout')).click();

    });
});
