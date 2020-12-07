import { NavController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accept-request',
  templateUrl: './accept-request.page.html',
  styleUrls: ['./accept-request.page.scss']
})
export class AcceptRequestPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private modalController: ModalController
  ) { }

  ngOnInit() { }
  doCancel() {
    this.modalController.dismiss();
    this.navCtrl.navigateRoot('/home');
  }
  viewOnGoingJob() {
    this.modalController.dismiss();
    this.navCtrl.navigateRoot('/view-on-going-jobs');
  }
}
