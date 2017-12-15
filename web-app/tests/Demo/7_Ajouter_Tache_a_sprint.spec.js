describe('Adding a task to a sprint', function() {

    it('Works', function() {

        element(by.name('newtask')).click();
        browser.sleep(3000);

        element(by.name('task_desc')).sendKeys('Making exemple task to test the feature');
        element(by.name('task_difficulty')).sendKeys('1');
        element(by.name('related_tasks')).sendKeys('1');
        element(by.name('jh')).sendKeys('2');

        browser.sleep(3000);

        element(by.name('addtask')).click();

        browser.sleep(5000);

        element(by.name('delete_task')).click();

        browser.sleep(5000);

        element(by.name('logout')).click();

    });
});

