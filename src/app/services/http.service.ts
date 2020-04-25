import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { LoadingService } from './loading.service';
import { StorageService } from './storage.service';
import { StorageConst } from '../config/storage-constants';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(
        private http: HttpClient,
        private loadingService: LoadingService,
        private storageService: StorageService,
        private router: Router
    ) {}

    async makeApiCall(
        method: string,
        serviceUrl: string,
        serviceData?: any
    ): Promise<any> {
        // getting token
        const token = await this.storageService.get(StorageConst.TOKEN);

        const headers = new HttpHeaders({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Token ' + token,
        });

        const options = { headers };
        const url = environment.apiUrl + serviceUrl;

        try {
            let response: any;
            const data = JSON.stringify(serviceData);

            if (method === 'post') {
                response = await this.http.post(url, data, options).toPromise();
            } else if (method === 'get') {
                response = await this.http.get(url, options).toPromise();
            } else if (method === 'put') {
                response = await this.http.put(url, data, options).toPromise();
            } else if (method === 'delete') {
                response = await this.http.delete(url, options).toPromise();
            }
            console.log('Request URL ==> ', url, '\n', 'method ==>', method);
            console.log('Response at Http ==> ', response);

            return response;
        } catch (error) {
            this.handleError(error);
        }
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

        if (error.error.detail) {
            msg = 'Invalid access. Please Login again.';
            this.storageService.remove(StorageConst.TOKEN).then((res) => {
                this.router.navigate(['/login']);
            });
        } else if (error.error.non_field_errors) {
            msg = 'Invalid username/email or password.';
        } else if (error.error.old_password) {
            msg = 'Incorrect current password.';
        } else if (error.error.new_password2) {
            msg = 'Password should not contain First Name or Last Name.';
        } else {
            msg = 'Something bad happened. Please inform to Administrator.';
        }

        this.loadingService.presentToast(msg, 'danger');

        // return an observable with a user-facing error message
        return throwError('Something bad happened. Please try again later.');
    }
}
