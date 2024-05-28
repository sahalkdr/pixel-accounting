import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-parties',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './parties.component.html',
  styleUrls: ['./parties.component.scss']
})
export class PartiesComponent implements OnInit {
  selectedSection: string = 'parties';
  selectedParty: any = null;
  parties: any[] = [];
  transactions: any[] = [
    { type: 'Sale', name: 'Item 1', date: '2023-01-01', quantity: 10, price: 100 },
    { type: 'Purchase', name: 'Item 2', date: '2023-02-01', quantity: 5, price: 50 }
  ];

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.fetchParties();
  }

  showSection(section: string) {
    this.selectedSection = section;
    this.selectedParty = null;
  }

  navigateToAddParty() {
    this.router.navigate(['parties/add']);
  }

  editParty(party: any) {
    // Logic to edit party
  }

  deleteParty(party: any) {
    // Logic to delete party
  }

  showPartyDetails(party: any) {
    this.selectedParty = party;
  }

  // fetchParties() {
  //   this.userService.fetchParties().subscribe(
  //     data => this.parties = data,
  //     error => console.error('Error fetching parties', error)
  //   );
  // }
  fetchParties() {
    this.userService.fetchParties().subscribe(
      data => {
        this.parties = data;
        console.log('Fetched parties:', this.parties); // Log the fetched data
      },
      error => console.error('Error fetching parties', error)
    );
  }

  adjustParty(party: any) {
    // Logic to adjust party details
  }
}