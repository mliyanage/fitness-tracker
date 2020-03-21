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
  private exercises: Exercise[] = [];

  getAvailableExercises() {
    return this.availableEcercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableEcercises.find(
      ex => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeSercise() {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: "completed"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExersise(progress: number) {
    this.exercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.duration * (progress / 100),
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
}
