describe('Adding a userstory to the mini Backlog of a sprint', function() {

    it("The userstory is successfully added to the mini Backlog", function() {

        browser.get('http://localhost:8080/');

        //Fill the email and password fields and submit
        element(by.name('email')).sendKeys('test@bepp.fr');
        element(by.name('password')).sendKeys('123');

        element(by.name('login')).click();
        browser.sleep(5000);

        element(by.name('ProjetTest')).click();

        //Go to sprints menu
        element(by.name('sprints')).click();
        browser.sleep(1000);

        //Go to sprints menu
        element(by.name('goto')).click();
        browser.sleep(1000);

        element(by.name('newus')).click();
        browser.sleep(1000);

        element(by.css('.td input')).click();
        browser.sleep(5000);

        element(by.name('addus')).click();
        browser.sleep(1000);

        //Click to logout
        element(by.name('logout')).click();

    });
});

