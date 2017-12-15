import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {AppConstants} from "../../app-constants";

/**
 * Define logic of the login page of the application.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

    /**
     * FormGroup for the login form.
     */
    public loginForm: FormGroup;

    /**
     * If true, show loading spinner on the login submit button.
     */
    public loginLoading: boolean;

    /**
     * True if the form has been submitted at least one.
     */
    public loginSubmitted: boolean;

    /**
     * If true error for run again the login.
     */
    public loginError: boolean;

    /**
     * LoginComponent constructor.
     * @param {Router} router
     * @param {HttpClient} httpClient
     */
    public constructor(private router: Router,
                       private httpClient: HttpClient) { }

    /**
     * Initialize FormGroup for login form.
     */
    public ngOnInit(): void {
        this.loginLoading = false;
        this.loginSubmitted = false;
        this.loginError = false;
        this.loginForm = new FormGroup({
            login: new FormControl('', [ Validators.required ]),
            password: new FormControl('', [ Validators.required ])
        });
    }

    /**
     * Submit the login form.
     */
    public submitLoginForm(): void {
        this.loginSubmitted = true;

        if (this.loginForm.valid && !this.loginLoading){
            this.loginLoading = true;
            this.httpClient.post("/api/users/token",
                this.loginForm.value,{
                    responseType: 'json'
                }
            ).subscribe((response: any) => {
                this.loginLoading = false;
                localStorage.setItem(AppConstants.ACCESS_COOKIE_NAME, response['token']);
                localStorage.setItem(AppConstants.LOGIN_USER, this.loginForm.value.login);
                this.router.navigate(['/dashboard']);
            }, () => {
                this.loginLoading = false;
                this.loginError = true;
            });
        }
    }

    /**
     * Getter for the login FormControl.
     * @return {AbstractControl}
     */
    public get login (): AbstractControl { return this.loginForm.get('login'); }

    /**
     * Getter for the password FormControl.
     * @return {AbstractControl}
     */
    public get password (): AbstractControl { return this.loginForm.get('password'); }
}
