import { ApplyPromoPage } from './../apply-promo/apply-promo.page';
import { AcceptRequestPage } from './../accept-request/accept-request.page';
import { UtilService } from './../Provider/Util/util.service';
import { LocationAddressPage } from './../location-address/location-address.page';
import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  ModalController,
  NavController
} from '@ionic/angular';
import { ApiService } from '../Provider/Api/api.service';
import { RequestingPage } from '../requesting/requesting.page';
import {
  PayPal,
  PayPalPayment,
  PayPalConfiguration
} from '@ionic-native/paypal/ngx';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss']
})
export class CartPage implements OnInit {
  activePaymentMode: any = 'COH';
  selectedAddress: any = JSON.parse(localStorage.getItem('selectedLocation'));
  qty: any = 1;
  serviceList: any = [];
  cartTotal: any = 0.0;
  categoryData: any;
  settingData: any = {};
  currenctyType: any;
  applyCoupon: boolean = false;
  applyCouponData: any;
  discountAmount: any = 0;
  finalAmount: any = 0;
  zarRate: any;
  constructor(
    public actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private api: ApiService,
    private util: UtilService,
    private navCtrl: NavController,
    private payPal: PayPal
  ) {
    this.api.getCurrency().subscribe(
      (res: any) => {
        console.log('currency ', res.rates);
        this.zarRate = res.rates.ZAR;
      },
      err => {
        console.log(err);
      }
    );
    this.serviceList = this.api.parseData.selectService;
    this.categoryData = this.api.parseData.categoryData;
    this.serviceList.forEach((element: any, index) => {
      element.qty = 1;
      this.cartTotal += element.qty * parseFloat(element.price);
    });
    this.cartTotal = Number(this.cartTotal).toFixed(2);
    this.api.getCollection('setting').subscribe((res: any) => {
      this.settingData = res[0];
      this.currenctyType = res[0].currency;
    });
  }

  async openAcceptModal() {
    const modal = await this.modalController.create({
      component: AcceptRequestPage,
      cssClass: 'accept-modal'
    });
    return await modal.present();
  }

  async openRequest(id) {
    const modal = await this.modalController.create({
      component: RequestingPage,
      cssClass: 'requesting-modal',
      componentProps: {
        id: id
      }
    });
    modal.onDidDismiss().then(resData => {
      const unsubdata = this.api
        .getDocumnet(`requests/${resData.data.id}`)
        .subscribe(
          (res: any) => {
            if (res.requestStatus === 1 && res.payMethod === 'Paypal') {
              this.payPal
                .init({
                  PayPalEnvironmentProduction: this.settingData
                    .paypalProductionKey,
                  PayPalEnvironmentSandbox: this.settingData.paypalSandboxKey
                })
                .then(
                  () => {

                    this.payPal
                      .prepareToRender(
                        'PayPalEnvironmentSandbox',
                        new PayPalConfiguration({

                        })
                      )
                      .then(
                        () => {
                          const amount = this.applyCoupon
                            ? this.finalAmount
                            : this.cartTotal;
                          const payAmount: any =
                            parseFloat(amount) / parseFloat(this.zarRate);
                          const payment = new PayPalPayment(
                            payAmount,
                            'USD',
                            'Description',
                            'sale'
                          );
                          this.payPal.renderSinglePaymentUI(payment).then(
                            (pres: any) => {
                              res.payStatus = 1;
                              res.payToken = pres.response.id;
                              this.api
                                .updateDocument(
                                  `requests/${resData.data.id}`,
                                  res
                                )
                                .then(res => {
                                  this.openAcceptModal();
                                });
                            },
                            e => {

                              this.util.presentAlert(
                                'render dialog closed without being successful'
                              );
                            }
                          );
                        },
                        ee => {

                          this.util.presentAlert('Error in configuration');
                        }
                      );
                  },
                  eee => {

                    this.util.presentAlert(
                      "PayPal isn't supported or something"
                    );

                  }
                );
            } else if (res.requestStatus === 1) {
              this.openAcceptModal();
            }
            unsubdata.unsubscribe();
          },
          err => { }
        );
    });
    return await modal.present();
  }

  onClick() {
    this.navCtrl.back();
  }
  ngOnInit() { }
  add(data) {
    data.qty++;
    this.cartTotal = parseFloat(this.cartTotal) + parseFloat(data.price);
    this.cartTotal = Number(this.cartTotal).toFixed(2);
  }

