import {browser, by, element} from "protractor";

describe('Modifiying and deleting a task', function() {

    it("The task is successfully modified and deleted from the sprint", function() {

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

        element(by.name('modify_task')).click();
        browser.sleep(500);

        element(by.name('desc_modify')).sendKeys('Making exemple task to test the feature');
        element(by.name('related_modify')).sendKeys('1');
        element(by.name('jh_modify')).sendKeys('1');
        browser.sleep(500);

        element.all(by.name('progress')).each(function (eachElement, index)
        {
            eachElement.click();
            browser.driver.sleep(100);
            element(by.cssContainingText('option', 'Done')).click();
            browser.driver.sleep(100);
        });
        browser.sleep(500);

        element(by.name('apply_task_modifs')).click();
        browser.sleep(500);

        element(by.name('delete_task')).click();

        element(by.name('logout')).click();

    });
});
