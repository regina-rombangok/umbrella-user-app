import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
declare var google;
@Component({
  selector: 'app-location-address',
  templateUrl: './location-address.page.html',
  styleUrls: ['./location-address.page.scss']
})
export class LocationAddressPage implements OnInit {
  autocompleteItems: any;
  service = new google.maps.places.AutocompleteService();
  geocoder = new google.maps.Geocoder();
  historyAddress: any = [];
  constructor(private modalCtrl: ModalController) {
    if (localStorage.getItem('userAddress')) {
      this.historyAddress = JSON.parse(localStorage.getItem('userAddress'));
    }
    if (localStorage.getItem('currentLocation')) {
      this.historyAddress.push(JSON.parse(localStorage.getItem('currentLocation')))
    }

  }

  ngOnInit() { }

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
    let temp: any = [];
    if (localStorage.getItem('userAddress')) {
      temp = JSON.parse(localStorage.getItem('userAddress'));
    }
    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const addressData = {
          address: {
            main: item.structured_formatting.main_text,
            sub: item.structured_formatting.secondary_text
          },
          latitude: results[0].geometry.location.lat(),
          longitude: results[0].geometry.location.lng()
        };
        this.historyAddress.unshift(addressData);
        if (temp.length > 0) {
          temp.unshift(addressData);
        } else {
          temp.push(addressData);
        }
        localStorage.setItem('userAddress', JSON.stringify(temp));
        localStorage.setItem('selectedLocation', JSON.stringify(addressData));
      }
    });
    this.autocompleteItems = [];
    this.modalCtrl.dismiss();
  }
  doClear() {
    localStorage.removeItem('userAddress');
    localStorage.removeItem('selectedLocation');
    this.historyAddress = [];
  }
  onClick() {
    this.modalCtrl.dismiss();
  }
  addExistsLocation(data) {
    localStorage.setItem("selectedLocation", JSON.stringify(data));
    this.modalCtrl.dismiss();
  }
}
