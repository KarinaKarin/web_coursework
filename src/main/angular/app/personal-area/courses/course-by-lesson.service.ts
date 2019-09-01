import { Injectable } from '@angular/core';
import { ContentService } from '../../common/content.service';
import { combineLatest, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Course } from './model/course';
import { ActivatedRoute } from '@angular/router';
import { CoursesActionsService } from './courses-actions.service';

@Injectable()
export class CourseByLessonService extends ContentService<Course> {

  constructor(
      private readonly _http: HttpClient,
      private readonly _route: ActivatedRoute,
      private readonly _coursesActionsService: CoursesActionsService
  ) {
    super();

    combineLatest(this._route.params, this._refresh)
        .pipe(takeUntil(this._destroy))
        .subscribe(
            ([ { lessonId } ]) => this._http
                .get<Course>(`/api/courses/lesson`, {
                  params: {
                    lessonId
                  }
                })
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