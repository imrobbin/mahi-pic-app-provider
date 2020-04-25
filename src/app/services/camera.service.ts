import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';

import { StorageService } from './storage.service';
import { StorageConst } from '../config/storage-constants';

const { Camera } = Plugins;

@Injectable({
    providedIn: 'root',
})
export class CameraService {
    constructor(
        private storageService: StorageService,
        private http: HttpClient
    ) {}

    public async takePicture(
        sourceType: CameraSource,
        imgHeight?: number,
        imgWidth?: number
    ): Promise<any> {
        // Take a photo
        const capturedPhoto = await Camera.getPhoto({
            quality: 100, // highest quality (0 to 100)
            resultType: CameraResultType.Uri, // file-based data; provides best performance
            source: sourceType, // take a new photo with the selected source
            height: imgHeight, // height for captured img
            width: imgWidth, // weight for captured img
        });

        return capturedPhoto;
    }

    // all process for image uploading >....DO NOT CHANGE ...<
    async uploadPhoto(
        imgData: any, // actual captured Photo
        imgFor: string, // profile or sample photo
        imgOldName: any, // name of the image saved with
        imgAction: string // action -- add or delete image
    ): Promise<any> {
        try {
            // naming the capture image
            const user = await this.storageService.get(StorageConst.USER);
            let url = 'https://mahipicapp.000webhostapp.com/mahipicapp/';

            let fileName = user.username;

            let arr: any = [];

            if (imgFor === 'profile') {
                arr = imgOldName.split('-')[1];
                url = url + 'profile_photo.php';

                // to efficientlly load the currentlly uploaded image
                if (arr === 'default' || arr === 'old') {
                    fileName = fileName + '-new';
                } else if (arr === 'new') {
                    fileName = fileName + '-old';
                }

                fileName = `profile+${fileName}.jpg`;
            } else if (imgFor === 'sample') {
                arr = imgOldName.split('-');

                if (arr[0] === 'sample') {
                    // when a new sample photo is being uploaded,
                    // create name with username+length_sapmle_photo
                    const num = +arr[1]++;
                    fileName = fileName + '-' + num;
                } else if (arr[0] !== 'sample') {
                    // when a edited sample photo is being uploaded,
                    // don't change the name, take it, as it is
                    fileName = imgOldName;
                }

                fileName = `sample+${fileName}.jpg`;

                if (imgAction === 'add') {
                    url = url + 'sample_photo.php?action=add';
                } else if (imgAction === 'delete') {
                    url = url + 'sample_photo.php?action=delete';
                }
            }

            console.log('imgAction ', imgAction, '\n', 'url ', url);

            let postRes = null;

            // convert the web path we get from the Camera plugin into a Blob
            const blob = await fetch(imgData).then((r) => r.blob());
            // FormData object and append a new value with the blob object
            const formData = new FormData();

            formData.append('file', blob, fileName);
            postRes = await this.http.post(url, formData).toPromise();

            console.log('Request URL ==> ', url);
            console.log('Response at Http ==> ', postRes);
            postRes['filename'] = fileName;
            return postRes;
        } catch (error) {
            console.log(error);
        }
    }
}
