import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { SwUpdate } from '@angular/service-worker';
import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
    selectedPath = '';
    public appPages = [
        {
            title: 'Home',
            url: '/mahipic/tabs/tabHome',
            icon: 'home',
        },
        {
            title: 'Photos',
            url: '/mahipic/tabs/tabPhotos',
            icon: 'images',
        },
        {
            title: 'Profile',
            url: '/mahipic/tabs/tabSettings',
            icon: 'person',
        },
        {
            title: 'Notifications',
            url: '/mahipic/tabs/tabSettings1',
            icon: 'notifications',
        },
        {
            title: 'Saved',
            url: '/mahipic/tabs/tabSettings2',
            icon: 'bookmark',
        },
        // {
        //     title: 'Home',
        //     url: '/mahipic/home',
        //     icon: 'home',
        // },
        // {
        //     title: 'About',
        //     url: '/mahipic/about',
        //     icon: 'list',
        // },
    ];

    dark = false;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private auth: AuthService,
        private router: Router,
        private toastCtrl: ToastController // private swUpdate: SwUpdate
    ) {
        this.initializeApp();
    }

    async ngOnInit() {
        // this.swUpdate.available.subscribe(async (res) => {
        //     const toast = await this.toastCtrl.create({
        //         message: 'Update available!',
        //         position: 'bottom',
        //         buttons: [
        //             {
        //                 role: 'cancel',
        //                 text: 'Reload',
        //             },
        //         ],
        //     });
        //     await toast.present();
        //     toast
        //         .onDidDismiss()
        //         .then(() => this.swUpdate.activateUpdate())
        //         .then(() => window.location.reload());
        // });
    }

    logout() {
        // this.auth.setLoggedIn(false);
        this.router.navigateByUrl('/');
    }
    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
}
