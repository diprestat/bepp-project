import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-sprint',
    templateUrl: './sprint.component.html',
    styleUrls: ['./sprint.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SprintComponent implements OnInit {

    public showSelectUS: boolean;
    public showAddTask: boolean;
    public showModifyTask: boolean;
    public addTaskForm: FormGroup;

    constructor() {
        this.showSelectUS = false;
        this.showAddTask = false;
        this.showModifyTask = false;

        this.addTaskForm = new FormGroup({
            task_desc: new FormControl(''),
            task_difficulty: new FormControl(''),
            related_tasks: new FormControl('')
        });
    }

    ngOnInit() {

    }

    public toggleSelectUS() {
        this.showSelectUS = !this.showSelectUS;
    }

    public toggleAddTask() {
        this.showAddTask = !this.showAddTask;
    }

    public submitSelectUSForm() {
        this.toggleSelectUS();
    }

    public submitAddTaskForm() {
        this.toggleAddTask();
    }

    public toggleModifyTask() {
        this.showModifyTask = !this.showModifyTask;
    }

    public ModifyTask() {
        this.toggleModifyTask();
    }

}
