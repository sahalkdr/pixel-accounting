import { RouterModule,Routes } from '@angular/router';
import {LoginComponent} from "./layouts/login/login.component";
import {SignupComponent} from "./layouts/signup/signup.component";
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { ItemsComponent } from './layouts/items/items.component';
import { PartiesComponent } from './layouts/parties/parties.component';
import { QuickbillingComponent } from './layouts/quickbilling/quickbilling.component';
import { ReportsComponent } from './layouts/reports/reports.component';
import { SaleComponent } from './layouts/reports/sale/sale.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './layouts/home/home.component';

import { AdditemComponent } from './layouts/add-item/add-item.component';
import { AddpartyComponent } from './layouts/parties/addparty/addparty.component'

import { ViewBillComponent } from './layouts/quickbilling/view-bill/view-bill.component';
import { PrintSaleReportComponent } from './layouts/reports/print-sale-report/print-sale-report.component';

import { AuthGuard } from './shared/services/auth_guard';


// import { AddpartyComponent } from './layouts/parties/addparty/addparty.component;


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'dashboard', component: DashboardComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
        { path: 'items', component: ItemsComponent },
        { path: 'parties', component: PartiesComponent },
        { path: 'quickbilling', component: QuickbillingComponent},
        {
          path: 'reports', component: ReportsComponent, children: [
            { path: '', redirectTo: 'sale', pathMatch: 'full' },
            { path: 'sale', component: SaleComponent },
            
          ]
        }
        ],canActivate: [AuthGuard]
        },
       
        { path: 'item/add', component: AdditemComponent ,canActivate: [AuthGuard]},
        { path: 'parties/add', component: AddpartyComponent ,canActivate: [AuthGuard]},
        { path: 'bill-details', component: ViewBillComponent ,canActivate: [AuthGuard]},
        { path: 'sale-details', component: PrintSaleReportComponent ,canActivate: [AuthGuard]}
        
];

