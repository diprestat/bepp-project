import {browser, by, element} from "protractor";

describe('Adding a task to the Sprint', function() {

    it("The task is successfully added to the sprint", function() {

        browser.get('http://localhost:8080/');

        //Fill the email and password fields and submit
        element(by.name('email')).sendKeys('test@bepp.fr');
        element(by.name('password')).sendKeys('123');

        element(by.name('login')).click();

        element(by.name('ProjetTest')).click();

        //Go to sprints menu
        element(by.name('sprints')).click();
        browser.sleep(500);

        element(by.name('goto')).click();
        browser.sleep(500);

        element(by.name('newtask')).click();
        browser.sleep(500);

        element(by.name('task_desc')).sendKeys('Making exemple task to test the feature');
        element(by.name('task_difficulty')).sendKeys('1');
        element(by.name('related_tasks')).sendKeys('1');
        element(by.name('jh')).sendKeys('2');

        element(by.name('addtask')).click();
        
        element(by.name('logout')).click();

    });
});
