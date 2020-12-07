import { ImageModalPage } from './../image-modal/image-modal.page';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators/map';
import { UtilService } from './../Provider/Util/util.service';
import { ApiService } from './../Provider/Api/api.service';
import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.page.html',
  styleUrls: ['./employee-detail.page.scss']
})
export class EmployeeDetailPage implements OnInit {
  segmentState: any = 1;
  employeeId: any;
  employeeData: any;
  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService,
    private afs: AngularFirestore,
    public modalController: ModalController
  ) {
    this.employeeId = this.api.parseData.employeeID;
    this.util.presentLoading();
    this.api.getDocumnet(`users/${this.employeeId}`).subscribe(
      res => {
        this.employeeData = res;

        this.afs
          .collection('gallary', ref =>
            ref
              .where('status', '==', 'approvid')
              .where('freelancerId', '==', this.employeeId)
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
            res => {
              console.log('gallery reposne', res);
              this.employeeData.gallery = res;
            },
            err => {
              console.log('gallery err', err);
            }
          );

        let ratSub = this.afs
          .collection('rating', ref =>
            ref
              .where('review_by', '==', 'user')
              .where('freelancer_id', '==', this.employeeId)
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
            (res: any) => {
              let totalStart = 0;
              res.forEach((ele: any) => {
                this.api
                  .getDocumnet(`users/${ele.uid}`)
                  .subscribe((user: any) => {
                    ele.username = user.surname + ' ' + user.name;
                  });
                totalStart += ele.star;
              });
              this.employeeData.reviewData = res;
              if (res.length > 0) {
                this.employeeData.everageStart = totalStart / res.length;
              } else {
                this.employeeData.everageStart = 0;
              }
              ratSub.unsubscribe();
            },
            err => {
              console.log('err', err);
            }
          );
        this.util.dismissLoader();
      },
      err => {
        this.util.dismissLoader();
      }
    );
  }

  ngOnInit() { }
  goBack() {
    this.navCtrl.back();
  }
  openPreview(img, ind) {
    this.modalController
      .create({
        component: ImageModalPage,
        componentProps: {
          img: img,
          index: ind
        },
        cssClass: 'my-modal'
      })
      .then(modal => {
        modal.present();
      });
  }
  doBook() {
    this.api.parseData.employee_Location = {
      lat: this.employeeData.lat,
      long: this.employeeData.long
    };
    this.navCtrl.navigateForward('/cart');
  }
}
