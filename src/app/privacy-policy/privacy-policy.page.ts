import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {
  data: any;
  constructor(private nav: NavController, private afs: AngularFirestore) {
    this.afs.collection('moreSetting').doc(`${'IJ2gZiWf46mGgBS80nF9'}`).valueChanges().subscribe((res: any) => {
      this.data = res.PP
    })
  }

  ngOnInit() {
  }


  goHome() { this.nav.navigateRoot('home') }

}
