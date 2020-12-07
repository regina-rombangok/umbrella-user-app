import { AngularFirestore } from '@angular/fire/firestore';
import { UtilService } from './../Provider/Util/util.service';
import { ApiService } from './../Provider/Api/api.service';
import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  NavController,
  ModalController,
  NavParams
} from '@ionic/angular';

@Component({
  selector: 'app-requesting',
  templateUrl: './requesting.page.html',
  styleUrls: ['./requesting.page.scss']
})
export class RequestingPage implements OnInit {
  requestId: any;
  requestData: any;
  constructor(
    public alertController: AlertController,
    private api: ApiService,
    private util: UtilService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private modalController: ModalController,
    private afs: AngularFirestore
  ) {
    this.requestId = this.navParams.get('id');
    this.api.getDocumnet(`requests/${this.requestId}`).subscribe(
      (res: any) => {
        this.requestData = res;
        if (
          res.requestStatus == 1 ||
          res.requestStatus == 2 ||
          res.requestStatus == 3
        ) {
          this.modalController.dismiss({ id: this.requestId });
        }
      },
      err => {
        console.log('err');
      }
    );
  }
  doRetry() {
    this.api.updateDocument(`requests/${this.requestId}`, {
      requestStatus: 0
    });
  }
  ngOnInit() { }
  async doClose() {
    const alert = await this.alertController.create({
      message: 'Do you want to cancel request?',
      cssClass: 'confirm-alery',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: blah => { }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.util.presentLoading();
            this.api
              .updateDocument(`requests/${this.requestId}`, {
                requestStatus: 2
              })
              .then(res => {
                this.afs
                  .collection('requests')
                  .doc(this.requestId)
                  .delete();
                this.util.dismissLoader();
                this.modalController.dismiss();
              })
              .catch(err => {
                this.util.dismissLoader();
                console.log('err', err);
              });
          }
        }
      ]
    });
    await alert.present();
  }
}
