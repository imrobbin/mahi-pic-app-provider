import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { StorageConst } from '../config/storage-constants';

@Injectable({
    providedIn: 'root',
})
export class CheckWelcomeGuard implements CanLoad {
    constructor(
        private storageService: StorageService,
        private router: Router
    ) {}

    async canLoad() {
        const isWelcome = await this.storageService.get(StorageConst.WELCOME);
        if (isWelcome) {
            this.router.navigateByUrl('/login');
            return false;
        } else {
            return true;
        }
    }
}
