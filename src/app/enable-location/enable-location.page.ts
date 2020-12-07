import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-enable-location',
  templateUrl: './enable-location.page.html',
  styleUrls: ['./enable-location.page.scss']
})
export class EnableLocationPage implements OnInit {
  constructor(
    public modalController: ModalController,
    private androidPermissions: AndroidPermissions
  ) { }

  ngOnInit() { }
  done() {
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
      .then(
        result => {
          if (result.hasPermission) {
            this.modalController.dismiss();
          } else {
            this.androidPermissions
              .requestPermission(
                this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
              )
              .then(res => {
                this.androidPermissions
                  .checkPermission(
                    this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
                  )
                  .then(result => {
                    if (result.hasPermission) {
                      this.modalController.dismiss();
                    }
                  });
              });
          }
        },
        err => {
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
          );
        }
      );
  }
}
