import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './components/app.component';
import {LoginComponent} from './components/login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {ProjectsBarComponent} from './components/dashboard/projects-bar/projects-bar.component';
import {TopBarComponent} from './components/dashboard/top-bar/top-bar.component';
import {MainContainerComponent} from './components/dashboard/main-container/main-container.component';
import {OverviewContainerComponent} from './components/dashboard/main-container/project-container/overview-container/overview-container.component';
import {BacklogContainerComponent} from './components/dashboard/main-container/project-container/backlog-container/backlog-container.component';
import {SprintsContainerComponent} from './components/dashboard/main-container/project-container/sprints-container/sprints-container.component';
import {SprintComponent} from './components/dashboard/main-container/project-container/sprints-container/sprints-list/sprint/sprint.component';
import {DropdownDirective} from "./components/directives/dropdown.directive";
import { SignupComponent } from './components/signup/signup.component';
import { NewProjectComponent } from './components/dashboard/main-container/new-project/new-project.component';
import { ProjectContainerComponent } from './components/dashboard/main-container/project-container/project-container.component';
import {AuthGuard} from './guards/auth/auth.guard';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {UnAuthGuard} from "./guards/un-auth/un-auth.guard";
import {CheckAuthService} from "./services/check-auth.service";
import {ApiCallingObserverService} from "./services/api-call-observer.service";
import {ProjectManagerService} from "./services/project-manager.service";
import {UserManagerService} from "./services/user-manager.service";
import { SprintsListComponent } from './components/dashboard/main-container/project-container/sprints-container/sprints-list/sprints-list.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent,
        ProjectsBarComponent,
        TopBarComponent,
        MainContainerComponent,
        OverviewContainerComponent,
        BacklogContainerComponent,
        SprintsContainerComponent,
        SprintComponent,
        DropdownDirective,
        SignupComponent,
        NewProjectComponent,
        ProjectContainerComponent,
        SprintsListComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [
        AuthGuard,
        UnAuthGuard,
        CheckAuthService,
        ApiCallingObserverService,
        ProjectManagerService,
        UserManagerService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
