import { FinishedPage } from './../finished/finished.page';
import { ApiService } from './../Provider/Api/api.service';
import { UtilService } from './../Provider/Util/util.service';
import { NavController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ratting',
  templateUrl: './ratting.page.html',
  styleUrls: ['./ratting.page.scss']
})
export class RattingPage implements OnInit {
  serviceDetail: boolean = false;
  activeStar: number = 0;
  bookingData: any;
  feedback: any;
  userId: any;
  serviceTotal: any = 0;
  mainTotal: any = 0;
  currenctyType: any;
  constructor(
    private navCtrl: NavController,
    private util: UtilService,
    private api: ApiService,
    private modalController: ModalController
  ) {
    this.api.getCollection('setting').subscribe((res: any) => {
      this.currenctyType = res[0].currency;
    });
    this.api.getDocumnet(`requests/${this.api.parseData}`).subscribe(
      (res: any) => {
        this.bookingData = res;
        this.mainTotal =
          parseFloat(this.bookingData.finalTotal) +
          parseFloat(this.bookingData.additionalCharges);
        this.mainTotal = Number(this.mainTotal).toFixed(2);
        this.bookingData.services.forEach(element => {
          element.price = Number(element.price).toFixed(2);
          this.serviceTotal += parseFloat(element.price) * element.qty;
        });
        if (parseFloat(res.additionalCharges) > 0) {
          res.additionalCharges = parseFloat(res.additionalCharges).toFixed(2);
          this.serviceTotal =
            this.serviceTotal + parseFloat(res.additionalCharges);
        }
        this.serviceTotal = this.serviceTotal - parseFloat(res.discount);
        this.serviceTotal = Number(this.serviceTotal).toFixed(2);
      },
      err => {
        console.log('err', err);
      }
    );
  }

  ngOnInit() { }
  goHome() {
    this.navCtrl.navigateRoot('/home');
  }
  setStarValue(val: number) {
    if (this.activeStar === 1) {
      this.activeStar = 0;
    } else if (val === 0) {
      this.activeStar = 1;
    } else {
      this.activeStar = val;
    }
  }

  giveRating() {
    if (this.activeStar > 0) {
      let data = {
        uid: this.bookingData.uId,
        freelancer_id: this.bookingData.freelancerId,
        booking_id: this.api.parseData,
        star: this.activeStar,
        comment: this.feedback ? this.feedback : '',
        created_at: new Date(),
        review_by: 'user'
      };
      this.util.presentLoading();
      this.api
        .addCollection('rating', data)
        .then(res => {
          this.api.updateDocument(`requests/${this.api.parseData}`, {
            rating: {
              user: true,
              freelancer: this.bookingData.rating.freelancer
            }
          });
          this.util.dismissLoader();
          this.jobFinished()
        })
        .catch(err => {
          this.util.dismissLoader();
          console.log('err', err);
        });
    } else {
      this.util.presentToast('Please Select star rating');
    }
  }

  async jobFinished() {
    const modal = await this.modalController.create({
      component: FinishedPage,
      cssClass: 'finished-modal'
    });
    return await modal.present();
  }
}
