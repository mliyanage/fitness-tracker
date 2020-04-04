import { NgForm } from "@angular/forms";
import { Exercise } from "./../exercise.model";
import { TrainingService } from "./../training.service";
import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import "firebase/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.scss"]
})
export class NewTrainingComponent implements OnInit {
  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
  ) {}
  exercises: Observable<Exercise[]>;

  ngOnInit(): void {
    this.exercises = this.db
      .collection("availableExercises")
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              ...(doc.payload.doc.data() as Exercise)
            };
          });
        })
      );
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
