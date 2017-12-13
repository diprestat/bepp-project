import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {ProjectManagerService} from '@app/services/project-manager.service';
import {AppConstants} from '@app/app-constants';

@Component({
    selector: 'bepp-sprints-list',
    templateUrl: './sprints-list.component.html',
    styleUrls: ['./sprints-list.component.css']
})
export class SprintsListComponent implements OnInit {

    private currentProject;

    public currentSprintsList;

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

        this.currentSprintsList = [];

        this.addSprintForm = new FormGroup({
            sprint_start: new FormControl('', [Validators.required]),
            sprint_end: new FormControl('', [Validators.required])
        });
    }

    private getSprintList() {
        this.httpClient.get(
            `/api/projects/${encodeURIComponent(this.currentProject.name)}/sprints`, {
                params: (new HttpParams()).set('token', localStorage.getItem(AppConstants.ACCESS_COOKIE_NAME))
            }).subscribe((response) => {
            this.currentSprintsList = response;

            for (const sprint of this.currentSprintsList) {
                sprint.startingDate = new Date(sprint.startingDate);
                sprint.endDate = new Date (sprint.startingDate.getTime() + sprint.time * 1000);
            }
        }, () => {

        });
    }

    public ngOnInit(): void {
        const projectName = this.activatedRoute.snapshot.parent.parent.params.name;

        this.projectManager.get(projectName).subscribe((project) => {
            this.currentProject = project;
            this.getSprintList();
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
                this.getSprintList ();
                this.toggleAddSprint();
                this.addSprintLoading = false;
            }, () => {
                this.addSprintLoading = false;
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
