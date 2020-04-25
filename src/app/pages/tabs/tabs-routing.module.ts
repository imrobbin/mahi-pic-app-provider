import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: '',
                redirectTo: 'tabs/(tabHome:tabHome)',
                pathMatch: 'full',
            },
            {
                path: 'tabHome',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../tab-home/tab-home.module').then(
                                (m) => m.TabHomePageModule
                            ),
                    },
                    {
                        path: 'homeDetail',
                        loadChildren: () =>
                            import('../home-detail/home-detail.module').then(
                                (m) => m.HomeDetailPageModule
                            ),
                    },
                ],
            },
            {
                path: 'tabPhotos',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../tab-photos/tab-photos.module').then(
                                (m) => m.TabPhotosPageModule
                            ),
                    },
                    {
                        path: 'add-photo',
                        loadChildren: () =>
                            import(
                                '../tab-photos/add-photo/add-photo.module'
                            ).then((m) => m.AddPhotoPageModule),
                    },
                    {
                        path: 'add-photo/:photoId',
                        loadChildren: () =>
                            import(
                                '../tab-photos/add-photo/add-photo.module'
                            ).then((m) => m.AddPhotoPageModule),
                    },
                    {
                        path: ':photoId',
                        loadChildren: () =>
                            import(
                                '../tab-photos/view-photo/view-photo.module'
                            ).then((m) => m.ViewPhotoPageModule),
                    },
                ],
            },
            {
                path: 'tabSettings',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../tab-settings/tab-settings.module').then(
                                (m) => m.TabSettingsPageModule
                            ),
                    },
                ],
            },
        ],
    },
    {
        path: '',
        redirectTo: 'tabs/tabHome',
        pathMatch: 'full',
    },
    {
        path: 'about',
        loadChildren: () =>
            import('../about/about.module').then((m) => m.AboutPageModule),
    },
    {
        path: 'home',
        loadChildren: () =>
            import('../home/home.module').then((m) => m.HomePageModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TabsPageRoutingModule {}
