import {browser, by, element} from "protractor";

describe('Adding a memeber to a project', function() {
    it('The user added successfuly a member (developer) to a project list members', function() {

        browser.get('http://localhost:8080/');

        //Hit sign up button
        element(by.name('signup')).click();

        browser.wait(function() {
            return element(by.name('createaccount')).isPresent();
        }, 5000);

        //Fill the sign up form and submit it
        element(by.name('name')).sendKeys('Test');
        element(by.name('surname')).sendKeys('User 2');
        element(by.name('email')).sendKeys('test2@bepp.fr');
        element(by.name('password1')).sendKeys('123');
        element(by.name('password2')).sendKeys('123');

        element(by.name('createaccount')).click();

        //Click to logout
        element(by.name('logout')).click();

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
            return element(by.name('vueensemble')).isPresent();
        }, 5000);

        //Choose the project overview
        element(by.name('vueensemble')).click();
        browser.sleep(5000);

        //Click on Add member button
        element(by.name('newmember')).click();
        browser.sleep(5000);

        //Add the user email and select a task and submit
        element(by.id('addedUserLogin')).sendKeys('test2@bepp.fr');

        browser.sleep(1000);

        element.all(by.id('addedUserRole')).each(function (eachElement, index)
        {
            eachElement.click();
            browser.driver.sleep(500);
            element(by.cssContainingText('option', 'Product Owner')).click();
            browser.driver.sleep(500);
        });


        element(by.name('addmember')).click();

        browser.sleep(500);

        //Click to logout
        element(by.name('logout')).click();

    });
});