  remove(data) {
    data.qty--;
    if (this.cartTotal > 0) {
      this.cartTotal = parseFloat(this.cartTotal) - parseFloat(data.price);
      this.cartTotal = Number(this.cartTotal).toFixed(2);
    }
  }
  async applyPromo() {
    const modal = await this.modalController.create({
      component: ApplyPromoPage,
      cssClass: 'promocode-modal'
    });
    modal.onDidDismiss().then(res => {
      if (res.data) {
        this.applyCoupon = true;
        this.applyCouponData = res.data;
        this.discountAmount =
          (parseFloat(this.cartTotal) * parseFloat(res.data.percentage)) / 100;
        this.finalAmount =
          parseFloat(this.cartTotal) - parseFloat(this.discountAmount);
        this.discountAmount = parseFloat(this.discountAmount).toFixed(2);
        this.finalAmount = parseFloat(this.finalAmount).toFixed(2);
      }
    });
    return await modal.present();
  }
  async openPaymentMethod() {
    if (this.settingData.paypalStatus == '1') {
      const actionSheet = await this.actionSheetController.create({
        header: 'Payment Mode',
        mode: 'md',
        buttons: [
          {
            text: 'Cash',
            icon: 'md-cash',
            handler: () => {
              this.activePaymentMode = 'COH';
            }
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {

            }
          }
        ]
      });
      await actionSheet.present();
    } else {
      const actionSheet = await this.actionSheetController.create({
        header: 'Payment Mode',
        mode: 'md',
        buttons: [
          {
            text: 'Cash',
            icon: 'md-cash',
            handler: () => {
              this.activePaymentMode = 'COH';
            }
          },
          {
            text: 'Paypal',
            icon: 'md-card',
            handler: () => {
              this.activePaymentMode = 'Paypal';
            }
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {

            }
          }
        ]
      });
      await actionSheet.present();
    }
  }

  async changeLocation() {
    const modal = await this.modalController.create({
      component: LocationAddressPage
    });
    modal.onDidDismiss().then(res => {
      this.selectedAddress = JSON.parse(localStorage.getItem('selectedLocation'));
    });
    return await modal.present();
  }

  doBooking() {
    this.util.presentLoading();
    this.serviceList.forEach((element, index) => {
      if (element.qty <= 0) {
        this.serviceList.splice(index, 1);
      }
    });

    let now = Date.now().toString();
    now += now + Math.floor(Math.random() * 10);
    const orderNo = now.slice(2, 12);

    if (this.serviceList.length > 0) {
      if (this.activePaymentMode === 'COH') {
        const bookData = {
          additionalCharges: 0,
          address:
            this.selectedAddress.address.main +
            ',' +
            this.selectedAddress.address.sub,

          freelance_LatLng: {
            lat: this.api.parseData.employee_Location.lat,
            lng: this.api.parseData.employee_Location.long
          },
          freelancerId: this.api.parseData.employeeID,
          payMethod: this.activePaymentMode,
          payStatus: 0,
          payToken: this.activePaymentMode,
          requestStatus: 0,
          services: this.serviceList,
          status: 1,
          totalCost: this.cartTotal,
          discount: this.discountAmount,
          finalTotal: this.applyCoupon ? this.finalAmount : this.cartTotal,
          couponData: this.applyCoupon ? this.applyCouponData : '',
          orderId: orderNo,
          timeLine: {
            requestedDate: new Date()
          },
          uId: localStorage.getItem('userKey'),
          isUserDone: false,
          user_LatLng: {
            lat: this.selectedAddress.latitude,
            lng: this.selectedAddress.longitude
          },
          rating: {
            user: false,
            freelancer: false
          }
        };

        this.api
          .addCollection('requests', bookData)
          .then(res => {
            if (this.applyCoupon) {
              let remainCoupon = parseInt(this.applyCouponData.qty) - 1;
              this.api.updateDocument(`package/${this.applyCouponData.id}`, {
                qty: remainCoupon.toString()
              });
            }
            this.openRequest(res.id);
            this.util.dismissLoader();
          })
          .catch(err => {
            this.util.dismissLoader();
            console.log('err', err);
          });
      } else {
        const bookData = {
          additionalCharges: 0,
          address:
            this.selectedAddress.address.main +
            ',' +
            this.selectedAddress.address.sub,

          freelance_LatLng: {
            lat: this.api.parseData.employee_Location.lat,
            lng: this.api.parseData.employee_Location.long
          },
          freelancerId: this.api.parseData.employeeID,
          payMethod: this.activePaymentMode,
          payStatus: 0,
          payToken: this.activePaymentMode,
          requestStatus: 0,
          services: this.serviceList,
          status: 1,
          totalCost: this.cartTotal,
          discount: this.discountAmount,
          finalTotal: this.applyCoupon ? this.finalAmount : this.cartTotal,
          couponData: this.applyCoupon ? this.applyCouponData : '',
          orderId: orderNo,
          timeLine: {
            requestedDate: new Date()
          },
          uId: localStorage.getItem('userKey'),
          isUserDone: false,
          user_LatLng: {
            lat: this.selectedAddress.latitude,
            lng: this.selectedAddress.longitude
          },
          rating: {
            user: false,
            freelancer: false
          }
        };

        this.api
          .addCollection('requests', bookData)
          .then(res => {
            this.openRequest(res.id);
            this.util.dismissLoader();
          })
          .catch(err => {
            console.log('err', err);
            this.util.dismissLoader();
          });
      }
    } else {
      this.util.presentAlert('Please Select Service Quantity Minimum 1');
    }
  }
}
