// 

import { Component } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MatIconModule,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pixel-accounting';
}