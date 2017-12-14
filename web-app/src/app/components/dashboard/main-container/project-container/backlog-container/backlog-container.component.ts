import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProjectsManagerService} from "../../../../../services/projects-manager.service";
import {ActivatedRoute} from "@angular/router";
import {UserManagerService} from "../../../../../services/user-manager.service";
import {AuthGuard} from "../../../../../guards/auth/auth.guard";
import {AppConstants} from "../../../../../app-constants";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CheckAuthService} from "../../../../../services/check-auth.service";

@Component({
  selector: 'app-backlog-container',
  templateUrl: './backlog-container.component.html',
  styleUrls: ['./backlog-container.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BacklogContainerComponent implements OnInit {

    /**
     * If true, the form for adding a US is shown.
     * @type {boolean}
     */
    private showAddUS: boolean;

    /**
     * If true, the form for adding a US is shown.
     * @type {boolean}
     */
    private showModifyUS: boolean;

    /**
     * FormGroup for add member form
     */
    private addUSForm: FormGroup;

    private userIsPO: boolean;

    private currentProject;
    private currentUser;

    private addUsLoading: boolean;
    private addUsSubmitted: boolean;

    private modifyUsForm: FormGroup;
    private modifyUsLoading: boolean;
    private modifyUsSubmitted: boolean;

    private shownModifyDescription: string|null;

    private deleteUsLoading: boolean;

    private nbReceivedServices: number;


    /**
     * Boolean to True when the GET project of api has been received.
     * else false.
     * @type {boolean}
     */
    public backlogLoading: boolean;

    public constructor(private projectManagerService: ProjectsManagerService,
                       private activatedRoute: ActivatedRoute,
                       private userManagerProject: UserManagerService,
                       private httpClient: HttpClient,
                       private checkAuthService: CheckAuthService) {
        this.showAddUS = false;
        this.showModifyUS = false;

        this.backlogLoading = false;
        this.currentProject = null;
        this.nbReceivedServices = 0;
        this.currentUser = null;

        this.userIsPO = false;
        this.addUsLoading = false;
        this.addUsSubmitted = false;
        this.shownModifyDescription = null;

        this.modifyUsSubmitted = false;
        this.modifyUsLoading = false;

        this.deleteUsLoading = false;
    }

    private getProject (name: string) {
        this.projectManagerService.get(name).subscribe ((project) => {
            this.currentProject = project;
            if (!this.currentProject.userStories) {
                this.currentProject.userStories = [];
            }
            this.checkUserIsPO();
            this.createFormGroup();
            this.increaseNbReceivedServices();
        }, () => {
            this.increaseNbReceivedServices();
        });
    }

    private createFormGroup () {
        if (this.currentUser && this.currentProject) {
            const descriptionValidators = this.userIsPO ?
                [] :
                [Validators.required];

            const difficultyValidators = this.userIsPO ?
                [] :
                [Validators.required];

            const priorityValidators = this.userIsPO ?
                [Validators.required] :
                [];

            this.addUSForm = new FormGroup ({
                us: new FormControl('', descriptionValidators),
                priority: new FormControl('', priorityValidators),
                difficulty: new FormControl('', difficultyValidators)
            });

            this.modifyUsForm = new FormGroup ({
                us: new FormControl('', descriptionValidators),
                priority: new FormControl('', priorityValidators),
                difficulty: new FormControl('', difficultyValidators)
            });
        }
    }

    private getUser () {
        this.userManagerProject.get().subscribe((user) => {
            this.currentUser = user;
            this.checkUserIsPO();
            this.createFormGroup();
            this.increaseNbReceivedServices();
        }, () => {
            this.increaseNbReceivedServices();
        });
    }

    private increaseNbReceivedServices () {
        this.nbReceivedServices++;
        this.backlogLoading = (this.nbReceivedServices < 2);
    }

    private checkUserIsPO (): void {
        if (!!this.currentUser && !!this.currentProject) {
            const userArray = this.currentProject.users;
            let index = 0;
            while (index < userArray.length &&
                   this.currentUser.login !== userArray[index].login) {
                index++;
            }

            this.userIsPO = !!this.currentUser &&
                            !!userArray[index] &&
                            (this.currentUser.login === userArray[index].login) &&
                            userArray[index].role === 'Product Owner';
        }
    }

    /**
     * Return Us object in the project with the given name
     * @param {string} description
     */
    private getUs (description: string) {
        if (!this.currentProject) {
            throw new Error (`Le projet courant n'est pas défini.`)
        }

        let indexUs = 0;
        let indexFoundUs = -1;
        while (indexUs < this.currentProject.userStories.length &&
               indexFoundUs === -1) {

            if (this.currentProject.userStories[indexUs].description === description) {
                indexFoundUs = indexUs;
            }
            indexUs++;
        }

        if (indexFoundUs === -1) {
            throw new Error (`Us not found.`)
        }

        return this.currentProject.userStories[indexFoundUs];
    }

    public ngOnInit(): void {
        this.backlogLoading = true;

        // Get the project
        const currentParams = this.activatedRoute.snapshot.parent.params;
        this.getProject(currentParams['name']);
        this.getUser();
    }

    public toggleAddUS(): void {
        this.showAddUS = !this.showAddUS;
    }

    public toggleModifyUS(description?: string): void {

        this.shownModifyDescription = (this.showModifyUS) ?
            null :
            description;

        // if the opening requested
        if (!this.showModifyUS) {
            const us = this.getUs(description);

            this.modifyUsForm.patchValue({
                us: us.description,
                priority: us.priority,
                difficulty: us.difficulty
            });
        }

        this.showModifyUS = !this.showModifyUS;
    }

    public submitAddUSForm () {
        this.addUsSubmitted = true;
        if (this.addUSForm.valid && !this.addUsLoading) {
            this.addUsLoading = true;

            // remove priority if not filled
            const body = Object.assign ({},
                this.addUSForm.value,
                {
                    token: localStorage.getItem(AppConstants.ACCESS_COOKIE_NAME)
                });

            if (!body.priority) {
                delete body.priority;
            }

            body.description = body.us;

            const projectName = encodeURIComponent(this.currentProject.name);
            this.httpClient.put(`/api/userStories/projects/${projectName}`,
                body, {
                    responseType: 'json'
                }
            ).subscribe(() => {
                this.addUsLoading = false;
                const currentParams = this.activatedRoute.snapshot.parent.params;
                this.getProject(currentParams['name']);
                this.toggleAddUS();
                this.addUSForm.reset();
            }, (error) => {
                this.addUsLoading = false;
                this.checkAuthService.check(error);

                /* TODO Gestion d'erreur
                if (error.status !== 401) {
                    this.addUsMessage = `Une erreur inconnue s'est produite, veuillez réessayer plutard`;
                }*/
            });
        }
    }
    public submitModifyUSForm () {
        this.modifyUsSubmitted = true;
        if (this.modifyUsForm.valid && !this.modifyUsLoading) {
            this.modifyUsLoading = true;

            // remove priority if not filled
            const body = Object.assign ({},
                this.modifyUsForm.value,
                {
                    token: localStorage.getItem(AppConstants.ACCESS_COOKIE_NAME)
                });

            const projectName = encodeURIComponent(this.currentProject.name);
            const oldDescription = encodeURIComponent(this.shownModifyDescription);

            let service = `/api/userStories/${oldDescription}/projects/${projectName}`;
            if (this.userIsPO) {
                service += `/user/${encodeURIComponent('Product Owner')}`;
            }
            else {
                if (!body.priority) {
                    delete body.priority;
                }

                body.description = body.us;
            }

            delete body.us;

            this.httpClient.patch(service,
                body, {
                    responseType: 'json'
                }
            ).subscribe(() => {
                this.modifyUsLoading = false;
                const currentParams = this.activatedRoute.snapshot.parent.params;
                this.getProject(currentParams['name']);
                this.toggleModifyUS();
            }, (error) => {
                this.modifyUsLoading = false;
                this.checkAuthService.check(error);

                /* TODO Gestion d'erreur
                if (error.status !== 401) {
                    this.addUsMessage = `Une erreur inconnue s'est produite, veuillez réessayer plutard`;
                }*/
            });
        }
    }
    public deleteUS (description: string) {
        if (!this.deleteUsLoading) {
            this.deleteUsLoading = true;

            // remove priority if not filled
            const params = new HttpParams()
                    .set('token', localStorage.getItem(AppConstants.ACCESS_COOKIE_NAME))

            const projectName = encodeURIComponent(this.currentProject.name);
            const encodeDescription = encodeURIComponent(description);
            this.httpClient.delete(`/api/userStories/${encodeDescription}/projects/${projectName}`,
                {
                    responseType: 'json',
                    params: params
                }
            ).subscribe(() => {
                this.deleteUsLoading = false;
                const currentParams = this.activatedRoute.snapshot.parent.params;
                this.getProject(currentParams['name']);
            }, (error) => {
                this.deleteUsLoading = false;
                this.checkAuthService.check(error);

                /* TODO Gestion d'erreur
                if (error.status !== 401) {
                    this.addUsMessage = `Une erreur inconnue s'est produite, veuillez réessayer plutard`;
                }*/
            });
        }
    }

    public cancelModifyUS (description: string) {
        this.toggleModifyUS(description);
    }

    public get descriptionUs () {
        return this.addUSForm.get('us');
    }

    public get priority () {
        return this.addUSForm.get('priority');
    }

    public get difficulty () {
        return this.addUSForm.get('difficulty');
    }


}
