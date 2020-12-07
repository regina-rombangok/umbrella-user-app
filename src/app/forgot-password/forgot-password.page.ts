import { UtilService } from './../Provider/Util/util.service';
import { ApiService } from './../Provider/Api/api.service';
import { NavController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss']
})
export class ForgotPasswordPage implements OnInit {
  email: any;
  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService
  ) { }

  ngOnInit() { }

  backPage() {
    this.navCtrl.back();
  }
  resetPassword() {
    if (this.email) {
      this.util.presentLoading();
      this.api
        .doForgotPassword(this.email)
        .then(res => {
          if (res) {
            this.util.dismissLoader();
            this.util.presentToast('Password reset info send your email');
            this.navCtrl.back();
          }
        })
        .catch(err => {
          this.util.dismissLoader();
          this.util.presentAlert(err.message);
        });
    } else {
      this.util.presentToast('Email is Required');
    }
  }
}
