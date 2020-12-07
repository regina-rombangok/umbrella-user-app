import { Injectable } from '@angular/core';
import {
  LoadingController,
  ToastController,
  AlertController
} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  loading: any;
  constructor(
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController
  ) {}

  async presentLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
    this.loading = await this.loadingController.create({
      message: 'Loading'
    });
    await this.loading.present();
  }

  dismissLoader() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      message: msg,
      cssClass: 'confirm-alery',
      buttons: ['OK']
    });

    await alert.present();
  }
}
