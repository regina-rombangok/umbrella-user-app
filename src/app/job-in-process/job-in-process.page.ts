import { UtilService } from './../Provider/Util/util.service';
import { ApiService } from './../Provider/Api/api.service';
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
declare var window;

@Component({
  selector: 'app-job-in-process',
  templateUrl: './job-in-process.page.html',
  styleUrls: ['./job-in-process.page.scss']
})
export class JobInProcessPage implements OnInit {
  requestData: any = {};
  jobKey: any;
  currenctyType: any;
  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private afs: AngularFirestore,
    private api: ApiService,
    private util: UtilService
  ) {
    this.jobKey = this.api.parseData;
    this.api.getCollection('setting').subscribe((res: any) => {
      this.currenctyType = res[0].currency;
    });
    this.util.presentLoading();
    this.afs
      .collection('requests')
      .doc(`${this.jobKey}`)
      .valueChanges()
      .subscribe(
        (res: any) => {
          this.requestData = res;
          let edata = this.afs
            .doc(`users/${res.freelancerId}`)
            .valueChanges()
            .subscribe(
              eres => {
                this.requestData.freelancerData = eres;
                edata.unsubscribe();
              },
              eerr => {
                console.log('err', eerr);
              }
            );
          this.util.dismissLoader();
        },
        err => {
          this.util.dismissLoader();
          console.log('err', err);
        }
      );
  }

  ngOnInit() { }

  mailto(email) {
    window.open(`mailto:${email}`, '_system');
  }
  goBack() {
    this.navCtrl.back();
  }
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Additional Charges ?',
      inputs: [
        {
          name: 'extra',
          type: 'text',
          placeholder: 'Extra charges to add'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.navCtrl.navigateRoot('home');
          }
        },
        {
          text: 'Add',
          handler: res => {
            this.afs
              .doc<any>('requests/' + this.requestData.id)
              .update({
                additionalCharges: res.extra,
                jobCompleteDate: this.requestData.timeLine.jobCompleteDate
              })
              .then(res => {
                this.navCtrl.navigateRoot('home');
              });
          }
        }
      ]
    });
    await alert.present();
  }
  tarckLocation() {
    this.api.parseData = this.jobKey;
    this.navCtrl.navigateForward('/mapView');
  }
}
