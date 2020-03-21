import { Exercise } from "./exercise.model";
import { Subject } from "rxjs";

export class TrainingService {
  private availableEcercises: Exercise[] = [
    { id: "crunches", name: "Crunches", duration: 30, calories: 8 },
    { id: "touch-toes", name: "Touch Toes", duration: 180, calories: 10 },
    { id: "side-lunges", name: "Side Lunges", duration: 120, calories: 12 },
    { id: "burpees", name: "Burpees", duration: 60, calories: 8 }
  ];
  exerciseChanged = new Subject<Exercise>();

  private runningExercise: Exercise;

  getAvailableExercises() {
    return this.availableEcercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableEcercises.find(
      ex => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  stopExercise() {
    this.exerciseChanged.next(null);
  }
}
