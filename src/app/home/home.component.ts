import { Component, OnInit } from '@angular/core';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { interval, noop, Observable, of, throwError, timer } from 'rxjs';
import {
  catchError,
  delay,
  delayWhen,
  filter,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
} from 'rxjs/operators';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';

@Component({
  selector: 'home',
  template: `<div class="courses-panel">
    <h3>All Courses</h3>

    <mat-tab-group>
      <mat-tab label="Beginners">
        <courses-card-list
          [courses]="beginnerCourses$ | async"
          (coursesChanged)="reloadCourses()"
        ></courses-card-list>
      </mat-tab>

      <mat-tab label="Advanced">
        <courses-card-list
          [courses]="advancedCourses$ | async"
          (coursesChanged)="reloadCourses()"
        ></courses-card-list>
      </mat-tab>
    </mat-tab-group>
  </div> `,
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(
    private coursesService: CoursesService,
    private loadingService: LoadingService,
    private messagesService: MessagesService,
  ) {}

  ngOnInit() {
    this.reloadCourses();
  }

  public reloadCourses() {
    // this.loadingService.toggleLoading(true);
    const courses$ = this.coursesService.getAllCourses().pipe(
      map((courses) => courses.sort(sortCoursesBySeqNo)),
      catchError(err => {
        const message = `Couldn't load courses`;
        this.messagesService.showErrors(message);
        return throwError(err);
      })
      // finalize(() => this.loadingService.toggleLoading(false)),
    );
    const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);
    this.beginnerCourses$ = loadCourses$.pipe(
      map((courses) => courses.filter((course) => course.category === 'BEGINNER')),
    );
    this.advancedCourses$ = loadCourses$.pipe(
      map((courses) => courses.filter((course) => course.category === 'ADVANCED')),
    );
  }
}
