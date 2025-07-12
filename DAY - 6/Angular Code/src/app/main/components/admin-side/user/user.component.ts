import { Component, OnDestroy, type OnInit } from "@angular/core"
import { NgToastService } from "ng-angular-popup"
import { APP_CONFIG } from "src/app/main/configs/environment.config"
import { AdminService } from "src/app/main/services/admin.service"
import { HeaderComponent } from "../header/header.component"
import { SidebarComponent } from "../sidebar/sidebar.component"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { NgxPaginationModule } from "ngx-pagination"
import { NgFor, NgIf, NgStyle } from "@angular/common"
import { FilterPipe } from "src/app/main/pipes/filter.pipe"
import { Subscription } from "rxjs"
declare var window: any
@Component({
  selector: "app-user",
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, FormsModule, RouterModule, NgxPaginationModule, NgIf, NgFor, FilterPipe, NgStyle],
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit, OnDestroy {
  page = 1
  itemsPerPages = 10
  searchText: any = ""
  userList: any[] = []
  deleteModal: any
  userId: any
  private unsubscribe: Subscription[] = [];

  constructor(
    private _service: AdminService,
    private _toast: NgToastService,
  ) { }

  ngOnInit(): void {
    this.fetchUserList()
    this.deleteModal = new window.bootstrap.Modal(document.getElementById("removeMissionModal"))
  }

  fetchUserList() {
    const userSubscription = this._service.userList().subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.userList = data.data
        } else {
          this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration })
        }
      },
      (err) => this._toast.error({ detail: "ERROR", summary: err.error.message, duration: APP_CONFIG.toastDuration }),
    )
    this.unsubscribe.push(userSubscription)
  }

  openDeleteUserModal(id: any) {
    this.deleteModal.show()
    this.userId = id
  }

  closeRemoveMissionModal() {
    this.deleteModal.hide()
  }

  deleteUser() {
    const deleteUserSubscription = this._service.deleteUser(this.userId).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this._toast.success({ detail: "SUCCESS", summary: data.data, duration: APP_CONFIG.toastDuration })
          setTimeout(() => {
            this.deleteModal.hide()
            window.location.reload()
          }, 1000)
        } else {
          this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration })
        }
      },
      (err) => this._toast.error({ detail: "ERROR", summary: err.error.message, duration: APP_CONFIG.toastDuration }),
    )
    this.unsubscribe.push(deleteUserSubscription)
  }
  
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe())
  }
}
