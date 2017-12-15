describe('Adding a PO account', function() {

    it('Done', function() {

        //Go to login page
        browser.get('http://localhost:8080/');

        browser.sleep(2000);

        element(by.name('signup')).click();

        browser.wait(function () {
            return element(by.name('createaccount')).isPresent();
        }, 5000);

        browser.sleep(2000);
        //Fill the sign up form and submit it
        element(by.name('name')).sendKeys('Demo');
        element(by.name('surname')).sendKeys('Product Owner');
        element(by.name('email')).sendKeys('product_owner@bepp.fr');
        element(by.name('password1')).sendKeys('123');
        element(by.name('password2')).sendKeys('123');

        element(by.name('createaccount')).click();

        browser.sleep(3000);

        //Click to logout
        element(by.name('logout')).click();

        browser.sleep(1000);

        //Fill the email and password fields and submit
        element(by.name('email')).sendKeys('developer@bepp.fr');
        element(by.name('password')).sendKeys('123');

        element(by.name('login')).click();

        browser.sleep(2000);

        browser.wait(function () {
            return element(by.name('Projet Demo')).isPresent();
        }, 5000);

        //Choose the ProjectTest project
        element(by.name('Projet Demo')).click();

        browser.wait(function () {
            return element(by.name('vueensemble')).isPresent();
        }, 5000);

        //Choose the project overview
        element(by.name('vueensemble')).click();
        browser.sleep(5000);

        //Click on Add member button
        element(by.name('newmember')).click();
        browser.sleep(3000);

        //Add the user email and select a task and submit
        element(by.id('addedUserLogin')).sendKeys('product_owner@bepp.fr');

        browser.sleep(1000);

        element.all(by.id('addedUserRole')).each(function (eachElement, index) {
            eachElement.click();
            browser.driver.sleep(500);
            element(by.cssContainingText('option', 'Product Owner')).click();
            browser.driver.sleep(500);
        });

        browser.sleep(2000);

        element(by.name('addmember')).click();

    });
});
