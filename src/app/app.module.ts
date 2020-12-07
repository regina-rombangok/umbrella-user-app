import { ApplyPromoPageModule } from './apply-promo/apply-promo.module';
import { FinishedPageModule } from './finished/finished.module';
import { AcceptRequestPageModule } from './accept-request/accept-request.module';
import { LocationAddressPageModule } from './location-address/location-address.module';
import { UtilService } from './Provider/Util/util.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { ApiService } from './Provider/Api/api.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { RequestingPageModule } from './requesting/requesting.module';
import { FCM } from '@ionic-native/fcm/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { PayPal } from '@ionic-native/paypal/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ImageModalPageModule } from './image-modal/image-modal.module';
import { EnableLocationPageModule } from './enable-location/enable-location.module';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    LocationAddressPageModule,
    RequestingPageModule,
    AcceptRequestPageModule,
    FinishedPageModule,
    ApplyPromoPageModule,
    ImageModalPageModule,
    EnableLocationPageModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ApiService,
    UtilService,
    Geolocation,
    NativeGeocoder,
    FCM,
    Camera,
    PayPal,
    Clipboard,
    AndroidPermissions
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
