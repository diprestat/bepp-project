import {Component, OnInit} from '@angular/core';
import {AppConstants} from "../../../../../app-constants";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {CheckAuthService} from "../../../../../services/check-auth.service";
import "rxjs/add/operator/take";
import {ProjectManagerService} from "../../../../../services/project-manager.service";

/**
 * Logic for the overview page of one project.
 */
@Component({
    templateUrl: './overview-container.component.html',
    styleUrls: ['./overview-container.component.css']
})
export class OverviewContainerComponent implements OnInit {

    /**
     * If true, the form for adding member is shown.
     * @type {boolean}
     */
    private showAddMember: boolean;

    /**
     * True if the GET project has been called but not received.
     * @type {boolean}
     */
    private overviewLoading: boolean;

    /**
     * Received data from api, project to display.
     */
    private currentProject: any;

    /**
     * FormGroup for add member form
     */
    private addMemberForm: FormGroup;

    /**
     * True if adding member has been submit at least one time.
     */
    private addMemberFormSubmitted: boolean;

    /**
     * True if adding member has been submit, and response not received.
     */
    private addMemberFormLoading: boolean;

    /**
     * Error to show for add memeber form.
     */
    private errorMessageAddMember: string;

    /**
     * Option of select for role (add member form)
     * @type {{id: number, name: string}[]}
     */
    private availabledRole = [
        {id: 0, name: "Développeur"},
        {id: 1, name: "Product Owner"}
    ];

    /**
     * OverviewContainerComponent constructor.
     * @param {HttpClient} httpClient
     * @param {ActivatedRoute} activatedRoute
     * @param {CheckAuthService} checkAuthService
     * @param {ProjectManagerService} projectManagerService
     */
    public constructor(private httpClient: HttpClient,
                       private activatedRoute: ActivatedRoute,
                       private checkAuthService: CheckAuthService,
                       private projectManagerService: ProjectManagerService) {
        this.overviewLoading = true;
        this.errorMessageAddMember = null;
        this.showAddMember = false;
    }

    /**
     * Initialize form variable and GroupForm.
     * subscribe for route parameters to.
     */
    public ngOnInit(): void {
        this.overviewLoading = true;

        this.addMemberFormSubmitted = false;
        this.addMemberFormLoading = false;

        this.addMemberForm = new FormGroup ({
            login: new FormControl('', [Validators.required]),
            role: new FormControl('', [Validators.required])
        });

        this.addMemberForm.setValue({
            login: null,
            role: 0
        });

        // Get the project
        const currentParams = this.activatedRoute.snapshot.parent.params;
        this.getProject(currentParams['name']);
    }

    private getProject (name: string) {
        this.projectManagerService.get(name).subscribe ((project) => {
            this.overviewLoading = false;
            this.currentProject = project;
        }, () => {
            this.overviewLoading = false;
        })
    }

    /**
     * Toggle addMember form
     */
    public toggleAddMember(): void {
        this.showAddMember = !this.showAddMember;
    }

    /**
     * Submit the form adding if filled values are valid.
     */
    public submitAddMemberForm(): void {
        this.addMemberFormSubmitted = true;

        if (this.addMemberForm.valid && !this.addMemberFormLoading){
            this.addMemberFormLoading = true;

            const sendingParams = Object.assign({},
                this.addMemberForm.value,
                {
                    token: localStorage.getItem(AppConstants.ACCESS_COOKIE_NAME)
                });

            sendingParams.role = this.availabledRole[sendingParams.role].name;

            const userLogin = encodeURIComponent(this.addMemberForm.value.login);
            const projectName = encodeURIComponent(this.currentProject.name);
            this.httpClient.put(`/api/projects/${projectName}/users/${userLogin}`,
                sendingParams,{
                    responseType: 'json'
                }
            ).subscribe((response: any) => {
                this.addMemberForm.reset();

                this.addMemberFormLoading = false;
                this.getProject (this.currentProject.name);
                this.errorMessageAddMember = null;
                this.login.setValue(null);
                this.addMemberFormSubmitted = false;

                this.toggleAddMember();

            }, (error) => {
                this.addMemberFormLoading = false;

                if (error.status === 404){
                    this.errorMessageAddMember = `Aucun utilisateur trouvé`;
                }

                this.checkAuthService.check(error);
            });
        }
    }

    /**
     * Return FormControl login.
     * @return {AbstractControl}
     */
    public get login (): AbstractControl {
        return this.addMemberForm.get('login');
    }
}
