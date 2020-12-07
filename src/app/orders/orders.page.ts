import { ApiService } from './../Provider/Api/api.service';
import { UtilService } from './../Provider/Util/util.service';
import { map } from 'rxjs/operators/map';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss']
})
export class OrdersPage implements OnInit {
  segmentState: any = 1;
  orderList: any;
  statusData: any = {
    pending: 0,
    complete: 0,
    cancel: 0
  };
  currenctyType: any;
  constructor(
    private afAuth: AngularFireAuth,
    private nav: NavController,
    private afs: AngularFirestore,
    private util: UtilService,
    private api: ApiService
  ) {
    this.api.getCollection('setting').subscribe((res: any) => {
      this.currenctyType = res[0].currency;
    });
    this.util.presentLoading();
    const catSub = this.afs
      .collection('requests', ref =>
        ref
          .where('uId', '==', this.afAuth.auth.currentUser.uid)
          .where('requestStatus', '>=', 1)
          .where('requestStatus', '<=', 7)
      )
      .snapshotChanges()
      .pipe(
        map((actions: any) =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        ),
        map(res =>
          res.filter((r: any) => {
            if (r.requestStatus !== 2) {
              return r;
            }
          })
        ),
        map((actions: any) =>
          actions.map(a => {
            a.services.forEach(element => {
              element.price = parseFloat(element.price).toFixed(2);
            });

            let mainTotal = 0;
            if (parseFloat(a.additionalCharges) > 0) {
              mainTotal =
                parseFloat(a.finalTotal) + parseFloat(a.additionalCharges);
            } else {
              mainTotal = parseFloat(a.finalTotal);
            }
            a.mainTotal = Number(mainTotal).toFixed(2);
            return a;
          })
        )
      )
      .subscribe(
        res => {
          this.statusData = {
            pending: 0,
            complete: 0,
            cancel: 0
          };
          this.util.dismissLoader();
          this.orderList = res;
          this.orderList.sort((a, b) => {
            return (
              b.timeLine.requestedDate.toDate() -
              a.timeLine.requestedDate.toDate()
            );
          });

          _.map(this.orderList, r => {
            if (r.requestStatus == 7) {
              this.statusData.complete++;
            } else if (r.requestStatus == 9) {
              this.statusData.cancel++;
            } else if (r.requestStatus != 2 && r.requestStatus < 7) {
              this.statusData.pending++;
            }
          });
        },
        err => {
          this.util.dismissLoader();
          console.log('err', err);
        }
      );
  }

  ngOnInit() { }

  goBack() {
    this.nav.back();
  }

  goHome() {
    this.nav.navigateRoot('/home');
  }
  viewDetailOrder(id) {
    this.api.parseData = id;
    this.nav.navigateForward('/order-detail');
  }
}
