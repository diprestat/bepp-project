describe('PO modifies priority', function() {

    it('Done', function() {

        //Fill the email and password fields and submit
        element(by.name('email')).sendKeys('product_owner@bepp.fr');
        element(by.name('password')).sendKeys('123');

        browser.sleep(3000);

        element(by.name('login')).click();

        browser.wait(function () {
            return element(by.name('Projet Demo')).isPresent();
        }, 5000);

        //Choose the ProjectTest project
        element(by.name('Projet Demo')).click();

        browser.sleep(3000);

        browser.wait(function () {
            return element(by.name('backlog')).isPresent();
        }, 5000);

        //Choose the project backlog
        element(by.name('backlog')).click();
        browser.sleep(3000);

        //Click on Modify US button
        element(by.name('modifyus')).click();
        browser.sleep(500);

        browser.sleep(3000);

        element(by.name('modifypriority')).sendKeys('3');

        browser.sleep(3000);

        //Click on Validate modifications button
        element(by.name('validatemodifs')).click();

        browser.sleep(3000);

        element(by.name('logout')).click();

    });
});

