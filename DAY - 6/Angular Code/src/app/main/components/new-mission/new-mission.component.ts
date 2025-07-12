import { Component, type OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { SearchingSortingComponent } from '../searching-sorting/searching-sorting.component';

@Component({
  selector: 'app-new-mission',
  templateUrl: './new-mission.component.html',
  styleUrls: ['./new-mission.component.css'],
  standalone: true,
  imports: [NavbarComponent, CommonModule, SearchingSortingComponent]
})
export class NewMissionComponent implements OnInit {

  ngOnInit(): void {}
  displayStyle = 'none';

  openPopup() {
    this.displayStyle = 'block';
  }
  closePopup() {
    this.displayStyle = 'none';
  }
}