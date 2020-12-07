import { NavController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { map } from 'rxjs/operators/map';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilService } from './../Provider/Util/util.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promo-code',
  templateUrl: './promo-code.page.html',
  styleUrls: ['./promo-code.page.scss']
})
export class PromoCodePage implements OnInit {
  coupnList: any;
  constructor(
    private util: UtilService,
    private afs: AngularFirestore,
    private clipboard: Clipboard,
    private navCtrl: NavController
  ) {
    this.util.presentLoading();
    this.afs
      .collection('package', res => res.where('qty', '>', '0'))
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
        res => {
          this.coupnList = res;
          this.util.dismissLoader();
        },
        err => {
          this.util.dismissLoader();
          console.log('err', err);
        }
      );
  }

  ngOnInit() { }

  copyCode(code) {
    this.clipboard.copy(code).then(res => {
      this.util.presentToast('Code Copy Successfully');
    });
  }
}
