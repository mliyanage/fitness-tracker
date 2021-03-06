import { AuthData } from "./auth-data.model";
import { User } from "./user.model";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { TrainingService } from "../training/training.service";
import { UIService } from "../shared/ui.service";

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService
  ) {}

  initAuthListner() {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(["/training"]);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(["/login"]);
        this.isAuthenticated = false;
      }
    });
  }
  registerUser(authData: AuthData) {
    this.uiService.loadinStateChanged.next(true);
    this.angularFireAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.uiService.loadinStateChanged.next(false);
        console.log(result);
        //this.onSuccessfulAuth();
      })
      .catch(error => {
        //console.log(error);
        this.uiService.loadinStateChanged.next(false);
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    this.uiService.loadinStateChanged.next(true);
    this.angularFireAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.uiService.loadinStateChanged.next(false);
        console.log(result);
        //this.onSuccessfulAuth();
      })
      .catch(error => {
        //console.log(error);
        this.uiService.loadinStateChanged.next(false);
        this.uiService.showSnackbar(error.message, null, 3000);
        //this.snackBar.open(error.message, null, { duration: 3000 });
      });
  }

  logout() {
    //this.trainingService.cancelSubscriptions();
    this.angularFireAuth.signOut();

    // this.authChange.next(false);
    // this.router.navigate(["/login"]);
    // this.isAuthenticated = false;
  }

  isAuth() {
    return this.isAuthenticated;
  }

  //private onSuccessfulAuth() {
  // this.isAuthenticated = true;
  // this.authChange.next(true);
  // this.router.navigate(["/training"]);
  //}
}
