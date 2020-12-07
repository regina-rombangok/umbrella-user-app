import { UtilService } from './../Provider/Util/util.service';
import { ApiService } from './../Provider/Api/api.service';
import { NavController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-otpverification',
  templateUrl: './otpverification.page.html',
  styleUrls: ['./otpverification.page.scss']
})
export class OTPVerificationPage implements OnInit {
  opt: any = {};
  @ViewChild('a', { static: true }) a;
  confirmResult: any;
  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService
  ) {
    this.confirmResult = this.api.parseData.confirmResult;
    setTimeout(() => {
      this.a.setFocus();
    }, 200);
  }

  ngOnInit() {}
  backPage() {
    this.navCtrl.back();
  }
  moveFocus(event, nextElement, previousElement) {
    if (event.keyCode == 8 && previousElement) {
      previousElement.setFocus();
    } else if (event.keyCode >= 48 && event.keyCode <= 57) {
      if (nextElement) {
        nextElement.setFocus();
      }
    } else {
      event.path[0].value = '';
    }
  }
  resendCode() {
    // this.navCtrl.back();
  }
  continue() {
    const otp =
      this.opt.a.toString() +
      this.opt.b.toString() +
      this.opt.c.toString() +
      this.opt.d.toString() +
      this.opt.e.toString() +
      this.opt.f.toString();
    this.util.presentLoading();
    this.confirmResult
      .confirm(otp)
      .then(result => {
        if (result.additionalUserInfo.isNewUser === true) {
          this.api
            .addDocument('users', result.user.uid, this.api.parseData.data)
            .then(res => {
              this.util.dismissLoader();
              localStorage.setItem('userKey', result.user.uid);
              this.util.presentToast('You have successfully registered');
              this.navCtrl.navigateRoot('/home');
            })
            .catch(err => {
              this.util.dismissLoader();
              console.log('err', err);
              this.util.presentAlert(err.message);
            });
        } else {
          this.util.dismissLoader();
          this.util.presentToast('You have successfully Login');
          this.navCtrl.navigateRoot('/home');
        }
      })
      .catch(error => {
        this.util.dismissLoader();
        console.log(error, 'Incorrect code entered?');
      });
  }
}
