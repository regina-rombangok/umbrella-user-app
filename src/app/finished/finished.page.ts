import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-finished',
  templateUrl: './finished.page.html',
  styleUrls: ['./finished.page.scss']
})
export class FinishedPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    public modalController: ModalController
  ) { }

  ngOnInit() { }

  doComplte() {
    this.modalController.dismiss();
    this.navCtrl.navigateRoot('/home');
  }
}
