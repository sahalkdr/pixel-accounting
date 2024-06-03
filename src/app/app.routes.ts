import { Routes } from '@angular/router';
import {LoginComponent} from "./layouts/login/login.component";
import {SignupComponent} from "./layouts/signup/signup.component";
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { ItemsComponent } from './layouts/items/items.component';
import { PartiesComponent } from './layouts/parties/parties.component';
import { QuickbillingComponent } from './layouts/quickbilling/quickbilling.component';
import { ReportsComponent } from './layouts/reports/reports.component';
import { SaleComponent } from './layouts/reports/sale/sale.component';

import { AdditemComponent } from './layouts/add-item/add-item.component';
import { AddpartyComponent } from './layouts/parties/addparty/addparty.component'
import { ViewBillComponent } from './layouts/quickbilling/view-bill/view-bill.component';
import { PrintSaleReportComponent } from './layouts/reports/print-sale-report/print-sale-report.component';
// import { AddpartyComponent } from './layouts/parties/addparty/addparty.component;

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'dashboard', component: DashboardComponent, children: [
        { path: 'items', component: ItemsComponent },
        { path: 'parties', component: PartiesComponent },
        {
            path: 'reports', component: ReportsComponent, children: [
              { path: 'sale', component: SaleComponent }
            ]
          } 
        ]
        },
        { path: 'quickbilling', component: QuickbillingComponent },
        { path: 'item/add', component: AdditemComponent },
        { path: 'parties/add', component: AddpartyComponent },
        { path: 'bill-details', component: ViewBillComponent },
        { path: 'sale-details', component: PrintSaleReportComponent }
        
];