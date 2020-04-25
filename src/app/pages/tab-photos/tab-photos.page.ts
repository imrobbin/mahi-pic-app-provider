import { Component, OnInit } from '@angular/core';

import { HttpService } from 'src/app/services/http.service';
import { StorageService } from 'src/app/services/storage.service';
import { LoadingService } from 'src/app/services/loading.service';
import { StorageConst } from '../../config/storage-constants';
@Component({
    selector: 'app-tab-photos',
    templateUrl: './tab-photos.page.html',
    styleUrls: ['./tab-photos.page.scss'],
})
export class TabPhotosPage implements OnInit {
    samplePhotos: any = [];
    constructor(
        // private photosService: PhotosService,
        private httpService: HttpService,
        private storageService: StorageService,
        private loadingService: LoadingService
    ) {}

    ngOnInit() {}

    async ionViewWillEnter() {
        this.getSamplePhotosFromStorage();
    }

    async getSamplePhotosFromStorage(): Promise<any> {
        const isPhotos = await this.storageService.get(
            StorageConst.SAMPLE_PHOTOS
        );
        if (isPhotos && isPhotos.length !== 0) {
            this.samplePhotos = isPhotos;
            console.log('From local ', this.samplePhotos);
        } else {
            this.getSamplePhotosFromAPI();
        }
    }

    async getSamplePhotosFromAPI(): Promise<any> {
        try {
            const photoRes = await this.httpService.makeApiCall(
                'get',
                'profiles/photo-sample/'
            );
            this.samplePhotos = photoRes.results;

            await this.storageService.store(
                StorageConst.SAMPLE_PHOTOS,
                this.samplePhotos
            );
            console.log('From api ', this.samplePhotos);
        } catch (error) {}
    }
}
