import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { SkeletonComponent } from './skeleton/skeleton.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ExpandableComponent } from './expandable/expandable.component';

@NgModule({
    declarations: [
        SkeletonComponent,
        EditProfileComponent,
        ExpandableComponent,
    ],
    exports: [
        ReactiveFormsModule,
        SkeletonComponent,
        EditProfileComponent,
        ExpandableComponent,
    ],
    imports: [CommonModule, IonicModule.forRoot(), ReactiveFormsModule],
})
export class SharedComponentsModule {}
