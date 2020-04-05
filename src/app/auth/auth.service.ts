import { AuthData } from "./auth-data.model";
import { User } from "./user.model";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { TrainingService } from "../training/training.service";

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private trainingService: TrainingService
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
    this.angularFireAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        console.log(result);
        //this.onSuccessfulAuth();
      })
      .catch(error => {
        console.log(error);
      });
  }

  login(authData: AuthData) {
    this.angularFireAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        console.log(result);
        //this.onSuccessfulAuth();
      })
      .catch(error => {
        console.log(error);
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
