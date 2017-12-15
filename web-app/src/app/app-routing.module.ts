import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {
    OverviewContainerComponent
} from './components/dashboard/main-container/project-container/overview-container/overview-container.component';
import {
    BacklogContainerComponent
} from './components/dashboard/main-container/project-container/backlog-container/backlog-container.component';
import {
    SprintsContainerComponent
} from './components/dashboard/main-container/project-container/sprints-container/sprints-container.component';
import {SignupComponent} from './components/signup/signup.component';
import {NewProjectComponent} from './components/dashboard/main-container/new-project/new-project.component';
import {ProjectContainerComponent} from './components/dashboard/main-container/project-container/project-container.component';
import {AuthGuard} from './guards/auth/auth.guard';
import {UnAuthGuard} from './guards/un-auth/un-auth.guard';
import {
    SprintsListComponent
} from './components/dashboard/main-container/project-container/sprints-container/sprints-list/sprints-list.component';
import {
    SprintComponent
} from './components/dashboard/main-container/project-container/sprints-container/sprints-list/sprint/sprint.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [UnAuthGuard]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'newproject', pathMatch: 'full' },
            {
                path: 'projects/:name',
                component: ProjectContainerComponent,
                children: [
                    { path: '', redirectTo: 'overview', pathMatch: 'full' },
                    { path: 'overview', component: OverviewContainerComponent },
                    { path: 'backlog', component: BacklogContainerComponent },
                    {
                        path: 'sprints',
                        component: SprintsContainerComponent,
                        children: [
                            { path: '', component: SprintsListComponent },
                            { path: ':sprintNumber', component: SprintComponent }
                        ]}
                ]
            },
            { path: 'newproject', component: NewProjectComponent }

    ]},

    {
        path: 'signup',
        component: SignupComponent,
        canActivate: [UnAuthGuard]
    },

    // Default
    { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { useHash: true })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
