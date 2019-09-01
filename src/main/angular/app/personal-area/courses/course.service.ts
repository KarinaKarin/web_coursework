import { Injectable } from '@angular/core';
import { ContentService } from '../../common/content.service';
import { combineLatest, merge, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Course } from './model/course';
import { ActivatedRoute } from '@angular/router';
import { CoursesActionsService } from './courses-actions.service';

@Injectable()
export class CourseService extends ContentService<Course> {

  constructor(
      private readonly _http: HttpClient,
      private readonly _route: ActivatedRoute,
      private readonly _coursesActionsService: CoursesActionsService
  ) {
    super();

    combineLatest(this._route.params, this._refresh)
        .pipe(takeUntil(this._destroy))
        .subscribe(
            ([ { courseId } ]) => this._http
                .get<Course>(`/api/courses/${courseId}`)
                .subscribe((content) => this._content.next(content))
        );

    merge(
        this._coursesActionsService.results.createCourse,
        this._coursesActionsService.results.subscribe,
        this._coursesActionsService.results.unsubscribe
    )
        .pipe(takeUntil(this._destroy))
        .subscribe(() => this._refresh.next());
  }
}