import { Component, type OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css'],
  standalone: true,
  imports: [NavbarComponent, FooterComponent]
})
export class PrivacyPolicyComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}