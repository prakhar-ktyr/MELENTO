import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  @Input() duration!: number; // Non-null assertion operator
  @Input() assessmentSubmitted!:boolean;
  @Output() timeUp = new EventEmitter<void>();
  remainingTime!: number; // Non-null assertion operator
  timerInterval: any;

  ngOnInit(): void {
    this.startTimer();
  }

  startTimer(): void {
    this.remainingTime = this.duration;
    this.timerInterval = setInterval(() => {
      if(this.assessmentSubmitted){
        this.remainingTime = 0 ; 
        this.timeUp.emit() ; 
        clearInterval(this.timerInterval);
      }
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.timeUp.emit() ; 
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const secs: number = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
