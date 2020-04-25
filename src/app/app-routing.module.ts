import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { CheckWelcomeGuard } from './guards/check-welcome.guard';

const routes: Routes = [
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    {
        path: 'mahipic',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
    },
    {
        path: 'login',
        loadChildren: () =>
            import('./public/login/login.module').then(
                (m) => m.LoginPageModule
            ),
    },
    {
        path: 'verify',
        loadChildren: () =>
            import('./public/verify/verify.module').then(
                (m) => m.VerifyPageModule
            ),
    },
    {
        path: 'welcome',
        loadChildren: () =>
            import('./public/welcome/welcome.module').then(
                (m) => m.WelcomePageModule
            ),
        canLoad: [CheckWelcomeGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
