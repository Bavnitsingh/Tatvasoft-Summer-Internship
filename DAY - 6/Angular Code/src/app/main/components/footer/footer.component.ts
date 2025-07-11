import { Component, type OnInit } from "@angular/core"
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-footer",
  imports: [RouterModule],
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
  standalone: true
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
