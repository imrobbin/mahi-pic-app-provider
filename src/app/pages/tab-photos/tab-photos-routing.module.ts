import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabPhotosPage } from './tab-photos.page';

const routes: Routes = [
    {
        path: '',
        component: TabPhotosPage,
    },
    {
        path: 'add-photo',
        loadChildren: () =>
            import('./add-photo/add-photo.module').then(
                (m) => m.AddPhotoPageModule
            ),
    },
    {
        path: 'view-photo',
        loadChildren: () =>
            import('./view-photo/view-photo.module').then(
                (m) => m.ViewPhotoPageModule
            ),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TabPhotosPageRoutingModule {}
