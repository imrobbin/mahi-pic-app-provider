import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { EditProfileComponent } from '../../components/edit-profile/edit-profile.component';
import { StorageConst } from '../../config/storage-constants';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import { StorageService } from '../../services/storage.service';
import { LoadingService } from '../../services/loading.service';
import {
    UserOptions,
    ProfileOptions,
} from 'src/app/interfaces/model.interface';

@Component({
    selector: 'app-tab-settings',
    templateUrl: './tab-settings.page.html',
    styleUrls: ['./tab-settings.page.scss'],
})
export class TabSettingsPage implements OnInit {
    userData: UserOptions;
    profile: ProfileOptions = {
        id: null,
        user: '',
        pic_code: '',
        avatar: '',
        bio: '',
    };
    profileStatus: any;

    constructor(
        private router: Router,
        private authService: AuthService,
        private httpService: HttpService,
        private storageService: StorageService,
        private loadingService: LoadingService,
        private modalCtrl: ModalController,
        private animationCtrl: AnimationController
    ) {}

    ngOnInit() {}

    async ionViewWillEnter() {
        this.getUserDataFromStorage();
    }

    async getUserDataFromStorage(): Promise<any> {
        const isUser = await this.storageService.get(StorageConst.USER);
        const isProfile = await this.storageService.get(StorageConst.PROFILE);

        if (isUser && isProfile) {
            this.userData = isUser;
            this.profile = isProfile;
            console.log('Local Data Found');
        } else {
            this.getDataFromAPI();
        }
    }

    async getDataFromAPI(): Promise<any> {
        try {
            this.userData = await this.httpService.makeApiCall(
                'get',
                'accounts/user/'
            );
            this.profile = await this.httpService.makeApiCall(
                'get',
                'profiles/profile-list/' + this.userData.pk + '/'
            );

            await this.storageService.store(StorageConst.USER, this.userData);
            await this.storageService.store(StorageConst.PROFILE, this.profile);
        } catch (error) {}
    }

    async _logoutAction(): Promise<void> {
        await this.loadingService.showLoading();
        try {
            const logoutRes = await this.authService.logout();
            if (logoutRes.detail) {
                const welcome = await this.storageService.get(
                    StorageConst.WELCOME
                );

                await this.storageService.clear();

                await this.storageService.store(StorageConst.WELCOME, welcome);

                this.router.navigate(['/login']);
                await this.loadingService.hideLoading();
                this.loadingService.presentToast(logoutRes.detail, 'success');
            }
        } catch (error) {
            await this.loadingService.hideLoading();
        }
    }

    async editProfile() {
        const enterAnimation = (baseEl: any) => {
            const backdropAnimation = this.animationCtrl
                .create()
                // tslint:disable-next-line: no-non-null-assertion
                .addElement(baseEl.querySelector('ion-backdrop')!)
                .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

            const wrapperAnimation = this.animationCtrl
                .create()
                // tslint:disable-next-line: no-non-null-assertion
                .addElement(baseEl.querySelector('.modal-wrapper')!)
                .keyframes([
                    { offset: 0, opacity: '0', transform: 'scale(0)' },
                    { offset: 1, opacity: '0.99', transform: 'scale(1)' },
                ]);

            return this.animationCtrl
                .create()
                .addElement(baseEl)
                .easing('ease-out')
                .duration(500)
                .addAnimation([backdropAnimation, wrapperAnimation]);
        };

        const leaveAnimation = (baseEl: any) => {
            return enterAnimation(baseEl).direction('reverse');
        };

        this.modalCtrl
            .create({
                component: EditProfileComponent,
                backdropDismiss: false,
                componentProps: {
                    userData: {
                        title: 'Edit Profile',
                        openForm: 'edit-profile',
                        user: this.userData,
                        profile: this.profile,
                    },
                },
                enterAnimation,
                leaveAnimation,
                swipeToClose: true,
                presentingElement: await this.modalCtrl.getTop(),
            })
            .then((modalEl) => {
                modalEl.present();

                return modalEl.onDidDismiss();
            })
            .then((resultData) => {
                console.log(resultData.data, resultData.role);
                if (resultData.role === 'confirm') {
                    this.loadingService.presentToast(
                        'Information Updated.',
                        'success'
                    );

                    this.storageService.store(
                        StorageConst.USER,
                        resultData.data.userData.user
                    );

                    this.storageService.store(
                        StorageConst.PROFILE,
                        resultData.data.userData.profile
                    );
                }
                this.getUserDataFromStorage();
            });
    }

    ChangePassword() {
        this.modalCtrl
            .create({
                component: EditProfileComponent,
                backdropDismiss: false,
                componentProps: {
                    userData: {
                        title: 'Change Password',
                        openForm: 'change-password',
                    },
                },
            })
            .then((modalEl) => {
                modalEl.present();

                return modalEl.onDidDismiss();
            })
            .then((resultData) => {
                console.log(resultData.data, resultData.role);
                if (resultData.role === 'confirm') {
                    this.loadingService.presentToast(
                        resultData.data.userData,
                        'success'
                    );
                }
            });
    }
}
