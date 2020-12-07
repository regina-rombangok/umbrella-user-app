import { ApplyPromoPage } from "./../apply-promo/apply-promo.page";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { UtilService } from "./../Provider/Util/util.service";
import { ApiService } from "./../Provider/Api/api.service";
import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { NavController, ModalController } from "@ionic/angular";
import {
  NativeGeocoderResult,
  NativeGeocoder,
  NativeGeocoderOptions
} from "@ionic-native/native-geocoder/ngx";
import introJs from "intro.js/intro.js";
import { map } from "rxjs/operators";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  slideOpts = {
    speed: 400
  };
  categoryList$: Observable<any>;

  constructor(
    private api: ApiService,
    private util: UtilService,
    private navCtrl: NavController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private modalController: ModalController
  ) {

    this.getCategory();
  }

  ionViewDidEnter() {
    const unsub = this.api.walkthrough.subscribe((res: any) => {
      if (res.Home === true) {
        setTimeout(() => {
          const intro = introJs.introJs();
          intro.setOptions({
            steps: [
              {
                element: "#step1",
                intro: "Click here to open menu",
                position: "bottom"
              },
              {
                element: "#step2",
                intro: "Click Category and Display list of Sub Category",
                position: "bottom"
              }
            ]
          });
          intro.start();
          intro.oncomplete(() => {
            const temp: any = {
              Home: false,
              Service: res.Service,
              freelancerList: res.freelancerList
            };
            this.afs
              .doc<any>("users/" + this.afAuth.auth.currentUser.uid)
              .update({ walkthrough: temp });
          });
        }, 300);
        unsub.unsubscribe();
      }
    });
  }
  getCategory() {
    this.util.presentLoading();

    this.categoryList$ = this.api
      .getQueryCollection("category", "status", "==", "0")
      .pipe(
        map(res =>
          res.map((r: any) => {
            r.loaded = false;
            return r;
          })
        )
      );
    this.categoryList$.subscribe(
      res => this.util.dismissLoader(),
      err => this.util.dismissLoader()
    );
  }
  selectCategory(data) {
    this.api.parseData = data;
    this.navCtrl.navigateForward("/service-list");
  }

  ionViewWillLeave() {
    const unsub = this.api.walkthrough.subscribe((res: any) => {
      if (res.Home === true) {
        const temp: any = {
          Home: false,
          Service: res.Service,
          freelancerList: res.freelancerList
        };
        this.afs
          .doc<any>("users/" + this.afAuth.auth.currentUser.uid)
          .update({ walkthrough: temp });
        unsub.unsubscribe();
      }
    });
  }

  ionViewWillEnter() {
    this.geolocation
      .getCurrentPosition({
        maximumAge: 3000,
        timeout: 5000,
        enableHighAccuracy: true
      })
      .then(res => {
        let options: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 5
        };
        this.nativeGeocoder
          .reverseGeocode(
            res.coords.latitude,
            res.coords.longitude,
            options
          )
          .then((result: NativeGeocoderResult[]) => {
            const addressData = {
              address: {
                main: result[3].thoroughfare,
                sub:
                  result[3].subLocality +
                  "," +
                  result[3].subAdministrativeArea +
                  "," +
                  result[3].countryName
              },
              latitude: result[3].latitude,
              longitude: result[3].longitude
            };
            localStorage.setItem(
              "currentLocation",
              JSON.stringify(addressData)
            );
            localStorage.setItem(
              "selectedLocation",
              JSON.stringify(addressData)
            );
          })
          .catch((error: any) => console.log(error));
      })
      .catch(err => {
        console.log("err", err);
      });
  }
}
