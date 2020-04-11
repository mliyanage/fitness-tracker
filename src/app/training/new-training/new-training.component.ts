import { UIService } from "src/app/shared/ui.service";
import { NgForm } from "@angular/forms";
import { Exercise } from "./../exercise.model";
import { TrainingService } from "./../training.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
// import { AngularFirestore } from "@angular/fire/firestore";
// import "firebase/firestore";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.scss"],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  private exerciseSubscription: Subscription;
  private loadingSubs: Subscription;
  isLoading;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService
  ) {}

  ngOnInit(): void {
    this.loadingSubs = this.uiService.loadinStateChanged.subscribe(
      (isLoaded) => {
        this.isLoading = isLoaded;
      }
    );
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      (exercises) => (this.exercises = exercises)
    );

    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    if (this.exerciseSubscription) this.exerciseSubscription.unsubscribe();
    if (this.loadingSubs) this.loadingSubs.unsubscribe();
  }
}
