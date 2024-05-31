import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {}