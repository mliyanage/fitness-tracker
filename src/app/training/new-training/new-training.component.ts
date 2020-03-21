import { NgForm } from "@angular/forms";
import { Exercise } from "./../exercise.model";
import { TrainingService } from "./../training.service";
import { Component, OnInit } from "@angular/core";
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
  constructor(private trainingService: TrainingService) {}
  exercises: Exercise[] = [];

  ngOnInit(): void {
    this.exercises = this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
