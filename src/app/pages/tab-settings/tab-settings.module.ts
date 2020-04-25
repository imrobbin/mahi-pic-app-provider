import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabSettingsPage } from './tab-settings.page';

import { SharedComponentsModule } from '../../components/shared-components.module';

import { EditProfileComponent } from '../../components/edit-profile/edit-profile.component';

const routes: Routes = [
    {
        path: '',
        component: TabSettingsPage,
    },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SharedComponentsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [TabSettingsPage],
    entryComponents: [EditProfileComponent],
})
export class TabSettingsPageModule {}
