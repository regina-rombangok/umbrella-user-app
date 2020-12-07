import { AngularFireAuth } from "@angular/fire/auth";
import { UtilService } from "./../Provider/Util/util.service";
import { ApiService } from "./../Provider/Api/api.service";
import { Component, OnInit } from "@angular/core";
import { NavController, MenuController } from "@ionic/angular";
declare var google;

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"]
})
export class SignupPage implements OnInit {
  service = new google.maps.places.AutocompleteService();
  autocompleteItems = [];
  categories: any = [];
  data: any = {};
  geocoder = new google.maps.Geocoder();

  constructor(
    private api: ApiService,
    private util: UtilService,
    private navCtrl: NavController,
    private menu: MenuController,
    private afAugh: AngularFireAuth
  ) {
    this.menu.enable(false);
    this.data.roll = 2;
    this.data.flag = false;
    this.data.disable = false;
    this.data.adminStatus = true;
    this.data.token = localStorage.getItem("deviceToken");
    this.data.walkthrough = {
      Home: true,
      Service: true,
      freelancerList: true
    };
    this.data.image =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png";
    this.data.signThrough = "EMAIL";
  }

  ngOnInit() {}

  autoAddress(text) {
    if (text == "") {
      this.autocompleteItems = [];
      return false;
    }
    let me = this;
    this.service.getPlacePredictions(
      {
        input: text
      },
      (predictions, status) => {
        me.autocompleteItems = [];
        if (predictions != null) {
          predictions.forEach(prediction => {
            me.autocompleteItems.push(prediction);
          });
        }
      }
    );
  }

  chooseItem(item: any) {
    let myFullAddress = item.terms;

    let fullText = "";

    for (let index = 0; index < myFullAddress.length; index++) {
      // for (let index = 0; index < (myFullAddress.length > 2 ? myFullAddress.length - 2 : myFullAddress.length); index++) {
      const element = myFullAddress[index];
      if (index == 0) {
        fullText += element.value;
      } else {
        fullText += " " + element.value;
      }
    }

    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === "OK" && results[0]) {
        this.data.lat = results[0].geometry.location.lat();
        this.data.long = results[0].geometry.location.lng();
      }
    });
    this.data.address = fullText;
    this.autocompleteItems = [];
  }

  signUp() {
    this.util.presentLoading();
    this.api
      .doRegister(this.data)
      .then(res => {
        this.util.dismissLoader();
        if (res[0] === true) {
          let user = this.afAugh.auth.currentUser;
          if (user) {
            user.sendEmailVerification();
            // console.log('sign up user', user);
            this.util.presentToast(
              "You have successfully registered. Check Your email And Verify"
            );
            localStorage.removeItem("userKey");
            this.afAugh.auth.signOut();
            this.navCtrl.navigateRoot("/starter");
          }
        }
      })
      .catch(err => {
        this.util.dismissLoader();
        this.util.presentAlert(err.message);
      });
  }

  signIn() {
    this.navCtrl.navigateRoot("/sign-in");
  }
}
