import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPhotoPageRoutingModule } from './add-photo-routing.module';

import { AddPhotoPage } from './add-photo.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        AddPhotoPageRoutingModule,
    ],
    declarations: [AddPhotoPage],
})
export class AddPhotoPageModule {}
