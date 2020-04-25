import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from '../../services/storage.service';
import { StorageConst } from '../../config/storage-constants';
import { MenuController, IonSlides } from '@ionic/angular';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.page.html',
    styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {
    showSkip = true;

    @ViewChild('slides', { static: true }) slides: IonSlides;

    constructor(
        public menu: MenuController,
        private router: Router,
        private storageService: StorageService
    ) {}

    async navigateToLogin() {
        await this.storageService.store(StorageConst.WELCOME, true);
        this.router.navigateByUrl('/login', { replaceUrl: true });
    }

    onSlideChangeStart(event) {
        event.target.isEnd().then((isEnd) => {
            this.showSkip = !isEnd;
        });
    }

    async ionViewWillEnter() {
        console.log('Welcome enter');
        const isWelcome = await this.storageService.get(StorageConst.WELCOME);
        if (isWelcome === true) {
            this.router.navigateByUrl('/login', { replaceUrl: true });
        }

        this.menu.enable(false);
    }

    ionViewWillLeave() {
        // enable the root left menu when leaving the welcome page
        this.menu.enable(true);
    }
}
