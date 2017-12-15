describe('Adding 2 US', function() {

    it('Works', function () {

        browser.wait(function () {
            return element(by.name('backlog')).isPresent();
        }, 5000);

        browser.sleep(2000);
        //Choose the project backlog
        element(by.name('backlog')).click();
        browser.sleep(3000);

        //Click on Add US button
        element(by.name('newus')).click();

        browser.sleep(3000);

        //Fill the US form
        element(by.name('us')).sendKeys("En tant que test user Je souhaite tester l'appli");
        element(by.name('difficulty')).sendKeys('1');

        browser.sleep(3000);

        //Add the US
        element(by.name('addus')).click();

        //Click on Add US button
        element(by.name('newus')).click();
        browser.sleep(1000);

        //Fill the US form
        element(by.name('us')).sendKeys("En tant que user Je souhaite utiliser l'appli");
        element(by.name('difficulty')).sendKeys('4');
        browser.sleep(4000);

        //Add the US
        element(by.name('addus')).click();

        //Modify and delete US
        browser.sleep(3000);

        //Click on Modify US button
        element(by.name('modifyus')).click();

        browser.sleep(3000);

        element(by.name('modifydescription')).sendKeys('Description modification !!!');
        element(by.name('modifydifficulty')).sendKeys('5');

        browser.sleep(3000);

        //Click on Validate modifications button
        element(by.name('validatemodifs')).click();

        browser.sleep(3000);

        //Click on deleting button
        element(by.name('deleteus')).click();
        browser.sleep(3000);

        element(by.name('logout')).click();

    });
});
