import {browser, by, element} from "protractor";

describe('Showing project members list', function() {
    it('The users are here', function() {

        browser.get('http://localhost:8080/');

        //Fill the email and password fields and submit
        element(by.name('email')).sendKeys('test@bepp.fr');
        element(by.name('password')).sendKeys('123');

        element(by.name('login')).click();

        browser.wait(function() {
            return element(by.name('ProjetTest')).isPresent();
        }, 7000);

        //Select the created test project
        element(by.name('ProjetTest')).click();

        browser.wait(function() {
            return element(by.name('vueensemble')).isPresent();
        }, 5000);

        //Select project overview tab
        element(by.name('vueensemble')).click();
        browser.sleep(2000);

        //Verify the added user
        element(by.id('test2@bepp.fr')).isPresent();

        //Click to logout
        element(by.name('logout')).click();
    });
});
