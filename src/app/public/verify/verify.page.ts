import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { StorageConst } from '../../config/storage-constants';

@Component({
    selector: 'app-verify',
    templateUrl: './verify.page.html',
    styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {
    verifyData: any;
    steps = [];
    constructor(private storageService: StorageService) {}

    async ngOnInit() {
        this.steps = [
            {
                note: `Navigate to your email account.`,
            },
            {
                note: `You should see a new email from us "example.com".`,
            },
            {
                note: `Open the email and click the given link. This will load up exapmle.com and confirm your email address.`,
            },
            {
                note: `Thats it! You will be able to login with provided email/contact and password.`,
            },
        ];
        this.verifyData = await this.storageService.get(
            StorageConst.VERIFYDATA
        );
        console.log(this.verifyData);
    }
    async ionViewWillEnter() {
        // this.verifyData = await this.storageService.get(StorageConst.VERIFYDATA);
        // console.log(this.verifyData);
    }
}
