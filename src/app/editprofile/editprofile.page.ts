import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { UtilService } from './../Provider/Util/util.service';
import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import * as firebase from 'firebase';
declare var google;

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss']
})
export class EditprofilePage implements OnInit {
  service = new google.maps.places.AutocompleteService();
  autocompleteItems = [];
  categories: any = [];
  data: any = {};
  storageref = firebase.storage().ref();
  password: any;
  geocoder = new google.maps.Geocoder();
  constructor(
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private nav: NavController,
    private util: UtilService
  ) {
    this.afAuth.authState.subscribe((user: any) => {
      if (user) {
        this.afs
          .collection('users')
          .doc(`${user.uid}`)
          .valueChanges()
          .subscribe((profile: any) => {
            this.data = profile;
            this.data.uid = user.uid;
          });
      }
    });
  }

  ngOnInit() { }

  backPage() {
    this.nav.back();
  }

  autoAddress(text) {
    if (text == '') {
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
    let fullText = '';
    for (let index = 0; index < myFullAddress.length; index++) {
      const element = myFullAddress[index];
      if (index == 0) {
        fullText += element.value;
      } else {
        fullText += ' ' + element.value;
      }
    }
    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.data.lat = results[0].geometry.location.lat();
        this.data.long = results[0].geometry.location.lng();
      }
    });
    this.data.address = fullText;
    this.autocompleteItems = [];
  }

  signUp() {
    this.util.presentLoading();
    this.afs
      .collection('users')
      .doc(this.data.uid)
      .update(this.data)
      .then(res => {
        this.util.dismissLoader();
        this.util.presentToast('Updated Profile Successfully');
      })
      .catch(err => {
        this.util.dismissLoader();
      });
  }

  terms() {
    this.nav.navigateForward('privacyPolicy');
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select method',
      buttons: [
        {
          text: 'Camera',
          role: 'destructive',
          icon: 'camera',
          handler: () => {
            this.getCamera();
          }
        },
        {
          text: 'Gallary',
          icon: 'photos',
          handler: () => {
            this.changeImg();
          }
        },
        {
          text: 'Annuller',
          icon: 'close',
          role: 'Annuller',
          handler: () => { }
        }
      ]
    });
    await actionSheet.present();
  }

  changeImg() {
    const cameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };
    this.camera.getPicture(cameraOptions).then(
      file_uri => {
        let imgProfile = 'data:image/jpg;base64,' + file_uri;
        const filename = Math.floor(Date.now() / 1000);
        this.storageref
          .child(filename + '.jpg')
          .putString(file_uri, 'base64')
          .then(snapshot => {
            this.storageref
              .child(filename + '.jpg')
              .getDownloadURL()
              .then(r => {
                this.data.image = r;
              });
          })
          .catch(uploaderr => { });
      },
      err => { }
    );
  }

  getCamera() {
    const cameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };
    this.camera.getPicture(cameraOptions).then(
      file_uri => {
        let imgProfile = 'data:image/jpg;base64,' + file_uri;
        const filename = Math.floor(Date.now() / 1000);
        this.storageref
          .child(filename + '.jpg')
          .putString(file_uri, 'base64')
          .then(snapshot => {
            this.storageref
              .child(filename + '.jpg')
              .getDownloadURL()
              .then(r => {
                this.data.image = r;
              });
          })
          .catch(uploaderr => {
            console.log('uploaderr: ', uploaderr);
          });
      },
      err => { }
    );
  }
}
