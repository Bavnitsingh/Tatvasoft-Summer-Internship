import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { RouterOutlet } from "@angular/router";
import { NgToastModule } from "ng-angular-popup";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgToastModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  title = 'FrontEnd';
}
