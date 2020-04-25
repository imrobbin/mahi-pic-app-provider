import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CameraSource } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CameraService } from '../../../services/camera.service';
import { LoadingService } from '../../../services/loading.service';
import { HttpService } from '../../../services/http.service';
import { StorageService } from '../../../services/storage.service';
import { StorageConst } from '../../../config/storage-constants';

@Component({
    selector: 'app-add-photo',
    templateUrl: './add-photo.page.html',
    styleUrls: ['./add-photo.page.scss'],
})
export class AddPhotoPage implements OnInit {
    samplePhotos = [];
    photo: any;
    addPhotoForm: FormGroup;
    addPhotoFormIsEdited = false;
    addPhotoFormPhotoEdited = false;
    addPhotoFormIsEditing = false;
    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private loadingService: LoadingService,
        private httpService: HttpService,
        private cameraService: CameraService,
        private storageService: StorageService
    ) {}

    ngOnInit() {
        this.addPhotoForm = new FormGroup({
            // title: new FormControl(null, {
            //     validators: Validators.required,
            //     updateOn: 'change',
            // }),
            caption: new FormControl(null, {
                updateOn: 'change',
                validators: Validators.required,
            }),
            image: new FormControl(null, {
                updateOn: 'change',
                validators: Validators.required,
            }),
        });

        this.addPhotoForm.valueChanges.subscribe((values) => {
            this.addPhotoFormIsEdited = true;
        });
    }

    async ionViewWillEnter() {
        this.samplePhotos = await this.storageService.get(
            StorageConst.SAMPLE_PHOTOS
        );

        this.route.paramMap.subscribe((paramMap) => {
            if (paramMap.has('photoId')) {
                this.photo = this.samplePhotos.find((p) => {
                    return p.id === +paramMap.get('photoId');
                });

                this.addPhotoForm.patchValue({
                    image: this.photo.img_url,
                    caption: this.photo.img_caption,
                });
                this.addPhotoFormIsEditing = true;
                this.addPhotoFormIsEdited = false;
            }
        });
    }

    async addSamplePhoto() {
        try {
            const takePhotoRes = await this.cameraService.takePicture(
                CameraSource.Photos
            );

            this.addPhotoForm.patchValue({ image: takePhotoRes.webPath });
            // to confirm weather image is changed or not
            this.addPhotoFormPhotoEdited = true;
        } catch (error) {
            this.loadingService.presentToast('Action Cancelled', 'danger');
        }
    }

    async onAddPhotoSample(addPhotoForm: FormGroup) {
        try {
            let uploadRes = null;
            if (this.addPhotoFormPhotoEdited === true) {
                await this.loadingService.showLoading('Uploading Photo...');

                // when an existing photo sample is being Edited
                let imageName = 'sample-' + this.samplePhotos.length;
                if (this.addPhotoFormIsEditing === true) {
                    imageName = this.photo.photo_sample
                        .split('+')[1]
                        .split('.')[0];
                }
                uploadRes = await this.cameraService.uploadPhoto(
                    addPhotoForm.value.image,
                    'sample',
                    imageName,
                    'add'
                );
                await this.loadingService.hideLoading();

                if (uploadRes.success === false) {
                    this.loadingService.presentToast(
                        'Photo Uploading failed.',
                        'danger'
                    );
                    return;
                }
            }

            const photoSampleData = {
                // photo_title: addPhotoForm.value.title,
                img_caption: addPhotoForm.value.caption,
                img_url: null,
            };
            if (this.addPhotoFormPhotoEdited === true) {
                photoSampleData.img_url =
                    'https://mahipicapp.000webhostapp.com/mahipicapp/sample_photo/' +
                    uploadRes.filename;
            } else if (this.addPhotoFormPhotoEdited === false) {
                photoSampleData.img_url = addPhotoForm.value.image;
            }
            let method = 'post',
                url = 'profiles/photo-sample/';

            // in case of editing sample photo change url and method
            if (this.addPhotoFormIsEditing === true) {
                method = 'put';
                url = url + this.photo.id + '/';
            }

            await this.loadingService.showLoading('Saving Details');

            const photoSampleRes = await this.httpService.makeApiCall(
                method,
                url,
                photoSampleData
            );
            console.log('photoSampleRes ', photoSampleRes);
            if (photoSampleRes.id) {
                if (this.addPhotoFormIsEditing === true) {
                    this.samplePhotos = this.samplePhotos.filter((p) => {
                        return p.id !== photoSampleRes.id;
                    });
                }
                this.samplePhotos.push(photoSampleRes);
                await this.storageService.store(
                    StorageConst.SAMPLE_PHOTOS,
                    this.samplePhotos
                );
                this.loadingService.presentToast(
                    'Sample Photo Saved.',
                    'success'
                );
                if (this.addPhotoFormIsEditing === false) {
                    addPhotoForm.reset();
                }

                if (this.samplePhotos.length === 10) {
                    this.navCtrl.navigateBack('/mahipic/tabs/tabPhotos');
                }
            } else {
                this.loadingService.presentToast(
                    'Unable to save Sample Photo.',
                    'danger'
                );
            }

            await this.loadingService.hideLoading();
        } catch (error) {
            console.error(error);
            this.loadingService.presentToast(
                'Unable to add sample photo. Please check Internet connection.',
                'danger'
            );
            await this.loadingService.hideLoading();
        }
    }
}
