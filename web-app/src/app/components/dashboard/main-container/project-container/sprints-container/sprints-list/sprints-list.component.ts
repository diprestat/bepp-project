import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-sprints-list',
    templateUrl: './sprints-list.component.html',
    styleUrls: ['./sprints-list.component.css']
})
export class SprintsListComponent implements OnInit {

    public showAddSprint: boolean;
    public showModifySprint: boolean;
    public addSprintForm: FormGroup;
    public addSprintSubmitted: boolean;

    constructor() {

        this.showAddSprint = false;
        this.showModifySprint = false;

        this.addSprintForm = new FormGroup({
            sprint_start: new FormControl(''),
            sprint_end: new FormControl('')
        });
    }

    ngOnInit() {

    }

    public submitAddSprintForm() {
        this.toggleAddSprint();
    }

    public toggleAddSprint() {
        this.showAddSprint = !this.showAddSprint;
    }

    public toggleModifySprint() {
        this.showModifySprint = !this.showModifySprint;
    }

    public ModifySprint() {
        this.toggleModifySprint();
    }

    public cancelModifySprint() {
        this.toggleModifySprint();
    }
}
