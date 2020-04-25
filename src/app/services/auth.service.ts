import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { StorageConst } from '../config/storage-constants';
import { throwError } from 'rxjs';

import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoadingService } from './loading.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private storageService: StorageService,
        private http: HttpClient,
        private loadingService: LoadingService
    ) {}

    // return true or false if valid token exists
    async isAuthenticated(): Promise<boolean> {
        const tokenRes = await this.storageService.get(StorageConst.TOKEN);
        console.log('is token ', !!tokenRes);
        return !!tokenRes;
    }

    async signup(signupData: any) {
        return await this.loginOrSignup('accounts/registration/', signupData);
    }

    async login(loginData: any) {
        return await this.loginOrSignup('accounts/login/', loginData);
    }

    async logout() {
        return await this.loginOrSignup('accounts/logout/', null);
    }

    async passwordReset(email: any) {
        return await this.loginOrSignup('accounts/password/reset/', email);
    }

    async loginOrSignup(serviceUrl: string, data: any): Promise<any> {
        const options = this.generateHeaders();
        const url = environment.apiUrl + serviceUrl;

        try {
            const res = await this.http
                .post(url, JSON.stringify(data), options)
                .toPromise();
            console.log('Response at Auth ==>', res);
            return res;
        } catch (error) {
            this.handleError(error);
        }
    }

    async isEmailVerified(data: any, searchBy: string): Promise<any> {
        const options = this.generateHeaders();
        const search = data.username === '' ? data.email : data.username;

        const url =
            environment.apiUrl +
            'accounts/is-email-verified/' +
            searchBy +
            '/' +
            search +
            '/';

        try {
            const res = await this.http.get(url, options).toPromise();
            console.log('Response at Auth ==>', res);
            return res;
        } catch (error) {
            this.handleError(error);
        }
    }

    generateHeaders() {
        const headers = new HttpHeaders({
            Accept: 'application/json',
            'Content-Type': 'application/json',
        });

        const options = { headers };
        return options;
    }

    // Handle API errors
    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                    `body was: ${JSON.stringify(error.error)}`
            );
        }

        let msg = '';

        if (error.error.non_field_errors) {
            msg = 'Unable to log in with provided credentials.';
        } else if (error.error.username) {
            msg = 'User with this mobile/email already exists.';
        } else {
            msg = 'Something bad happened. Please inform to Administrator.';
        }

        this.loadingService.presentToast(msg, 'danger');

        // return an observable with a user-facing error message
        return throwError('Something bad happened. Please try again later.');
    }
}
