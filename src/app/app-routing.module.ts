import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'starter',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  {
    path: 'starter',
    loadChildren: () =>
      import('./starter/starter.module').then(m => m.StarterPageModule)
  },
  {
    path: 'sign-in',
    loadChildren: () =>
      import('./signin/signin.module').then(m => m.SigninPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'account',
    loadChildren: './account/account.module#AccountPageModule'
  },
  { path: 'orders', loadChildren: './orders/orders.module#OrdersPageModule' },
  {
    path: 'service-list',
    loadChildren: './service-list/service-list.module#ServiceListPageModule'
  },
  { path: 'cart', loadChildren: './cart/cart.module#CartPageModule' },
  {
    path: 'location-address',
    loadChildren:
      './location-address/location-address.module#LocationAddressPageModule'
  },
  {
    path: 'employee-list',
    loadChildren: './employee-list/employee-list.module#EmployeeListPageModule'
  },
  {
    path: 'employee-detail',
    loadChildren:
      './employee-detail/employee-detail.module#EmployeeDetailPageModule'
  },
  {
    path: 'view-on-going-jobs',
    loadChildren:
      './view-on-going-jobs/view-on-going-jobs.module#ViewOnGoingJobsPageModule'
  },
  {
    path: 'aboutUs',
    loadChildren: () =>
      import('./about-us/about-us.module').then(m => m.AboutUsPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then(m => m.FaqPageModule)
  },
  {
    path: 'privacyPolicy',
    loadChildren: () =>
      import('./privacy-policy/privacy-policy.module').then(
        m => m.PrivacyPolicyPageModule
      )
  },
  {
    path: 'privacyPolicy',
    loadChildren: () =>
      import('./privacy-policy/privacy-policy.module').then(
        m => m.PrivacyPolicyPageModule
      )
  },
  {
    path: 'notification',
    loadChildren: () =>
      import('./notification/notification.module').then(
        m => m.NotificationPageModule
      )
  },
  {
    path: 'editprofile',
    loadChildren: () =>
      import('./editprofile/editprofile.module').then(
        m => m.EditprofilePageModule
      )
  },
  {
    path: 'jobinprocess',
    loadChildren: () =>
      import('./job-in-process/job-in-process.module').then(
        m => m.JobInProcessPageModule
      )
  },
  {
    path: 'ratting',
    loadChildren: () =>
      import('./ratting/ratting.module').then(m => m.RattingPageModule)
  },
  {
    path: 'order-detail',
    loadChildren: () =>
      import('./order-detail/order-detail.module').then(
        m => m.OrderDetailPageModule
      )
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then(
        m => m.ForgotPasswordPageModule
      )
  },
  {
    path: 'sign-up-with-mobile',
    loadChildren: () =>
      import('./sign-up-with-mobile/sign-up-with-mobile.module').then(
        m => m.SignUpWithMobilePageModule
      )
  },
  {
    path: 'otp-verification',
    loadChildren: () =>
      import('./otpverification/otpverification.module').then(
        m => m.OTPVerificationPageModule
      )
  },
  {
    path: 'sign-in-option',
    loadChildren:
      './sign-in-option/sign-in-option.module#SignInOptionPageModule'
  },
  {
    path: 'sign-in-phone',
    loadChildren: './sign-in-phone/sign-in-phone.module#SignInPhonePageModule'
  },
  {
    path: 'promo-code',
    loadChildren: './promo-code/promo-code.module#PromoCodePageModule'
  },
  {
    path: 'mapView',
    loadChildren: './map-view/map-view.module#MapViewPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
