import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent{
  constructor(private router: Router) {}

  parties()
  {
    this.router.navigate(['/dashboard/parties']);
  }
  items()
  {
    this.router.navigate(['/dashboard/items']);
  }
  quickbilling()
  {
    this.router.navigate(['/dashboard/quickbilling']);
  }
  report()
  {
    this.router.navigate(['/dashboard/reports']);
  }

}
