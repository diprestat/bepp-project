import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {ControlEqualValidator} from "../../validators/control-equal.validator";
import {HttpClient} from "@angular/common/http";
import {AppConstants} from "../../app-constants";

/**
 * Logic for the signup page.
 */
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    /**
     * FormGroup for the signup.
     */
    private signupForm: FormGroup;

    /**
     * True if the form has been submitted at least one.
     */
    private signupSubmitted: boolean;

    /**
     * True if the form has been submitted but response not received.
     */
    private signupLoading: boolean;

    /**
     * Signup error to display.
     */
    private signupError: string;

    /**
     * SignupComponent constructor.
     * @param {Router} router
     * @param {HttpClient} httpClient
     */
    public constructor(private router: Router,
                       private httpClient: HttpClient) { }

    /**
     * Initialize variable for signup form.
     */
    public ngOnInit(): void {
        this.signupSubmitted = false;
        this.signupLoading = false;
        this.signupError = null;

        const passwordFormControl = new FormControl('', [Validators.required]);

        this.signupForm = new FormGroup ({
            name: new FormControl('', [Validators.required]),
            surname: new FormControl('', [Validators.required]),
            login: new FormControl('', [Validators.required]),
            password: passwordFormControl,
            confirmPassword: new FormControl('', [Validators.required, ControlEqualValidator(passwordFormControl)])
        });

        // if password updated, check validity for the confirm password.
        this.password.valueChanges.subscribe(() => {
            this.confirmPassword.updateValueAndValidity();
        });
    }

    public get name(): AbstractControl {
        return this.signupForm.get('name');
    }

    public get surname(): AbstractControl {
        return this.signupForm.get('surname');
    }

    public get login(): AbstractControl {
        return this.signupForm.get('login');
    }

    public get password(): AbstractControl {
        return this.signupForm.get('password');
    }

    public get confirmPassword(): AbstractControl {
        return this.signupForm.get('confirmPassword');
    }

    /**
     * Submit the signup form, if response is a success, we call the authentication service.
     */
    public submitSignUpForm () {
        this.signupSubmitted = true;

        if (this.signupForm.valid && !this.signupLoading) {
            this.signupLoading = true;
            this.httpClient.post("/api/users",
                this.signupForm.value,{
                    responseType: 'json'
                }
            ).subscribe((response: any) => {
                this.httpClient.post("/api/users/token",
                    {
                        login: this.signupForm.value.login,
                        password: this.signupForm.value.password
                    },
                    {
                        responseType: 'json'
                    }
                ).subscribe((response: any) => {
                    this.signupLoading = false;
                    localStorage.setItem(AppConstants.ACCESS_COOKIE_NAME, response['token']);
                    localStorage.setItem(AppConstants.LOGIN_USER, this.signupForm.value.login);
                    this.router.navigate(['/dashboard']);
                }, () => {
                    this.signupLoading = false;
                    this.signupError = "Une erreur s'est produite lors de l'authentification, veuillez réessayer plutard.";
                });
            }, (error: any) => {
                this.signupLoading = false;

                if (error.status === 409) {
                    this.signupError = `L'adresse email entrée existe déjà dans la base.`;
                }
                else {
                    this.signupError = `Une erreur s'est produite lors de l'authentification, veuillez réessayer plutard.`;
                }
            });
        }
    }
}
