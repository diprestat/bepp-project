describe('Adding US to Sprint', function() {

    it('works', function() {

        browser.wait(function () {
            return element(by.name('sprints')).isPresent();
        }, 5000);

        //Choose the project backlog
        element(by.name('sprints')).click();

        browser.sleep(3000);

        //Go to sprints menu
        element(by.name('goto')).click();
        browser.sleep(3000);

        element(by.name('newus')).click();
        browser.sleep(3000);

        element(by.tagName('input')).click();
        browser.sleep(3000);

        element(by.name('addus')).click();

        browser.sleep(4000);

        element(by.name('cancel_add')).click();

    });
});

