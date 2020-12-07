import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewOnGoingJobsPage } from './view-on-going-jobs.page';

const routes: Routes = [
  {
    path: '',
    component: ViewOnGoingJobsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewOnGoingJobsPage]
})
export class ViewOnGoingJobsPageModule {}
