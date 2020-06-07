import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course } from '../model/course';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { filter, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'courses-card-list',
  template: `
    <mat-card *ngFor="let course of courses" class="course-card mat-elevation-z10">
      <mat-card-header>
        <mat-card-title>{{ course.description }}</mat-card-title>
      </mat-card-header>

      <img mat-card-image [src]="course.iconUrl" />

      <mat-card-content>
        <p>{{ course.longDescription }}</p>
      </mat-card-content>

      <mat-card-actions class="course-actions">
        <button
          mat-button
          class="mat-raised-button mat-primary"
          [routerLink]="['/courses', course.id]"
        >
          VIEW COURSE
        </button>

        <button mat-button class="mat-raised-button mat-accent" (click)="editCourse(course)">
          EDIT
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./courses-card-list.component.css'],
})
export class CoursesCardListComponent implements OnInit {
  @Input()
  courses: Course[] = [];

  @Output()
  coursesChanged = new EventEmitter();

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  editCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .pipe(
        filter((ret) => !!ret),
        tap(() => this.coursesChanged.emit(true)),
        tap(() => this.openSnackBar('Course is saved', 'close')),
      )
      .subscribe();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
