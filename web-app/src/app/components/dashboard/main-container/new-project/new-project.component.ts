import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AppConstants} from "../../../../app-constants";
import {CheckAuthService} from "../../../../services/check-auth.service";
import {ApiCallingObserverService} from "../../../../services/api-call-observer.service";

/**
 * Logic of page which contains form for project creation.
 */
@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {

    /**
     * FormGroup of form for project creation
     * @type {FormGroup}
     */
    private newProjectForm: FormGroup;

    /**
     * To true if api service for creation has been called and response is not received.
     * @type {boolean}
     */
    private newProjectLoading: boolean;

    /**
     * True if project has been submit at least one time.
     */
    private newProjectSubmitted: boolean;

    /**
     * Error message to show to the user.
     */
    private newProjectMessage: string;

    /**
     * NewProjectComponent constructor.
     * @param {HttpClient} httpClient
     * @param {CheckAuthService} checkAuthService
     * @param {Router} router
     * @param {ApiCallingObserverService} apiCallingObserverService
     */
    public constructor(private httpClient: HttpClient,
                       private checkAuthService: CheckAuthService,
                       private router: Router,
                       private apiCallingObserverService: ApiCallingObserverService) { }

    /**
     * Initialize newProjectForm variable.
     * The FormGroup
     */
    public ngOnInit(): void {
        this.newProjectSubmitted = false;
        this.newProjectLoading = false;
        this.newProjectMessage = null;

        this.newProjectForm = new FormGroup({
            'name': new FormControl('', [Validators.required]),
            'date': new FormControl(''),
            'nbSprints': new FormControl(''),
            'nbDurationSprint': new FormControl(''),
            'description': new FormControl('')
        })
    }

    /**
     * Return FormControl named "name"
     * @return {AbstractControl}
     */
    public get name (): AbstractControl {
        return this.newProjectForm.get ('name');
    }

    /**
     * If FormGroup is valid and not called yet, we call api service to create project.
     */
    public newProjectSubmit () {
        this.newProjectSubmitted = true;
        if (this.newProjectForm.valid && !this.newProjectLoading) {
            this.newProjectLoading = true;

            // join token to parameters
            const body = Object.assign ({},
                this.newProjectForm.value,
                {
                    token: localStorage.getItem(AppConstants.ACCESS_COOKIE_NAME)
                });

            this.httpClient.post("/api/projects",
                body, {
                    responseType: 'json'
                }
            ).subscribe((response: any) => {
                this.newProjectLoading = false;

                this.apiCallingObserverService.updateListProject.next(true);
                this.router.navigate(['dashboard/projects', this.newProjectForm.value.name])
            }, (error) => {
                this.newProjectLoading = false;

                this.checkAuthService.check(error);

                if (error.status !== 401) {
                    this.newProjectMessage = `Une erreur inconnue s'est produite, veuillez réessayer plutard`;
                }
            });
        }
    }
}
