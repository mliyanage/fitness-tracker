import { AngularFirestore } from "@angular/fire/firestore";
import "firebase/firestore";
import { Exercise } from "./exercise.model";
import { Subject, Subscription } from "rxjs";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

@Injectable()
export class TrainingService {
  private availableEcercises: Exercise[] = [];
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  firebaseSubs: Subscription[] = [];
  private runningExercise: Exercise;

  constructor(private db: AngularFirestore) {}

  getAvailableExercises() {
    this.firebaseSubs.push(
      this.db
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
        )
        .subscribe((exercises: Exercise[]) => {
          this.availableEcercises = exercises;
          this.exercisesChanged.next([...this.availableEcercises]);
        })
    );
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableEcercises.find(
      ex => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeSercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: "completed"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExersise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: Math.floor(this.runningExercise.duration * (progress / 100)),
      calories: Math.floor(this.runningExercise.calories * (progress / 100)),
      date: new Date(),
      state: "cancelled"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  stopExercise() {
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  getCompletedOrCancelledExercises() {
    this.firebaseSubs.push(
      this.db
        .collection("finishedExercises")
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.finishedExercisesChanged.next(exercises);
        })
    );
  }

  cancelSubscriptions() {
    this.firebaseSubs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  addDataToDatabase(exercise: Exercise) {
    this.db.collection("finishedExercises").add(exercise);
  }
}
