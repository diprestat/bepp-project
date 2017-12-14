import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {SprintsManagerService} from '@app/services/sprints-manager.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectsManagerService} from '@app/services/projects-manager.service';

@Component({
    selector: 'bepp-sprint',
    templateUrl: './sprint.component.html',
    styleUrls: ['./sprint.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SprintComponent implements OnInit {

    private projectName: string;

    public currentSprint: { [x: string]: any};

    public unselectedUS: Array<any>;

    public showSelectUS: boolean;
    public showAddTask: boolean;
    public showModifyTask: boolean;
    public addTaskForm: FormGroup;

    public constructor(private sprintsManager: SprintsManagerService,
                       private activatedRoute: ActivatedRoute,
                       private router: Router,
                       private projectManager: ProjectsManagerService) {
        this.showSelectUS = false;
        this.showAddTask = false;
        this.showModifyTask = false;

        this.unselectedUS = [];

        this.addTaskForm = new FormGroup({
            task_desc: new FormControl(''),
            task_difficulty: new FormControl(''),
            related_tasks: new FormControl('')
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
        // TODO MAJ LIST
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
