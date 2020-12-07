import { UtilService } from './../Provider/Util/util.service';
import { ApiService } from './../Provider/Api/api.service';
import { map } from 'rxjs/operators/map';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-on-going-jobs',
  templateUrl: './view-on-going-jobs.page.html',
  styleUrls: ['./view-on-going-jobs.page.scss']
})
export class ViewOnGoingJobsPage implements OnInit {
  jobList$: Observable<any[]>;
  userKey: any;
  constructor(
    private navCtrl: NavController,
    private afs: AngularFirestore,
    private api: ApiService,
    private util: UtilService
  ) {
    this.userKey = localStorage.getItem('userKey');
    this.util.presentLoading();
    this.jobList$ = this.afs
      .collection('requests', ref =>
        ref
          .where('uId', '==', this.userKey)
          .where('requestStatus', '>=', 1)
          .where('requestStatus', '<=', 6)
      )
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        ),
        map(res =>
          res.filter((r: any) => {
            if (r.requestStatus != 2) {
              return r;
            }
          })
        ),
        map(actions =>
          actions.map((a: any) => {
            a.freelancerData = this.afs
              .doc(`users/${a.freelancerId}`)
              .valueChanges();
            return a;
          })
        ),
        map(actions =>
          actions.map((a: any) => {
            let ratSub = this.afs
              .collection('rating', ref =>
                ref
                  .where('review_by', '==', 'user')
                  .where('freelancer_id', '==', a.freelancerId)
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
                    totalStart += ele.star;
                  });
                  a.totalReview = res.length;
                  if (res.length > 0) {
                    a.everageStart = totalStart / res.length;
                  } else {
                    a.everageStart = 0;
                  }
                  ratSub.unsubscribe();
                },
                err => {
                  console.log('err', err);
                }
              );
            return a;
          })
        )
      );
    this.jobList$.subscribe(
      res => this.util.dismissLoader(),
      err => this.util.dismissLoader()
    );
  }

  ngOnInit() {}

  goToHome() {
    this.navCtrl.navigateRoot('/home');
  }
  viewDetail(id) {
    this.api.parseData = id;
    this.navCtrl.navigateForward('/jobinprocess');
  }
}
