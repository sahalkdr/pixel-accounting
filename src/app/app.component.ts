

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemsModule } from './layouts/items/items.module'; 
import { PartiesModule  } from './layouts/parties/parties.module';
import { MatDialogModule } from '@angular/material/dialog';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
import { ItemsComponent } from './layouts/items/items.component'; 



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MatIconModule,FormsModule,CommonModule,CarouselModule,MatDialogModule,HttpClientModule,ItemsModule,PartiesModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pixel-accounting';
  
}