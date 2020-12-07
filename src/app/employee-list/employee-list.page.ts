import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { EnableLocationPage } from './../enable-location/enable-location.page';
import { AngularFireAuth } from '@angular/fire/auth';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { map } from 'rxjs/operators/map';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilService } from './../Provider/Util/util.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../Provider/Api/api.service';
import { NavController, ModalController } from '@ionic/angular';
declare var google;
import introJs from 'intro.js/intro.js';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.page.html',
  styleUrls: ['./employee-list.page.scss']
})
export class EmployeeListPage implements OnInit {
  activeType: any = 'list';
  employeeList: any;
  userAddress: any;
  distanceLength: any;
  showDetail: boolean = false;
  singleInfo: any = {};
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  map: any;
  constructor(
    private api: ApiService,
    private util: UtilService,
    private navCtrl: NavController,
    private afs: AngularFirestore,
    private geolocation: Geolocation,
    private afAuth: AngularFireAuth,
    public modalController: ModalController,
    private androidPermissions: AndroidPermissions
  ) {
    this.employeeList = [];
    this.getCurrentLocation();
    const settingSub = this.api.getCollection('setting').subscribe(
      (res: any) => {
        this.distanceLength = res[0].radius;
        settingSub.unsubscribe();
      },
      err => {

      }
    );

    this.userAddress = JSON.parse(localStorage.getItem('selectedLocation'));
    this.util.presentLoading();
    const selEmp = this.afs
      .collection('users', ref =>
        ref.where('roll', '==', 1).where('flag', '==', true)
      )
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        ),
        map(actions =>
          actions.map((a: any) => {
            a.loaded = false;
            return a;
          })
        )
      );
    selEmp.subscribe(
      (res: any) => {
        this.employeeList = [];
        res.forEach(element => {
          if (element.providedServices.length > 0) {
            let leg: any;
            if (this.api.parseData.selectService.length > 0) {
              leg = this.api.parseData.selectService.length;
              this.api.parseData.selectService.forEach(element1 => {
                element.providedServices.filter((res: any) => {
                  if (res.id === element1.id) {
                    leg--;
                  }
                  if (leg === 0) {
                    this.employeeList.push(element);
                    leg = '';
                  }
                });
              });
            }
          }
        });
        const data = [];
        this.employeeList.forEach((res: any) => {

          if (
            this.distance(
              this.userAddress.latitude,
              this.userAddress.longitude,
              res.lat,
              res.long,
              'K'
            )
          ) {
            res.distance = this.distance(
              this.userAddress.latitude,
              this.userAddress.longitude,
              res.lat,
              res.long,
              'K'
            );
            let state = false;
            data.forEach(r => {
              if (r.id === res.id) {
                state = true;
              }
            });
            if (state === false) {
              data.push(res);
            }
          }
        });

        this.employeeList = data;
        this.employeeList.sort(
          (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
        );
        this.employeeList.forEach(element => {
          const ratSub = this.afs
            .collection('rating', ref =>
              ref
                .where('review_by', '==', 'user')
                .where('freelancer_id', '==', element.id)
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
                let totalStart = 0;
                res.forEach((ele: any) => {
                  totalStart += ele.star;
                });
                element.totalReview = res.length;
                if (res.length > 0) {
                  element.everageStart = totalStart / res.length;
                  element.everageStart = parseInt(element.everageStart);
                } else {
                  element.everageStart = 0;
                }
                ratSub.unsubscribe();
              },
              err => {
                console.log('err', err);
              }
            );
        });
        this.setEmployeePosition();
        this.util.dismissLoader();
      },
      err => {
        this.util.dismissLoader();
        console.log('err', err);
      }
    );
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

    return Number(dist).toFixed(2);
  }
  ngOnInit() { }
  ionViewDidEnter() {
    const unsub = this.api.walkthrough.subscribe((res: any) => {
      if (res.freelancerList === true) {
        setTimeout(() => {
          const intro = introJs.introJs();
          intro.setOptions({
            steps: [
              {
                element: '#step10',
                intro: 'Display Freelancer in List.',
                position: 'bottom'
              },
              {
                element: '#step11',
                intro: 'Display Freelancer in Map.',
                position: 'bottom'
              },
              {
                intro: 'Select Freelancer.'
              }
            ]
          });
          intro.start();
          intro.oncomplete(() => {
            const temp: any = {
              Home: res.Home,
              Service: res.Service,
              freelancerList: false
            };
            this.afs
              .doc<any>('users/' + this.afAuth.auth.currentUser.uid)
              .update({ walkthrough: temp });
          });
        }, 400);
        unsub.unsubscribe();
      }
    });
  }
  setEmployeePosition() {
    const markerIcon = {
      url: '../../assets/img/pin-image.png',
      labelOrigin: new google.maps.Point(25, 63),
      scaledSize: new google.maps.Size(56, 64)
    };
    this.employeeList.forEach((element: any, index) => {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(element.lat, element.long),
        map: this.map,
        icon: markerIcon,
        label: {
          text: element.surname + ' ' + element.name,
          data: element,
          fontSize: '12px',
          fontFamily: 'tofini_medium',
          width: '30px'
        }
      });
      const that = this;
      marker.addListener('click', function () {
        that.singleInfo = this.label.data;
        that.showDetail = true;
      });
    });
  }
  getCurrentLocation() {
    if (this.activeType == 'map') {
      this.androidPermissions
        .checkPermission(
          this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
        )
        .then(
          result => {
            if (result.hasPermission) {
              this.geolocation
                .getCurrentPosition()
                .then(resp => {
                  const latlng = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                  };
                  this.initMap(latlng);
                  this.map.setCenter(
                    new google.maps.LatLng(
                      resp.coords.latitude,
                      resp.coords.longitude
                    )
                  );
                  const markerIconCurrent = {
                    url: '../../assets/img/nevigation-icon.gif',
                    scaledSize: new google.maps.Size(26, 26),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(13, 13)
                  };
                  const latLng = new google.maps.LatLng(
                    resp.coords.latitude,
                    resp.coords.longitude
                  );
                  const marker4 = new google.maps.Marker({
                    position: latLng,
                    map: this.map,
                    icon: markerIconCurrent
                  });

                  const circle = new google.maps.Circle({
                    map: this.map,
                    radius: 10,
                    fillColor: '#007AFF',
                    strokeWeight: 0,
                    fillOpacity: 0.1
                  });
                  circle.bindTo('center', marker4, 'position');
                })
                .catch(error => {
                  console.log('Error getting location', error);
                });
            } else {
              this.enableLocation();
            }
          },
          err => {
            this.enableLocation();
          }
        );
    }
  }
  async enableLocation() {
    const modal = await this.modalController.create({
      component: EnableLocationPage,
      cssClass: 'enableLocation-modal'
    });
    modal.onDidDismiss().then(() => {
      this.androidPermissions
        .checkPermission(
          this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
        )
        .then(
          result => {
            if (result.hasPermission) {
              this.getCurrentLocation();
            } else {
              this.enableLocation();
            }
          },
          err => {
            this.enableLocation();
          }
        );
    });
    return await modal.present();
  }

  loadMap() {

    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        const latlng = {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude
        };
        this.initMap(latlng);
        this.map.setCenter(
          new google.maps.LatLng(
            resp.coords.latitude,
            resp.coords.longitude
          )
        );
        const markerIconCurrent = {
          url: '../../assets/img/nevigation-icon.gif',
          scaledSize: new google.maps.Size(26, 26),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(13, 13)
        };
        const latLng = new google.maps.LatLng(
          resp.coords.latitude,
          resp.coords.longitude
        );
        const marker4 = new google.maps.Marker({
          position: latLng,
          map: this.map,
        });


        const circle = new google.maps.Circle({
          map: this.map,
          radius: 10,
          fillColor: '#007AFF',
          strokeWeight: 0,
          fillOpacity: 0.1
        });
        circle.bindTo('center', marker4, 'position');
      })
      .catch(error => {
        console.log('Error getting location', error);
      });
  }

  initMap(latlng) {
    const latLng = new google.maps.LatLng(latlng.lat, latlng.lng);
    const mapoption = {
      center: latLng,
      zoom: 15,
      streetViewControl: false,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapoption);
  }
  goBack() {
    this.navCtrl.back();
  }
  viewDetail(uid) {
    this.api.parseData.employeeID = uid;
    this.showDetail = false;
    this.navCtrl.navigateForward('/employee-detail');
  }

  ionViewWillLeave() {
    const unsub = this.api.walkthrough.subscribe((res: any) => {
      if (res.freelancerList === true) {
        const temp: any = {
          Home: res.Home,
          Service: res.Service,
          freelancerList: false
        };
        this.afs
          .doc<any>('users/' + this.afAuth.auth.currentUser.uid)
          .update({ walkthrough: temp });
        unsub.unsubscribe();
      }
    });
  }
}
