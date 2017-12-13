import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AppConstants} from "../../../app-constants";
import {CheckAuthService} from "../../../services/check-auth.service";
import {ApiCallingObserverService} from "../../../services/api-call-observer.service";
import {Subscription} from "rxjs/Subscription";

/**
 * Logic for the project bar.
 */
@Component({
  selector: 'app-projects-bar',
  templateUrl: './projects-bar.component.html',
  styleUrls: ['./projects-bar.component.css']
})
export class ProjectsBarComponent implements OnInit, OnDestroy {

    /**
     * If true the api service for get projects has been called but not received.
     */
    private projectsLoading: boolean;

    /**
     * Project list to displayed.
     * Gotten with api service
     */
    private projectsList: Array<string>;

    /**
     * Subscription to destroy it in ngOnDestroy.
     */
    private updateListProjectSub: Subscription;

    /**
     * ProjectsBarComponent constructor.
     * @param {HttpClient} httpClient
     * @param {CheckAuthService} checkAuthService
     * @param {ApiCallingObserverService} apiCallingObserverService
     */
    public constructor(private httpClient: HttpClient,
                       private checkAuthService: CheckAuthService,
                       private apiCallingObserverService: ApiCallingObserverService) {
        this.projectsLoading = false;
        this.projectsList = [];
    }

    /**
     * get the current project list and subscribe the update projectList observable.
     */
    public ngOnInit(): void {
        this.updateProjectList();
        this.updateListProjectSub = this.apiCallingObserverService.updateListProject.subscribe(() => {
            this.updateProjectList();
        })
    }

    /**
     * Call service to get project list of current user.
     */
    private updateProjectList () {
        const userLogin = encodeURIComponent(localStorage.getItem(AppConstants.LOGIN_USER));
        this.httpClient.get(`/api/users/${userLogin}`,
            {
                responseType: 'json'
            }
        ).subscribe((response: any) => {
            this.projectsLoading = false;
            this.projectsList = response.projects || [];
            if (!localStorage.getItem(AppConstants.LOGIN_USER)) {
                localStorage.setItem(AppConstants.LOGIN_USER, response.login);
            }
        }, (error) => {
            this.projectsLoading = false;
            this.checkAuthService.check(error);
        });
    }

    /**
     * Unsubscribe for the update projectList observable.
     */
    public ngOnDestroy (): void {
        this.updateListProjectSub.unsubscribe();
        this.updateListProjectSub = null;
    }
}
