import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SignUpWithMobilePage } from './sign-up-with-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: SignUpWithMobilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SignUpWithMobilePage]
})
export class SignUpWithMobilePageModule {}
