import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewPhotoPageRoutingModule } from './view-photo-routing.module';

import { ViewPhotoPage } from './view-photo.page';

import { SharedComponentsModule } from '../../../components/shared-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ViewPhotoPageRoutingModule,
        SharedComponentsModule,
    ],
    declarations: [ViewPhotoPage],
})
export class ViewPhotoPageModule {}
