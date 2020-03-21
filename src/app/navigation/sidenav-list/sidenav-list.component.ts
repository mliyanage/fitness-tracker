import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy
} from "@angular/core";
import { AuthService } from "./../../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-sidenav-list",
  templateUrl: "./sidenav-list.component.html",
  styleUrls: ["./sidenav-list.component.scss"]
})
export class SidenavListComponent implements OnInit, OnDestroy {
  isAuth = false;
  authSubscription: Subscription;
  @Output() closeSidenav = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange.subscribe(
      authStatus => {
        this.isAuth = authStatus;
      }
    );
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
