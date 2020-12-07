import { AngularFireAuth } from '@angular/fire/auth';
import { UtilService } from './../Provider/Util/util.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Provider/Api/api.service';
import { NavController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss']
})
export class SigninPage implements OnInit {
  data: any = {};
  constructor(
    private api: ApiService,
    private util: UtilService,
    private navCtrl: NavController,
    private menu: MenuController,
    private afAugh: AngularFireAuth
  ) {
    this.menu.enable(false);
  }

  ngOnInit() {}

  signIn() {
    this.util.presentLoading();
    this.api
      .doLogin(this.data)
      .then(res => {
        if (res[0] === true && res[1].user.emailVerified === true) {
          let unsub = this.api
            .getDocumnet('users/' + res[1].user.uid)
            .subscribe(
              (res1: any) => {
                this.util.dismissLoader();
                if (res1.roll === 2) {
                  if (res1.adminStatus === true) {
                    localStorage.setItem('userKey', res[1].user.uid);
                    this.api.updateDocument(`users/${res[1].user.uid}`, {
                      token: localStorage.getItem('deviceToken')
                    });
                    this.util.presentToast('You are login successfuly');
                    this.navCtrl.navigateRoot('/home');
                  } else {
                    this.util.dismissLoader();
                    localStorage.removeItem('userKey');
                    this.afAugh.auth.signOut();
                    this.navCtrl.navigateRoot('/starter');
                    this.util.presentAlert('Your accont has been blocked');
                  }
                } else {
                  localStorage.removeItem('userKey');
                  this.afAugh.auth.signOut();
                  this.navCtrl.navigateRoot('/starter');
                  this.util.dismissLoader();
                  this.util.presentAlert('You are not user');
                }
                unsub.unsubscribe();
              },
              err => {
                this.util.dismissLoader();
              }
            );
        } else {
          this.util.dismissLoader();
        }
      })
      .catch(err => {
        this.util.dismissLoader();
        this.util.presentAlert(err.message);
      });
  }

  forgotPassword() {
    this.navCtrl.navigateForward('/forgot-password');
  }
}
