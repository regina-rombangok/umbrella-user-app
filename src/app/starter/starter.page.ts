import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.page.html',
  styleUrls: ['./starter.page.scss']
})
export class StarterPage implements OnInit {
  constructor(private nav: NavController, private menu: MenuController) {
    this.menu.enable(false);
  }

  ngOnInit() { }

  signIn() {
    this.nav.navigateForward('sign-in');
  }

  signUpEmail() {
    this.nav.navigateForward('sign-up');
  }

}
