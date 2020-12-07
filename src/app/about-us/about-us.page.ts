import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {
  data: any;
  constructor(private nav: NavController, private afs: AngularFirestore) {
    this.afs.collection('moreSetting').doc(`${'IJ2gZiWf46mGgBS80nF9'}`).valueChanges().subscribe((res: any) => {
      this.data = res.aboutUs;
    })
  }

  ngOnInit() {
  }

  back() { this.nav.back(); }

  goHome() { this.nav.navigateRoot('home'); }


}
