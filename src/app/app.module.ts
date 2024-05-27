import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app.component';
import { PartiesComponent } from './layouts/parties/parties.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './shared/services/user.service';
import { ApiService } from './shared/services/api.service';

const appRoutes: Routes = [
    { path: 'parties', component: PartiesComponent }
    // Other routes
  ];



@NgModule({
  declarations: [
    AppComponent,
    PartiesComponent
    // other components
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
    // other imports
  ],
  providers: [UserService,ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }