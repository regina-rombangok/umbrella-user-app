import { NavController, MenuController } from '@ionic/angular';
import { ApiService } from './../Provider/Api/api.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { UtilService } from '../Provider/Util/util.service';
declare var google;
@Component({
  selector: 'app-sign-up-with-mobile',
  templateUrl: './sign-up-with-mobile.page.html',
  styleUrls: ['./sign-up-with-mobile.page.scss']
})
export class SignUpWithMobilePage implements OnInit {
  service = new google.maps.places.AutocompleteService();
  autocompleteItems = [];
  categories: any = [];
  data: any = {};
  geocoder = new google.maps.Geocoder();
  recaptchaVerifier: any;
  otp: any;
  confirmResult: any;
  constructor(
    private api: ApiService,
    private util: UtilService,
    private navCtrl: NavController,
    private menu: MenuController
  ) {
    this.menu.enable(false);
    this.data.roll = 2;
    this.data.flag = false;
    this.data.disable = false;
    this.data.token = localStorage.getItem('deviceToken');
    this.data.walkthrough = {
      Home: true,
      Service: true,
      freelancerList: true
    };
    this.data.image =
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png';
    this.data.signThrough = 'PHONE';
  }

  ngOnInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container'
    );
    this.recaptchaVerifier.render();
  }

  autoAddress(text) {
    if (text == '') {
      this.autocompleteItems = [];
      return false;
    }
    let me = this;
    this.service.getPlacePredictions(
      {
        input: text
      },
      (predictions, status) => {
        me.autocompleteItems = [];
        if (predictions != null) {
          predictions.forEach(prediction => {
            me.autocompleteItems.push(prediction);
          });
        }
      }
    );
  }

  chooseItem(item: any) {
    let myFullAddress = item.terms;

    let fullText = '';

    for (let index = 0; index < myFullAddress.length; index++) {
      // for (let index = 0; index < (myFullAddress.length > 2 ? myFullAddress.length - 2 : myFullAddress.length); index++) {
      const element = myFullAddress[index];
      if (index == 0) {
        fullText += element.value;
      } else {
        fullText += ' ' + element.value;
      }
    }

    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.data.lat = results[0].geometry.location.lat();
        this.data.long = results[0].geometry.location.lng();
      }
    });
    this.data.address = fullText;
    this.autocompleteItems = [];
  }

  signUp() {
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
  }

  signIn() {
    this.navCtrl.navigateRoot('/sign-in');
  }
}
