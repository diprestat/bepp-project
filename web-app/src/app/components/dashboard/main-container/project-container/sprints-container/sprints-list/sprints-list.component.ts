import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ProjectManagerService} from "../../../../../../services/project-manager.service";
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from "@angular/router";
import {AppConstants} from "../../../../../../app-constants";

@Component({
    selector: 'bepp-sprints-list',
    templateUrl: './sprints-list.component.html',
    styleUrls: ['./sprints-list.component.css']
})
export class SprintsListComponent implements OnInit {

    private currentProject;

    public showAddSprint: boolean;
    public showModifySprint: boolean;
    public addSprintForm: FormGroup;
    public addSprintSubmitted: boolean;
    public addSprintLoading: boolean;


    public constructor(private httpClient: HttpClient,
                       private projectManager: ProjectManagerService,
                       private activatedRoute: ActivatedRoute) {

        this.showAddSprint = false;
        this.showModifySprint = false;
        this.addSprintLoading = false;

        this.addSprintForm = new FormGroup({
            sprint_start: new FormControl('', [Validators.required]),
            sprint_end: new FormControl('', [Validators.required])
        });
    }

    public ngOnInit(): void {
        const projectName = this.activatedRoute.snapshot.parent.parent.params.name;

        this.projectManager.get(projectName).subscribe((project) => {
            this.currentProject = project;
        });
    }

    public submitAddSprintForm() {
        this.addSprintSubmitted = true;
        if (this.addSprintForm.valid && !this.addSprintLoading) {
            this.addSprintLoading = true;
            const startingDate = new Date (this.addSprintForm.value.sprint_start);
            const endDate = new Date (this.addSprintForm.value.sprint_end);

            this.httpClient.put(
                `/api/sprints/projects/${encodeURIComponent(this.currentProject.name)}`, {

                    startingDate: startingDate.toISOString(),
                    time: ((endDate.getTime() - startingDate.getTime()) / 1000),
                    token: localStorage.getItem(AppConstants.ACCESS_COOKIE_NAME)
                }
            ).subscribe((response) => {
                // TODO Maj list

                this.toggleAddSprint();
                this.addSprintLoading = false;
            }, () => {
                this.addSprintLoading = false;
                // TODO handle errors
            });

        }
    }

    public toggleAddSprint() {
        this.addSprintSubmitted = false;
        this.addSprintForm.reset();
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

    public get sprint_start(): AbstractControl {
        return this.addSprintForm.get('sprint_start');
    }

    public get sprint_end(): AbstractControl {
        return this.addSprintForm.get('sprint_end');
    }
}
