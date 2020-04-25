import { Injectable } from '@angular/core';
import {
    LoadingController,
    AlertController,
    ToastController,
} from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    public loading: HTMLIonLoadingElement;

    constructor(
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public toastController: ToastController
    ) {}

    async showLoading(msg?: string): Promise<void> {
        this.loading = await this.loadingCtrl.create({
            message: msg,
        });
        await this.loading.present();
    }

    hideLoading(): Promise<boolean> {
        return this.loading.dismiss();
    }

    async showMessage(smg: any): Promise<void> {
        const alert = await this.alertCtrl.create({
            message: smg,
            buttons: [{ text: 'Ok', role: 'cancel' }],
        });
        await alert.present();
    }

    async presentToast(infoMessage: string, infoType: string) {
        const toast = await this.toastController.create({
            message: infoMessage,
            duration: 4000,
            position: 'top',
            color: infoType,
            animated: true,
            cssClass: 'custom-toast',
            buttons: [
                {
                    role: 'cancel',
                    icon: 'close-circle',
                    handler: () => {
                        console.log('Cancel clicked');
                    },
                },
            ],
        });
        toast.present();
    }
}
