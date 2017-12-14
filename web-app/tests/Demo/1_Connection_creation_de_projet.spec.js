describe('Creating a user account', function() {

    it('The test should be successful if the user is created and redirected to the dashboard', function() {

        //Go to login page
        browser.get('http://localhost:8080/');

        browser.sleep(5000);

        //Hit sign up button
        element(by.name('signup')).click();

        browser.sleep(3000);

        browser.wait(function () {
            return element(by.name('createaccount')).isPresent();
        }, 5000);

        //Fill the sign up form and submit it
        element(by.name('name')).sendKeys('Demo');
        element(by.name('surname')).sendKeys('Developer');
        element(by.name('email')).sendKeys('developer@bepp.fr');
        element(by.name('password1')).sendKeys('123');
        element(by.name('password2')).sendKeys('123');

        browser.sleep(5000);

        element(by.name('createaccount')).click();

        browser.sleep(3000);

        //Waiting form to appear
        browser.wait(function () {
            return element(by.name('newproject')).isPresent();
        }, 5000);

        element(by.name('newproject')).click();

        browser.wait(function () {
            return element(by.name('addproject')).isPresent();
        }, 5000);

        browser.sleep(4000);

        // Fill the project info form
        element(by.name('project-name')).sendKeys('ProjetTest');
        element(by.name('datedebut')).sendKeys('15122017');
        element(by.name('description')).sendKeys('This is a demo project');

        browser.sleep(2000);

        element(by.name('addproject')).click();

        browser.sleep(6000);

        element(by.name('logout')).click();
    })
});
