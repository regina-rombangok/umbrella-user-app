import { NavController, MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-in-option',
  templateUrl: './sign-in-option.page.html',
  styleUrls: ['./sign-in-option.page.scss']
})
export class SignInOptionPage implements OnInit {
  constructor(private nav: NavController, private menu: MenuController) {
    this.menu.enable(false);
  }

  ngOnInit() { }

  signIn() {
    this.nav.navigateForward('sign-in-option');
  }

  signInEmail() {
    this.nav.navigateForward('sign-in');
  }
  signInPhone() {
    this.nav.navigateForward('sign-in-phone');
  }
}
