import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { LocationAddressPage } from './../location-address/location-address.page';
import { map } from 'rxjs/operators/map';
import { UtilService } from './../Provider/Util/util.service';
import { ApiService } from './../Provider/Api/api.service';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import introJs from 'intro.js/intro.js';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.page.html',
  styleUrls: ['./service-list.page.scss']
})
export class ServiceListPage implements OnInit {
  qty: any = 1;
  categoryData: any;
  serviceList: any;
  segmentState: number = 1;
  selectedService: any = [];
  mainArray: any = [];
  currenctyType: any;
  isData: any = {
    adults: false,
    kiddie: false,
    teens: false
  };
  constructor(
    private api: ApiService,
    private util: UtilService,
    private modalController: ModalController,
    private navCtrl: NavController,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.categoryData = this.api.parseData;
    this.api.getCollection('setting').subscribe((res: any) => {
      this.currenctyType = res[0].currency;
    });
    this.getServiceList();
  }

  getServiceList() {
    this.util.presentLoading();
    this.api
      .getQueryCollection(
        'subCategory',
        'categoryId',
        '==',
        this.categoryData.id
      )
      .pipe(
        map(res =>
          res.map((action: any) => {
            if (action.status == '0') {
              action.checked = false;
              action.loaded = false;
              return action;
            }
          })
        )
      )
      .subscribe(
        res => {
          this.util.dismissLoader();
          this.serviceList = res;
          this.serviceList.sort((a, b) => {
            if (a.name.toLowerCase().trim() < b.name.toLowerCase().trim()) {
              return -1;
            }
            if (a.name.toLowerCase().trim() > b.name.toLowerCase().trim()) {
              return 1;
            }
            return 0;
          });
          this.serviceList.forEach(element => {
            if (element.serviceType == 'student') {
              this.isData.teens = true;
            } else if (element.serviceType == 'kiddie') {
              this.isData.kiddie = true;
            } else if (element.serviceType == 'individual') {
              this.isData.adults = true;
            }
            element.price = parseFloat(element.price).toFixed(2);
          });
        },
        err => this.util.dismissLoader()
      );
  }

  ngOnInit() { }

  ionViewDidEnter() {
    const unsub = this.api.walkthrough.subscribe((res: any) => {
      if (res.Service === true) {
        setTimeout(() => {
          const intro = introJs.introJs();
          intro.setOptions({
            steps: [
              {
                element: '#step4',
                intro: 'Click here to Move Back.',
                position: 'bottom'
              },
              {
                element: '#step5',
                intro: 'Click Location and set Address.',
                position: 'bottom'
              },
              {
                element: '#step6',
                intro: 'Select Adults Service.',
                position: 'bottom'
              },
              {
                element: '#step7',
                intro: 'Select Kiddie Service.',
                position: 'bottom'
              },
              {
                element: '#step8',
                intro: 'Select Teens Service.',
                position: 'bottom'
              },
              {
                element: '#step9',
                intro: 'Click Next and Select Freelancer.',
                position: 'bottom'
              }
            ]
          });
          intro.start();
          intro.oncomplete(() => {
            const temp: any = {
              Home: res.Home,
              Service: false,
              freelancerList: res.freelancerList
            };
            this.afs
              .doc<any>('users/' + this.afAuth.auth.currentUser.uid)
              .update({ walkthrough: temp });
          });
          unsub.unsubscribe();
        }, 400);
      }
    });
  }
  async chnageAddress() {
    const modal = await this.modalController.create({
      component: LocationAddressPage
    });
    return await modal.present();
  }

  goBack() {
    this.navCtrl.back();
  }

  serviceToggle(data) {
    data.checked = !data.checked;
    if (data.checked) {
      this.mainArray.push(data);
    } else {
      this.mainArray.forEach((element: any, index) => {
        if (element.id === data.id) {
          this.mainArray.splice(index, 1);
        }
      });
    }
  }
  doNext() {
    this.api.parseData = {
      categoryData: this.categoryData,
      selectService: this.mainArray
    };
    if (this.mainArray.length > 0) {
      if (JSON.parse(localStorage.getItem('selectedLocation')) != undefined) {
        this.navCtrl.navigateForward('/employee-list');
      } else {
        this.util.presentToast('Set Your Address');
      }
    } else {
      this.util.presentToast('Select Service');
    }
  }
  ionViewWillLeave() {
    const unsub = this.api.walkthrough.subscribe((res: any) => {
      if (res.Service === true) {
        const temp: any = {
          Home: res.Home,
          Service: false,
          freelancerList: res.freelancerList
        };
        this.afs
          .doc<any>('users/' + this.afAuth.auth.currentUser.uid)
          .update({ walkthrough: temp });

        unsub.unsubscribe();
      }
    });
  }
}
