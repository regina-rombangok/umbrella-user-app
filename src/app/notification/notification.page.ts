import { map } from 'rxjs/operators/map';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ApiService } from './../Provider/Api/api.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilService } from '../Provider/Util/util.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss']
})
export class NotificationPage implements OnInit {
  noti: any;
  constructor(
    private nav: NavController,
    private api: ApiService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private util: UtilService
  ) {
    this.util.presentLoading();
    this.afs
      .collection('notification', ref =>
        ref.where('receiver', '==', this.afAuth.auth.currentUser.uid)
      )
      .snapshotChanges()
      .pipe(
        map((actions: any) =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      )
      .subscribe(
        (res: any) => {
          this.util.dismissLoader();
          this.noti = res;
          this.noti.sort((a, b) => b.dateTime.toDate() - a.dateTime.toDate());
          _.map(this.noti, r => {
            this.afs
              .collection('users')
              .doc(`${r.sender}`)
              .valueChanges()
              .subscribe((profile: any) => {
                r.data = profile;
              });
          });
        },
        err => {
          this.util.dismissLoader();
        }
      );
  }

  ngOnInit() { }

  back() {
    this.nav.back();
  }
  goHome() {
    this.nav.navigateRoot('/home');
  }
}
