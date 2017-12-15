describe('niuhouihoiuh', function() {

    it('oijnjknb;kbju', function() {

        //Fill the email and password fields and submit
        element(by.name('email')).sendKeys('developer@bepp.fr');
        element(by.name('password')).sendKeys('123');

        browser.sleep(3000);

        element(by.name('login')).click();

        browser.sleep(3000);

        browser.wait(function () {
            return element(by.name('Projet Demo')).isPresent();
        }, 5000);

        //Choose the ProjectTest project
        element(by.name('Projet Demo')).click();

        browser.sleep(3000);

        browser.wait(function () {
            return element(by.name('sprints')).isPresent();
        }, 5000);

        browser.sleep(3000);

        //Choose the project backlog
        element(by.name('sprints')).click();

        browser.sleep(3000);

        element(by.name('newsprint')).click();

        browser.sleep(3000);

        element(by.name('start_date')).sendKeys('16/12/2017');
        element(by.name('end_date')).sendKeys('22/12/2017');

        browser.sleep(4000);

        //Choose the project backlog
        element(by.name('addsprint')).click();
        browser.sleep(2000);

        element(by.name('newsprint')).click();

        browser.sleep(3000);

        element(by.name('start_date')).sendKeys('23/12/2017');
        element(by.name('end_date')).sendKeys('05/01/2018');

        browser.sleep(4000);

        //Choose the project backlog
        element(by.name('addsprint')).click();
        browser.sleep(2000);

    });
});

