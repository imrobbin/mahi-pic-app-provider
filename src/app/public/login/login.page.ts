import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, AlertController, MenuController } from '@ionic/angular';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { LoginOptions, SignUpOptions } from '../../interfaces/model.interface';
import { LoadingService } from '../../services/loading.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { StorageConst } from '../../config/storage-constants';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    @ViewChild(IonSlides, { static: true }) slides: IonSlides;
    loginForm: FormGroup;
    signupForm: FormGroup;
    category = 'login';
    passwordTpye = 'password';
    passwordShown = false;

    constructor(
        private router: Router,
        private authService: AuthService,
        private storageService: StorageService,
        public menu: MenuController,
        private loadingService: LoadingService,
        private alertController: AlertController
    ) {
        this.loginForm = new FormGroup({
            email_or_mobile: new FormControl('', {
                updateOn: 'change',
                validators: [Validators.required],
            }),
            password: new FormControl('', {
                updateOn: 'change',
                validators: [Validators.required],
            }),
        });

        // fields for register form
        this.signupForm = new FormGroup({
            mobile: new FormControl('', {
                updateOn: 'change',
                validators: [
                    Validators.required,
                    Validators.pattern(/^(?=.*[0-9])(?=.{10,10})/),
                ],
            }),
            email: new FormControl('', {
                updateOn: 'change',
                validators: [Validators.required, Validators.email],
            }),
            password: new FormControl('', {
                updateOn: 'change',
                validators: [
                    Validators.required,
                    Validators.pattern(
                        /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&])(?=.{8,})/
                    ),
                ],
            }),
        });
    }

    ionViewWillEnter() {
        // it load again and again on every route to login page

        this.menu.enable(false);

        this.authService.isAuthenticated().then((isLoggedIn) => {
            if (isLoggedIn === true) {
                this.router.navigateByUrl('mahipic', { replaceUrl: true });
            }
        });
        console.log('login Entering');
    }

    ionViewWillLeave() {
        // enable the root left menu when leaving the login page
        this.menu.enable(true);
        console.log('login leaving');
    }

    async ngOnInit() {
        const isWelcome = await this.storageService.get(StorageConst.WELCOME);
        if (isWelcome === undefined) {
            this.router.navigateByUrl('/welcome');
            return;
        }
    }

    togglePassword() {
        if (this.passwordShown) {
            this.passwordTpye = 'password';
            this.passwordShown = false;
        } else {
            this.passwordTpye = 'text';
            this.passwordShown = true;
        }
    }

    segmentChanged(event: any) {
        if (event.detail.value === 'login') {
            this.slides.slidePrev();
        } else {
            this.slides.slideNext();
        }
    }

    validateEmail(email: any) {
        // tslint:disable-next-line: max-line-length
        const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailReg.test(String(email).toLowerCase());
    }

    validateMobile(mobile: any) {
        const mobileReg = /^\+?1?\d{10}$/;
        return mobileReg.test(String(mobile));
    }

    async _forgotPassword() {
        const alert = await this.alertController.create({
            header: 'Forgotten your password?',
            message:
                'Enter your email address below, and we’ll email instructions for setting a new password.',
            inputs: [
                {
                    name: 'email',
                    type: 'email',
                    value: 'ravindra007patle@gmail.com',
                    placeholder: 'Email Address',
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {},
                },
                {
                    text: 'Reset',
                    handler: (data) => {
                        if (!data.email) {
                            this.loadingService.presentToast(
                                'Email address not entered.',
                                'danger'
                            );
                            return;
                        }
                        this.confirmPasswordReset(data.email);
                    },
                },
            ],
        });

        await alert.present();
    }

    async confirmPasswordReset(resetEmail: string) {
        await this.loadingService.showLoading('Sending mail');
        try {
            const resetRes = await this.authService.passwordReset({
                email: resetEmail,
            });

            await this.loadingService.hideLoading();

            console.log('Email res', resetRes);
            if (resetRes.detail) {
                this.loadingService.presentToast(
                    'Password reset e-mail has been sent.',
                    'success'
                );

                const data = {
                    title: 'Email sent',
                    passwordResetView: true,
                    emailVerifyView: false,
                    email: resetEmail,
                };
                this.storageService.store(StorageConst.VERIFYDATA, data);
                this.router.navigateByUrl('/verify');
            } else {
                this.loadingService.presentToast(
                    'Unable to send password reset e-mail.',
                    'danger'
                );
                return;
            }
        } catch (error) {
            await this.loadingService.hideLoading();
        }
    }

    async _loginAction(loginForm: FormGroup): Promise<void> {
        let userName = '',
            eMail = '',
            searchBy = '';

        if (!loginForm.valid) {
            this.loadingService.presentToast(
                'Invalid username or password.',
                'danger'
            );
            return;
        }

        // checking which data is provided by user email or mobile for login.
        if (this.validateEmail(loginForm.value.email_or_mobile)) {
            eMail = loginForm.value.email_or_mobile;
            searchBy = 'email';
        } else if (this.validateMobile(loginForm.value.email_or_mobile)) {
            userName = loginForm.value.email_or_mobile;
            searchBy = 'username';
        } else {
            this.loadingService.presentToast(
                'You must enter valid mobile or email',
                'danger'
            );
            return;
        }

        await this.loadingService.showLoading();

        const credentials: LoginOptions = {
            username: userName,
            email: eMail,
            password: loginForm.value.password,
        };

        try {
            // Checking 1. is_email_verified 2. is_photographer 3. valid_user
            const emailRes = await this.authService.isEmailVerified(
                credentials,
                searchBy
            );
            // Checking the registered user email is verified (must be verified)
            if (emailRes.is_email_verified === false) {
                const data = {
                    title: 'Verify Email',
                    passwordResetView: false,
                    emailVerifyView: true,
                };
                this.storageService.store(StorageConst.VERIFYDATA, data);
                this.router.navigateByUrl('/verify');
                await this.loadingService.hideLoading();
                return;
            } else if (emailRes.is_photographer === false) {
                // Checking the registered user is a photographer (must be true for photographer)
                this.loadingService.presentToast(
                    'You have no access as a client',
                    'danger'
                );
                await this.loadingService.hideLoading();
                return;
            } else if (emailRes.message === 'User does not exist') {
                // Invalid access
                this.loadingService.presentToast(
                    'Invalid Email or Mobile No. or Password',
                    'danger'
                );
                await this.loadingService.hideLoading();
                return;
            }

            // If registered email is verified then allow login
            const loginRes = await this.authService.login(credentials);

            // Storing the User data.
            if (loginRes.key) {
                await this.storageService.store(
                    StorageConst.TOKEN,
                    loginRes.key
                );

                this.router.navigateByUrl('mahipic');
                await this.loadingService.hideLoading();
            }
        } catch (error) {
            await this.loadingService.hideLoading();
        }
    }

    async _signupAction(signupForm: FormGroup): Promise<void> {
        if (!signupForm.valid) {
            this.loadingService.presentToast(
                'Invalid email or mobile or password.',
                'danger'
            );
            return;
        }

        await this.loadingService.showLoading();
        const credentials: SignUpOptions = {
            username: signupForm.value.mobile,
            email: signupForm.value.email,
            password1: signupForm.value.password,
            password2: signupForm.value.password,
            is_photographer: true,
        };

        try {
            const signupRes = await this.authService.signup(credentials);
            if (signupRes.key) {
                // verify email then login.
                this.loadingService.showMessage(
                    'To activate your Account, please verify your e-mail.'
                );
                await this.loadingService.hideLoading();
                const data = {
                    title: 'Verify Email',
                    passwordResetView: false,
                    emailVerifyView: true,
                };
                this.storageService.store(StorageConst.VERIFYDATA, data);
                this.router.navigateByUrl('/verify');
                const logoutRes = await this.authService.logout();
            }
        } catch (error) {
            await this.loadingService.hideLoading();
        }
    }

    // login() {
    //     this.auth.setLoggedIn(true);
    //     this.router.navigateByUrl('mahipic');
    // }
}
