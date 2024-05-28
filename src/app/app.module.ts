import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { PartiesComponent } from './layouts/parties/parties.component';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: 'parties', component: PartiesComponent }
  // other routes
];

@NgModule({
  declarations: [
    AppComponent,
    PartiesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }