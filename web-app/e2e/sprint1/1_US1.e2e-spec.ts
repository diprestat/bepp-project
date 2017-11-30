import {browser, by, element} from "protractor";

describe('Creating a user account', function() {

    it('The user account is created, redirection to the dashboard', function() {

        //Go to login page
        browser.get('http://localhost:8080/');

        //Hit sign up button
        element(by.name('signup')).click();

        browser.wait(function() {
            return element(by.name('createaccount')).isPresent();
        }, 5000);

        //Fill the sign up form and submit it
        element(by.name('name')).sendKeys('Ami');
        element(by.name('surname')).sendKeys('Amn');
        element(by.name('email')).sendKeys('amine@email.com');
        element(by.name('password1')).sendKeys('123');
        element(by.name('password2')).sendKeys('123');

        element(by.name('createaccount')).click();

        //Should be redirected to the dashboard !
        expect(browser.getCurrentUrl()).toEqual("http://localhost:8080/#/dashboard/newproject");

        //Click to logout
        element(by.name('logout')).click();
    });
});
