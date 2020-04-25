import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabPhotosPageRoutingModule } from './tab-photos-routing.module';

import { TabPhotosPage } from './tab-photos.page';

import { SharedComponentsModule } from '../../components/shared-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SharedComponentsModule,
        TabPhotosPageRoutingModule,
    ],
    declarations: [TabPhotosPage],
})
export class TabPhotosPageModule {}
