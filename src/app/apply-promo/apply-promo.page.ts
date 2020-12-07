import { map } from 'rxjs/operators/map';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilService } from './../Provider/Util/util.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apply-promo',
  templateUrl: './apply-promo.page.html',
  styleUrls: ['./apply-promo.page.scss']
})
export class ApplyPromoPage implements OnInit {
  couponCode: any;
  couponList: any;
  errMsg: any;
  constructor(
    private modalController: ModalController,
    private afs: AngularFirestore
  ) {
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
      .subscribe(res => {
        this.couponList = res;
      });
  }

  ngOnInit() { }

  close() {
    this.modalController.dismiss();
  }
  doApplyCode() {
    if (this.couponCode) {
      this.couponList.forEach(element => {
        if (element.code === this.couponCode) {
          this.modalController.dismiss(element);
          this.errMsg = '';
        } else {
          this.errMsg = 'Coupon Code Not Metch';
        }
      });
    } else {
      this.errMsg = 'Coupon Code required';
    }
  }
}
