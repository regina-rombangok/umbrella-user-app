import { Geolocation } from '@ionic-native/geolocation/ngx';
import { map } from 'rxjs/operators/map';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilService } from './Provider/Util/util.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApiService } from './Provider/Api/api.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { Component, QueryList, ViewChildren } from '@angular/core';

import {
  Platform,
  NavController,
  IonRouterOutlet,
  AlertController,
  MenuController
} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import {
  NativeGeocoder,
  NativeGeocoderOptions,
  NativeGeocoderResult
} from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  users: any;
  appPages: any = [
    {
      title: 'Home',
      url: '/home',
      icon: 'ios-home'
    },
    {
      title: 'My Bookings',
      url: '/orders',
      icon: 'ios-card'
    },
    {
      title: 'Profile',
      url: '/editprofile',
      icon: 'ios-person'
    },
    {
      title: 'On Going Bookings',
      url: '/view-on-going-jobs',
      icon: 'ios-car'
    },
    {
      title: 'Coupons',
      url: '/promo-code',
      icon: 'ios-car'
    },
    {
      title: 'Notifications',
      url: '/notification',
      icon: 'ios-notifications'
    },
    {
      title: 'Privacy Policy',
      url: '/privacyPolicy',
      icon: 'ios-lock'
    },
    {
      title: 'About Us',
      url: '/aboutUs',
      icon: 'ios-paper'
    },
    {
      title: "FAQ's",
      url: '/faq',
      icon: 'ios-help-circle'
    }
  ];
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  requestId: any;
  userKey: any;
  isComplete: boolean = false;
  unsubRequest: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FCM,
    private navCtrl: NavController,
    private afAugh: AngularFireAuth,
    private api: ApiService,
    public router: Router,
    public alertController: AlertController,
    private afs: AngularFirestore,
    private util: UtilService,
    private menu: MenuController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder
  ) {
    this.userKey = localStorage.getItem('userKey');
    if (this.userKey) {
      this.navCtrl.navigateRoot('/home');
    }

    this.afAugh.auth.onAuthStateChanged(
      (res: any) => {
        if (res) {
          let user = this.afAugh.auth.currentUser;
          if (user) {
            if (user.emailVerified) {
              this.menu.enable(true);
              this.userKey = res.uid;
              this.navCtrl.navigateRoot('/home');
              this.api
                .getDocumnet(`users/${res.uid}`)
                .subscribe((data: any) => {
                  this.users = data;
                  this.api.walkthrough.next(data.walkthrough);
                });

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
                            ',' +
                            result[3].subAdministrativeArea +
                            ',' +
                            result[3].countryName
                        },
                        latitude: result[3].latitude,
                        longitude: result[3].longitude
                      };
                      localStorage.setItem(
                        'currentLocation',
                        JSON.stringify(addressData)
                      );
                      localStorage.setItem(
                        'selectedLocation',
                        JSON.stringify(addressData)
                      );
                    })
                    .catch((error: any) => console.log(error));
                })
                .catch(err => {
                  console.log('err', err);
                });

              if (this.userKey) {
                this.unsubRequest = this.afs
                  .collection('requests', res =>
                    res
                      .where('uId', '==', this.userKey)
                      .where('requestStatus', '==', 7)
                      .where('rating.user', '==', false)
                      .where('isUserDone', '==', false)
                  )
                  .snapshotChanges()
                  .pipe(
                    map(actions =>
                      actions.map(a => {
                        const data = a.payload.doc.data();
                        const id = a.payload.doc.id;
                        return { id, ...data };
                      })
                    )
                  )
                  .subscribe(
                    (res: any) => {
                      if (res.length > 0) {
                        let setUnsub = this.afs
                          .collection('/setting')
                          .snapshotChanges()
                          .pipe(
                            map(actions =>
                              actions.map(a => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                return { id, ...data };
                              })
                            )
                          )
                          .subscribe((setRes: any) => {
                            if (
                              this.distance(
                                setRes[0].lat,
                                setRes[0].lang,
                                res[0].user_LatLng.lat,
                                res[0].user_LatLng.lng,
                                'K'
                              ) < setRes[0].radius
                            ) {
                              let comAmo =
                                (parseFloat(res[0].finalTotal) *
                                  parseFloat(setRes[0].commission)) /
                                100;
                              let commision = {
                                amount: comAmo,
                                bookingId: res[0].id,
                                freelancerId: res[0].freelancerId,
                                time: new Date(),
                                payMethod: res[0].payMethod
                              };
                              this.afs
                                .collection('commission')
                                .add(commision)
                                .then(addRes => {
                                  this.api.updateDocument(
                                    `requests/${res[0].id}`,
                                    {
                                      isUserDone: true
                                    }
                                  );
                                  setUnsub.unsubscribe();
                                })
                                .catch(err => {
                                  console.log('err', err);
                                });
                            }
                          });
                        if (this.isComplete === false) {
                          this.isComplete = true;
                          this.presentCompleteAlert(
                            'Beautician has completed job ' + res[0].orderId,
                            res[0].id
                          );
                        }
                      }
                    },
                    err => {
                      console.log('err', err);
                    }
                  );
              }
            }
            // else {
            //   this.util.presentAlert(
            //     'Your Email is Not Verify. Check Your Email and Verify'
            //   );
            //   // user.sendEmailVerification();
            //   this.logOut();
            // }
          }
        } else {
          this.navCtrl.navigateRoot('/starter');
          this.userKey = '';
        }
      },
      err => {
        this.userKey = '';
        this.unsubRequest.unsubscribe();
        console.log('err', err);
      }
    );
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
    });

    this.fcm.subscribeToTopic('notification');

    this.fcm.getToken().then(token => {
      localStorage.setItem('deviceToken', token);
    });

    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        // console.log('Received in background', data);
      } else {
        // console.log('Received in foreground', data);
      }
      const reqData = this.api
        .getDocumnet(`requests/${data.requestId}`)
        .subscribe((res: any) => {
          if (res.requestStatus === 5) {
            this.util.presentAlert(
              'Beautician has arrived at your location for job ' + res.orderId
            );
          } else if (res.requestStatus === 6) {
            this.util.presentAlert('Beautician has started job ' + res.orderId);
          } else if (res.requestStatus === 7 && res.rating.user === false) {
            // this.afs
            //   .collection('/setting')
            //   .snapshotChanges()
            //   .pipe(
            //     map(actions =>
            //       actions.map(a => {
            //         const data = a.payload.doc.data();
            //         const id = a.payload.doc.id;
            //         return { id, ...data };
            //       })
            //     )
            //   )
            //   .subscribe((setRes: any) => {
            //     let comAmo =
            //       (parseFloat(res.finalTotal) *
            //         parseFloat(setRes[0].commission)) /
            //       100;
            //     let commision = {
            //       amount: comAmo,
            //       bookingId: res.id,
            //       freelancerId: res.freelancerId,
            //       time: new Date(),
            //       payMethod: res.payMethod
            //     };
            //     this.afs
            //       .collection('coomstiopn')
            //       .add(commision)
            //       .then(addRes => {
            //         console.log('commision add id', addRes);
            //       })
            //       .catch(err => {
            //         console.log('err', err);
            //       });
            //   });
            // this.api.updateDocument(`requests/${}`)
            // this.presentCompleteAlert(
            //   'Beautician has completed job ' + res.orderId,
            //   data.requestId
            // );
          }
          reqData.unsubscribe();
        });
    });
    this.fcm.unsubscribeFromTopic('notification');
    this.backButtonEvent();
  }

  async presentCompleteAlert(msg, id) {
    const alert = await this.alertController.create({
      message: msg,
      cssClass: 'confirm-alery',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.api.parseData = id;
            this.isComplete = false;
            this.navCtrl.navigateForward('/ratting');
          }
        }
      ]
    });
    await alert.present();
  }
  distance(lat1, lon1, lat2, lon2, unit) {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === 'K') {
      dist = dist * 1.609344;
    }
    if (unit === 'N') {
      dist = dist * 0.8684;
    }
    // console.log('distabce', Number(dist).toFixed(2));
    return Number(dist).toFixed(2);
  }
  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        } else if (
          this.router.url === '/home' ||
          this.router.url === '/starter' ||
          this.router.url === 'home' ||
          this.router.url === 'starter'
        ) {
          navigator['app'].exitApp();
        }
      });
    });
  }
  logOut() {
    localStorage.removeItem('userKey');
    this.userKey = '';
    this.unsubRequest.unsubscribe();
    this.afAugh.auth.signOut();
    this.navCtrl.navigateRoot('/starter');
  }
}
