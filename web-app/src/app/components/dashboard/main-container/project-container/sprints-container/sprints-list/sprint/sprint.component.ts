import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {SprintsManagerService} from '@app/services/sprints-manager.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectsManagerService} from '@app/services/projects-manager.service';
import {AppConstants} from "@app/app-constants";
import {Subject} from "rxjs/Subject";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'bepp-sprint',
    templateUrl: './sprint.component.html',
    styleUrls: ['./sprint.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SprintComponent implements OnInit {

    private projectName: string;

    private usToAdd: string[];

    public currentSprint: { [x: string]: any};

    public unselectedUS: Array<any>;

    public showSelectUS: boolean;
    public showAddTask: boolean;
    public showModifyTask: boolean;
    public addTaskForm: FormGroup;

    public selectUSLoading: boolean;

    public constructor(private sprintsManager: SprintsManagerService,
                       private activatedRoute: ActivatedRoute,
                       private router: Router,
                       private projectManager: ProjectsManagerService,
                       private httpClient: HttpClient) {
        this.showSelectUS = false;
        this.showAddTask = false;
        this.showModifyTask = false;

        this.selectUSLoading = false;

        this.unselectedUS = [];
        this.usToAdd = [];

        this.addTaskForm = new FormGroup({
            task_desc: new FormControl(''),
            task_difficulty: new FormControl(''),
            related_tasks: new FormControl(''),
            jh: new FormControl('')
        });
    }

    private getSprintList(sprintNumber) {
        this.sprintsManager
            .get(this.projectName)
            .subscribe((sprints) => {
                this.currentSprint = null;
                if (sprints) {
                    let sprintIndex = 0;
                    while (this.currentSprint === null && sprintIndex < sprints.length) {
                        if (sprints[sprintIndex].number === sprintNumber) {
                            this.currentSprint = sprints[sprintIndex];
                        }
                        sprintIndex++;
                    }
                }

                if (!this.currentSprint) {
                    this.router.navigate([
                        `dashboard/projects/${encodeURIComponent(this.projectName)}/sprints`
                    ]);
                }
                else {
                    const startingDate = new Date(this.currentSprint.startingDate);
                    const time = this.currentSprint.time;

                    this.currentSprint.startingDate = startingDate;
                    this.currentSprint.endDate = new Date(startingDate.getTime() + time * 1000);
                }
            });
    }

    private getUnselectedUSProject () {
        this.projectManager.get(this.projectName).subscribe ((project) => {
            this.unselectedUS = project.userStories;
        }, () => {
            //this.overviewLoading = false;
        });
    }

    public ngOnInit(): void {
        this.projectName = this.activatedRoute.snapshot.parent.parent.params.name;
        this.getSprintList(this.activatedRoute.snapshot.params.sprintNumber);
        this.getUnselectedUSProject();
    }

    public toggleSelectUS() {
        this.showSelectUS = !this.showSelectUS;
    }

    public toggleAddTask() {
        this.showAddTask = !this.showAddTask;
    }

    public submitSelectUSForm() {
        if (!this.selectUSLoading && this.usToAdd.length > 0) {
            const usAdded = new Subject<boolean>();

            const usToAddCopy = this.usToAdd;

            usAdded.subscribe((result) => {
                console.log (usToAddCopy)
                if (usToAddCopy.length === 0  || !result) {
                    this.usToAdd = [];
                    this.toggleSelectUS();
                    this.getUnselectedUSProject();
                    this.getSprintList(this.activatedRoute.snapshot.params.sprintNumber);
                    this.selectUSLoading = false;
                }
            });

            for (const usDescription of this.usToAdd) {
                this.httpClient.put(
                    `/api/sprints/${this.currentSprint.number}/projects/${this.projectName}/userStories`, {
                        description: usDescription,
                        token: localStorage.getItem(AppConstants.ACCESS_COOKIE_NAME)
                    }
                ).subscribe(() => {
                    console.log (usDescription)
                    const index = usToAddCopy.indexOf(usDescription);
                    usToAddCopy.splice(index, 1);
                    usAdded.next(true);
                }, () => {
                    usAdded.next(false);
                });
            }
            this.toggleSelectUS();
        }
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

    public addUsToSprint (descriptionToAdd: string) {
        const index = this.usToAdd.indexOf(descriptionToAdd);
        if (index > -1) {
            this.usToAdd.slice(index, 1);
        }
        else {
            this.usToAdd.push(descriptionToAdd);
        }
    }

}
