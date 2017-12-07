import {browser, by, element} from "protractor";

describe("Showing backlog's userstories", function() {

    it("The userstories are here !", function() {

        browser.get('http://localhost:8080/');

        //Fill the email and password fields and submit
        element(by.name('email')).sendKeys('test@bepp.fr');
        element(by.name('password')).sendKeys('123');

        element(by.name('login')).click();

        element(by.name('ProjetTest')).click();

        //Go to sprints menu
        element(by.name('backlog')).click();
        browser.sleep(3000);

        //Click to logout
        element(by.name('logout')).click();

    });
});
