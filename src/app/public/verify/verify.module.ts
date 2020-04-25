import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedComponentsModule } from '../../components/shared-components.module';

import { VerifyPage } from './verify.page';

const routes: Routes = [
    {
        path: '',
        component: VerifyPage,
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
    declarations: [VerifyPage],
})
export class VerifyPageModule {}
