import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ItemsModule } from './layouts/items/items.module'; 
import { PartiesModule } from './layouts/parties/parties.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { ViewBillComponent } from './layouts/quickbilling/view-bill/view-bill.component';

import { AppComponent } from './app.component';
import { PartiesComponent } from './layouts/parties/parties.component';
import { QuickbillingComponent } from './layouts/quickbilling/quickbilling.component';
import { ItemsComponent } from './layouts/items/items.component'; 
import { ReportsComponent } from './layouts/reports/reports.component'; 


import { UserService } from './shared/services/user.service';
import { ApiService } from './shared/services/api.service';
import { EditCategoryDialogComponent } from './layouts/items/edit-category-dialog/edit-category-dialog.component';

const appRoutes: Routes = [
    { path: 'parties', component: PartiesComponent },
    { path: 'items', component: ItemsComponent },
   
];

@NgModule({
    declarations: [
        AppComponent,
        PartiesComponent,
        ItemsComponent,
        ReportsComponent,
        QuickbillingComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatSidenavModule,
        MatToolbarModule,
        ReactiveFormsModule,
        MatIconModule,
        MatListModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatMenuModule,
        MatTableModule,
        RouterModule.forRoot(appRoutes),
        ItemsModule, 
        PartiesModule 
    ],
    providers: [UserService, ApiService],
    bootstrap: [AppComponent]
})
export class AppModule { }
