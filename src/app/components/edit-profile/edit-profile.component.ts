import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CameraSource } from '@capacitor/core';

import { CameraService } from '../../services/camera.service';
import { LoadingService } from '../../services/loading.service';
import { HttpService } from '../../services/http.service';
import { StorageService } from '../../services/storage.service';
import {
    ProfileOptions,
    UserOptions,
    PasswordOptions,
} from '../../interfaces/model.interface';
import { StorageConst } from '../../config/storage-constants';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
    @Input() userData: any;
    public editProfileForm: FormGroup;
    public changePwdForm: FormGroup;
    passwordTpye = 'password';
    passwordShown = false;
    profileFormIsEdited = false;

    constructor(
        private modalCtrl: ModalController,
        private actionSheetCtrl: ActionSheetController,
        private loadingService: LoadingService,
        private httpService: HttpService,
        private cameraService: CameraService,
        private storageService: StorageService
    ) {}

    ngOnInit() {
        console.log('userData ', this.userData);

        if (this.userData.openForm === 'edit-profile') {
            this.editProfileForm = new FormGroup({
                mobile: new FormControl({
                    value: this.userData.user.username,
                    disabled: true,
                }),
                email: new FormControl({
                    value: this.userData.user.email,
                    disabled: true,
                }),
                first_name: new FormControl(this.userData.user.first_name, {
                    updateOn: 'blur',
                }),
                last_name: new FormControl(this.userData.user.last_name, {
                    updateOn: 'blur',
                }),
                bio: new FormControl(this.userData.profile.bio, {
                    updateOn: 'blur',
                    validators: [Validators.maxLength(180)],
                }),
                avatar: new FormControl(this.userData.profile.avatar, {
                    updateOn: 'blur',
                }),
            });

            this.editProfileForm.valueChanges.subscribe((values) => {
                this.profileFormIsEdited = true;
            });
        } else if (this.userData.openForm === 'change-password') {
            this.changePwdForm = new FormGroup(
                {
                    password: new FormControl('', {
                        updateOn: 'change',
                        validators: [Validators.required],
                    }),
                    password1: new FormControl('', {
                        updateOn: 'change',
                        validators: [
                            Validators.required,
                            Validators.pattern(
                                /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&])(?=.{8,})/
                            ),
                        ],
                    }),
                    password2: new FormControl('', {
                        updateOn: 'change',
                        validators: [Validators.required],
                    }),
                },
                {
                    validators: this.matchingPasswords(
                        'password1',
                        'password2'
                    ),
                }
            );
        }
    }

    togglePassword() {
        if (this.passwordShown) {
            this.passwordTpye = 'password';
            this.passwordShown = false;
        } else {
            this.passwordTpye = 'text';
            this.passwordShown = true;
        }
    }

    matchingPasswords(password1: string, password2: string) {
        return (group: FormGroup) => {
            const password = group.controls[password1];
            const confirmPassword = group.controls[password2];

            if (password.value !== confirmPassword.value) {
                return { mismatchedPasswords: true };
            }
        };
    }

    async showActionSheet() {
        const actionSheet = await this.actionSheetCtrl.create({
            header: 'Select image source',
            buttons: [
                // {
                // 	text: 'Remove photo',
                // 	icon: 'trash',
                // 	cssClass: 'action-danger',
                // 	handler: () => {
                // 		this.cameraService.takePicture(CameraSource.Camera);
                // 	}
                // },
                {
                    text: 'Camera',
                    icon: 'camera',
                    cssClass: 'action-primary',
                    handler: () => {
                        this.startTakingPhoto(CameraSource.Camera, 150, 150);
                    },
                },
                {
                    text: 'Gallery',
                    icon: 'images',
                    cssClass: 'action-secondary',
                    handler: () => {
                        this.startTakingPhoto(CameraSource.Photos);
                    },
                },
                {
                    text: 'Cancel',
                    icon: 'close-circle',
                    role: 'cancel',
                    cssClass: 'action-dark',
                    handler: () => {
                        // Nothing to do, action sheet is automatically closed
                    },
                },
            ],
        });
        await actionSheet.present();
    }

    async startTakingPhoto(
        source: CameraSource,
        imgHeight?: number,
        imgWidth?: number
    ) {
        try {
            const takePhotoRes = await this.cameraService.takePicture(
                source,
                imgHeight,
                imgWidth
            );

            this.loadingService.showLoading('Uploading...');

            const uploadRes = await this.cameraService.uploadPhoto(
                takePhotoRes.webPath,
                'profile',
                this.userData.profile.avatar.split('+')[1].split('.')[0],
                'add'
            );
            if (uploadRes['success']) {
                const avatarData = {
                    avatar:
                        'https://mahipicapp.000webhostapp.com/mahipicapp/profile_photo/' +
                        uploadRes['filename'],
                };
                const avatarUpRes = await this.httpService.makeApiCall(
                    'put',
                    'accounts/profiles/avatar-update/',
                    avatarData
                );

                const isProfile = await this.storageService.get(
                    StorageConst.PROFILE
                );

                await this.storageService.remove(StorageConst.PROFILE);

                this.editProfileForm.patchValue({ avatar: avatarUpRes.avatar });

                isProfile.avatar = avatarUpRes.avatar;
                await this.storageService.store(
                    StorageConst.PROFILE,
                    isProfile
                );

                this.loadingService.presentToast(
                    'Profile Photo Updated.',
                    'success'
                );
            } else {
                this.loadingService.presentToast(
                    'Image uploading failed.',
                    'danger'
                );
            }
            await this.loadingService.hideLoading();
        } catch (error) {
            this.loadingService.presentToast('Action Cancelled', 'danger');
        }
    }

    async onUpdateProfile(editProfileForm: FormGroup): Promise<void> {
        await this.loadingService.showLoading();

        const uCredentials: UserOptions = {
            username: this.userData.user.username,
            first_name: editProfileForm.value.first_name,
            last_name: editProfileForm.value.last_name,
        };

        const pCredentials: ProfileOptions = {
            bio: editProfileForm.value.bio,
        };

        try {
            const u = this.httpService.makeApiCall(
                'put',
                'accounts/user/',
                uCredentials
            );

            const p = this.httpService.makeApiCall(
                'put',
                'profiles/profile-list/' + this.userData.profile.id + '/',
                pCredentials
            );

            const [editUserRes, editProfileRes] = await Promise.all([u, p]);

            let role = 'failed';
            // updated record will return data with pk
            if (editUserRes.pk && editProfileRes.id) {
                role = 'confirm';
            }

            await this.loadingService.hideLoading();
            this.modalCtrl.dismiss(
                { userData: { user: editUserRes, profile: editProfileRes } },
                role
            );
        } catch (error) {
            await this.loadingService.hideLoading();
        }
    }

    async onUpdatePassword(changePwdForm: FormGroup): Promise<void> {
        await this.loadingService.showLoading();

        const pCredentials: PasswordOptions = {
            old_password: changePwdForm.value.password,
            new_password1: changePwdForm.value.password1,
            new_password2: changePwdForm.value.password2,
        };

        try {
            const changePwdRes = await this.httpService.makeApiCall(
                'post',
                'accounts/password/change/',
                pCredentials
            );

            console.log('changePwdRes ', changePwdRes);

            let role = 'failed';
            // updated record will return data with pk
            if (changePwdRes.detail) {
                role = 'confirm';
            }

            await this.loadingService.hideLoading();
            this.modalCtrl.dismiss({ userData: changePwdRes.detail }, role);
        } catch (error) {
            await this.loadingService.hideLoading();
        }
    }

    onCancel() {
        this.modalCtrl.dismiss(null, 'cancel');
    }
}
