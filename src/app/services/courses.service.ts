import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('/api/courses').pipe(
      map((res) => res['payload']),
      shareReplay(1),
    );
  }

  saveCourse(courseId, changes: Partial<Course>): Observable<any> {
    return this.http.put(`/api/courses/${courseId}`, changes).pipe(shareReplay());
  }
  //   this.http.get('/api/courses').subscribe((res) => {
  //   const courses: Course[] = res['payload'].sort(sortCoursesBySeqNo);
  //
  //   this.beginnerCourses = courses.filter((course) => course.category === 'BEGINNER');
  // =
  //   this.advancedCourses = courses.filter((course) => course.category === 'ADVANCED');
  // });
}
