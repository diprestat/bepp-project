import { Injectable } from '@angular/core';
import {AppConstants} from '../app-constants';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {CheckAuthService} from './check-auth.service';

/**
 * Check Api error response to redirect to login if authentication failed.
 */
@Injectable()
export class ProjectsManagerService {

    /**
     *  GetProjectService constructor.
     */
    public constructor (private httpClient: HttpClient,
                        private checkAuthService: CheckAuthService) {}

    /**
     * Call api GET /api/project/:name service for requested project.
     * @param {string} projectName
     */
    public get (projectName: string): Observable<any> {
        const httpParams = new HttpParams()
            .set('token', localStorage.getItem(AppConstants.ACCESS_COOKIE_NAME));

        const ret = new ReplaySubject<any>(1);

        projectName = encodeURIComponent(projectName);

        this.httpClient.get(`/api/projects/${projectName}`, {
            params: httpParams,
            responseType: 'json'
        }).subscribe((response: any) => {
            ret.next(response[0]);
        }, (error) => {
            this.checkAuthService.check(error);
            ret.next(null);
        });

        return ret.take(1);
    }
}
