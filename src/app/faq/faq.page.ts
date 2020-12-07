import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
  data: any;
  constructor(private nav: NavController, private afs: AngularFirestore) {
    this.afs.collection('FAQ').valueChanges().subscribe((res: any) => {
      this.data = res;
    })
  }

  ngOnInit() {
  }

  back() { this.nav.back() }

  goHome() { this.nav.navigateRoot('home') }


}
