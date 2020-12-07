import { NavController, MenuController } from '@ionic/angular';
import { ApiService } from './../Provider/Api/api.service';
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../Provider/Util/util.service';
import * as firebase from 'firebase';
@Component({
  selector: 'app-sign-in-phone',
  templateUrl: './sign-in-phone.page.html',
  styleUrls: ['./sign-in-phone.page.scss']
})
export class SignInPhonePage implements OnInit {
  data: any = {};
  recaptchaVerifier: any;
  confirmResult: any;
  constructor(
    private api: ApiService,
    private util: UtilService,
    private navCtrl: NavController,
    private menu: MenuController
  ) {
    this.menu.enable(false);
  }

  ngOnInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container'
    );
    this.recaptchaVerifier.render();
  }

  signIn() {
    let rgx: any = '';
    if (
      /([+]?\d{1,2}[.-\s]?)?(\d{3}[.-]?){2}\d{4}/.test(
        '+' + this.data.mobile_no
      )
    ) {
      this.util.presentLoading();
      firebase
        .auth()
        .signInWithPhoneNumber(
          '+' + this.data.mobile_no,
          this.recaptchaVerifier
        )
        .then(res => {
          this.util.dismissLoader();
          this.confirmResult = res;
          this.api.parseData = {
            confirmResult: this.confirmResult,
            data: this.data
          };
          this.navCtrl.navigateForward('otp-verification');
        })
        .catch(err => {
          this.util.dismissLoader();
          console.log('err', err);
          this.util.presentAlert('invalid-phone-number');
        });
    } else {
      this.util.presentAlert('Mobile Number Use This Format 918734563745');
    }
    // this.api
    //   .doLogin(this.data)
    //   .then(res => {
    //     if (res[0] === true) {
    //       this.api.getDocumnet('users/' + res[1].user.uid).subscribe(
    //         (res1: any) => {
    //           this.util.dismissLoader();
    //           if (res1.roll === 2) {
    //             localStorage.setItem('userKey', res[1].user.uid);
    //             this.api.updateDocument(`users/${res[1].user.uid}`, {
    //               token: localStorage.getItem('deviceToken')
    //             });
    //             this.util.presentToast('You are login successfuly');
    //             this.navCtrl.navigateRoot('/home');
    //           } else {
    //             this.util.dismissLoader();
    //             this.util.presentToast('You are not user');
    //           }
    //         },
    //         err => {
    //           this.util.dismissLoader();
    //         }
    //       );
    //     }
    //   })
    //   .catch(err => {
    //     this.util.dismissLoader();
    //     this.util.presentAlert(err.message);
    //   });
  }

  forgotPassword() {
    // this.navCtrl.navigateForward('/forgot-password');
  }
}
