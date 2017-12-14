import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {ProjectsManagerService} from '@app/services/projects-manager.service';
import {AppConstants} from '@app/app-constants';
import {SprintsManagerService} from '@app/services/sprints-manager.service';
import {MinDateValidator} from '@app/validators/min-date.validator';
import {BracketDateValidator} from "@app/validators/bracket-date.validator";

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
                       private projectManager: ProjectsManagerService,
                       private activatedRoute: ActivatedRoute,
                       private sprintsManager: SprintsManagerService) {

        this.showAddSprint = false;
        this.showModifySprint = false;
        this.addSprintLoading = false;

        this.currentSprintsList = [];

        this.addSprintForm = new FormGroup({
            sprint_start: new FormControl('', [Validators.required, ]),
            sprint_end: new FormControl('', [Validators.required])
        });
    }

    private getSprintList() {

        console.log ('////// GET SPRINT')
        this.sprintsManager
            .get(this.currentProject.name)
            .subscribe((sprintsList) => {

                console.log ('->>>>>>>><< RECEIVED SPRINT')

                if (sprintsList) {
                    let lastDate = null;
                    for (const sprint of sprintsList) {
                        sprint.startingDate = new Date(sprint.startingDate);
                        const endDate = new Date (sprint.startingDate.getTime() + sprint.time * 1000);
                        if (lastDate !== null) {
                            lastDate = endDate;
                        }
                        sprint.endDate = endDate;
                    }
                    this.currentSprintsList = sprintsList;

                    console.log (this.currentSprintsList)



                    if (lastDate === null) {
                        lastDate = new Date();
                    }

                    const startControl = new FormControl('', [Validators.required, MinDateValidator(lastDate)]);

                    this.addSprintForm = new FormGroup({
                        sprint_start: startControl,
                        sprint_end: new FormControl('', [Validators.required, BracketDateValidator(startControl)])
                    });
                }
            });
    }

    public ngOnInit(): void {
        const projectName = this.activatedRoute.snapshot.parent.parent.params.name;

        this.projectManager.get(projectName).subscribe((project) => {
            this.currentProject = project;
            console.log ('UPDATE THE PROJECT')
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
            ).subscribe(() => {
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
        if (this.addSprintForm) {
            this.addSprintForm.reset();
        }
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
