import { UtilService } from './../Provider/Util/util.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators/map';
import { ApiService } from './../Provider/Api/api.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss']
})
export class OrderDetailPage implements OnInit {
  feedback: any;
  activeStar: number = 0;
  orderDetail: any = {};
  orderId: any;
  currenctyType: any;
  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private afs: AngularFirestore,
    private util: UtilService
  ) {
    this.orderId = this.api.parseData;
    this.api.getCollection('setting').subscribe((res: any) => {
      this.currenctyType = res[0].currency;
    });
    this.util.presentLoading();
    this.api.getDocumnet(`requests/${this.orderId}`).subscribe(
      (res: any) => {
        this.orderDetail = res;
        this.api
          .getDocumnet(`users/${res.freelancerId}`)
          .subscribe((fres: any) => {
            this.orderDetail.freelancerData = {
              name: fres.surname + ' ' + fres.name,
              image: fres.image
            };
          });
        let ratSub = this.afs
          .collection('rating', ref =>
            ref
              .where('review_by', '==', 'user')
              .where('freelancer_id', '==', res.freelancerId)
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
            (sres: any) => {
              let totalStart = 0;
              sres.forEach((ele: any) => {
                totalStart += ele.star;
              });
              if (sres.length > 0) {
                this.orderDetail.everageStart = totalStart / sres.length;
              } else {
                this.orderDetail.everageStart = 0;
              }
              ratSub.unsubscribe();
            },
            err => {
              console.log('err', err);
            }
          );
        this.orderDetail.services.forEach(element => {
          element.price = parseFloat(element.price).toFixed(2);
        });
        this.orderDetail.additionalCharges = parseFloat(
          this.orderDetail.additionalCharges
        ).toFixed(2);
        if (parseFloat(this.orderDetail.additionalCharges) > 0) {
          this.orderDetail.maintotal =
            parseFloat(this.orderDetail.finalTotal) +
            parseFloat(this.orderDetail.additionalCharges);
          this.orderDetail.maintotal = parseFloat(
            this.orderDetail.maintotal
          ).toFixed(2);
        } else {
          this.orderDetail.maintotal = parseFloat(
            this.orderDetail.finalTotal
          ).toFixed(2);
          this.orderDetail.maintotal = parseFloat(
            this.orderDetail.maintotal
          ).toFixed(2);
        }
        this.util.dismissLoader();
      },
      err => {
        this.util.dismissLoader();
        console.log('err', err);
      }
    );
  }

  ngOnInit() { }
  goBack() {
    this.navCtrl.back();
  }

  setStarValue(val: number) {
    if (this.activeStar === 1) {
      this.activeStar = 0;
    } else if (val === 0) {
      this.activeStar = 1;
    } else {
      this.activeStar = val;
    }
  }
  giveRating() {
    if (this.activeStar > 0) {
      let data = {
        uid: this.orderDetail.uId,
        freelancer_id: this.orderDetail.freelancerId,
        booking_id: this.orderId,
        star: this.activeStar,
        comment: this.feedback ? this.feedback : '',
        created_at: new Date(),
        review_by: 'user'
      };
      this.util.presentLoading();
      this.api
        .addCollection('rating', data)
        .then(res => {
          this.api.updateDocument(`requests/${this.orderId}`, {
            rating: {
              user: true,
              freelancer: this.orderDetail.rating.freelancer
            }
          });
          this.util.dismissLoader();
          this.util.presentToast('Rating Successfuly saved');
          this.navCtrl.navigateRoot('/orders');
        })
        .catch(err => {
          this.util.dismissLoader();
          console.log('err', err);
        });
    } else {
      this.util.presentToast('Please Select star rating');
    }
  }
}
