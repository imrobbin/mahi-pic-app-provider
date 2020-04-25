import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) {}

    async canActivate(): Promise<boolean> {
        // debugger;
        const value = await this.auth.isAuthenticated();
        if (value) {
            return true;
        }
        this.router.navigateByUrl('/login');
        return false;
    }
}
