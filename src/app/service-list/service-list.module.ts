import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ServiceListPage } from './service-list.page';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

const routes: Routes = [
  {
    path: '',
    component: ServiceListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxIonicImageViewerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ServiceListPage]
})
export class ServiceListPageModule {}
