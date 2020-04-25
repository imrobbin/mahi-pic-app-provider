import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

import { StorageService } from '../../../services/storage.service';
import { StorageConst } from '../../../config/storage-constants';
import { LoadingService } from '../../../services/loading.service';
import { HttpService } from '../../../services/http.service';
import { CameraService } from '../../../services/camera.service';

@Component({
    selector: 'app-view-photo',
    templateUrl: './view-photo.page.html',
    styleUrls: ['./view-photo.page.scss'],
})
export class ViewPhotoPage implements OnInit {
    samplePhotos: any = [];
    photo: any;
    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
        public alertController: AlertController,
        private storageService: StorageService,
        private loadingService: LoadingService,
        private httpService: HttpService,
        private cameraService: CameraService
    ) {}

    ngOnInit() {}

    async ionViewWillEnter() {
        this.samplePhotos = await this.storageService.get(
            StorageConst.SAMPLE_PHOTOS
        );

        this.route.paramMap.subscribe((paramMap) => {
            if (!paramMap.has('photoId')) {
                this.navCtrl.navigateBack('/home/photo');
                return;
            }

            this.photo = this.samplePhotos.find((p) => {
                return p.id === +paramMap.get('photoId');
            });
        });
    }

    async onDeletePhoto(photo: any, photoId: number) {
        const alert = await this.alertController.create({
            header: 'Confirm!',
            message: 'Are you sure to delete the sample photo?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    },
                },
                {
                    text: 'Delete',
                    handler: () => {
                        console.log('Confirm Okay');
                        this.deleteConfirmed(photo, photoId);
                    },
                },
            ],
        });

        await alert.present();
    }

    async deleteConfirmed(photo: any, photoId: number) {
        try {
            await this.loadingService.showLoading('Deleting Sample Photo...');

            const uploadRes = await this.cameraService.uploadPhoto(
                photo,
                'sample',
                this.photo.photo_sample.split('+')[1].split('.')[0],
                'delete'
            );

            if (uploadRes.success === false) {
                this.loadingService.presentToast(
                    'Failed to Delete Photo.',
                    'danger'
                );
                return;
            }

            const photoSampleRes = await this.httpService.makeApiCall(
                'delete',
                'profiles/photo-sample/' + photoId + '/'
            );
            console.log(photoSampleRes);
            this.samplePhotos = this.samplePhotos.filter((p) => {
                return p.id !== photoId;
            });
            await this.storageService.store(
                StorageConst.SAMPLE_PHOTOS,
                this.samplePhotos
            );
            await this.loadingService.hideLoading();
            this.navCtrl.navigateBack('/home/photo');
        } catch (error) {
            console.log(error);
            this.loadingService.presentToast(
                'Unable to delete Sample Photo.',
                'danger'
            );
            await this.loadingService.hideLoading();
        }
    }
}
