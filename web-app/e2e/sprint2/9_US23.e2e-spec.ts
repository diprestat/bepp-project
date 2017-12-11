import {browser, by, element} from "protractor";

describe('Modifiying a US priority as a PO', function() {

    it("The PO modified successfully the priority of the US", function() {

        browser.get('http://localhost:8080/');

        //Fill the email and password fields and submit
        element(by.name('email')).sendKeys('test2@bepp.fr');
        element(by.name('password')).sendKeys('123');

        element(by.name('login')).click();

        element(by.name('ProjetTest')).click();

        //Go to sprints menu
        element(by.name('backlog')).click();
        browser.sleep(3000);

        //Click on Modify US button
        element(by.name('modifyus')).click();
        browser.sleep(500);

        // Modify the priority
        element(by.name('modifypriority')).sendKeys('5');

        //Click on Validate modifications button
        element(by.name('validatemodifs')).click();
        browser.sleep(1000);

        //Click to logout
        element(by.name('logout')).click();

    });
});
