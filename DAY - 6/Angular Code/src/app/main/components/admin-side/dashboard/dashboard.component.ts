import { Component, type OnInit } from "@angular/core"
import dateFormat from "dateformat"
import { SidebarComponent } from "../sidebar/sidebar.component"
import { HeaderComponent } from "../header/header.component"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [SidebarComponent, HeaderComponent],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  data: any
  constructor() {
    setInterval(() => {
      const now = new Date()
      this.data = dateFormat(now, "dddd mmmm dS,yyyy, h:MM:ss TT")
    }, 1)
  }

  ngOnInit(): void {}
}
