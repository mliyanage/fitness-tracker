import { AuthService } from "./auth/auth.service";
import { OnInit } from "@angular/core";
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "fitness-tracker";

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.initAuthListner();
  }
}
