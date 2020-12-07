import { ApiService } from './../Provider/Api/api.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
declare var google;
import * as firebase from 'firebase';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.page.html',
  styleUrls: ['./map-view.page.scss']
})
export class MapViewPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  dirService = new google.maps.DirectionsService();
  dirRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false });
  segmentState: any;
  requestData: any = {};
  wow: 1;
  unSub: any;
  constructor(
    private afs: AngularFirestore,
    private nav: NavController,
    private api: ApiService
  ) {
    this.unSub = this.afs
      .doc(`requests/${this.api.parseData}`)
      .valueChanges()
      .subscribe(
        res => {
          this.requestData = res;
          if (this.requestData.requestStatus == 4) {
            var request = {
              origin:
                this.requestData.user_LatLng.lat +
                ',' +
                this.requestData.user_LatLng.lng,
              destination:
                this.requestData.freelance_LatLng.lat +
                ',' +
                this.requestData.freelance_LatLng.lng,
              travelMode: google.maps.TravelMode.DRIVING
            };

            this.dirService.route(request, (result, status) => {
              if (status == google.maps.DirectionsStatus.OK) {
                this.dirRenderer.setDirections(result);
              } else {

              }
            });
          } else {
            this.nav.navigateBack('jobinprocess');
          }
        },
        err => {
          console.log('err', err);
        }
      );
  }

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
    }, 500);
  }
  doBack() {
    this.nav.back();
  }
  initMap() {
    let mapoption = {
      center: new google.maps.LatLng(
        this.requestData.user_LatLng.lat,
        this.requestData.user_LatLng.lng
      ),
      streetViewControl: false,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      gestureHandling: 'greedy'
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapoption);
    this.dirRenderer.setMap(this.map);
    var request = {
      origin:
        this.requestData.user_LatLng.lat +
        ',' +
        this.requestData.user_LatLng.lng,
      destination:
        this.requestData.freelance_LatLng.lat +
        ',' +
        this.requestData.freelance_LatLng.lng,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.dirService.route(request, (result, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        this.dirRenderer.setDirections(result);
      } else {

      }
    });
  }
  ionViewWillLeave() {
    this.unSub.unsubscribe();
  }
}
