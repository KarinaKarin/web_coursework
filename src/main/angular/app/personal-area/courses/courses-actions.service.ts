import { Injectable } from '@angular/core';
import { ActionsService } from '../../common/actions.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoursesActionsService extends ActionsService<CoursesActionsService> {

  constructor(
      private readonly _http: HttpClient
  ) {
    super();
  }

  createCourse(course): void {
    this._subscriptions
        .createCourse
        .next(
            this._http
                .post('/api/courses', course)
                .subscribe((resp) => this._results.createCourse.next(resp))
        )
  }

  subscribe(courseId): void {
    this._subscriptions
        .subscribe
        .next(
            this._http
                .post(`/api/courses/${courseId}/subscribe`, undefined)
                .subscribe((resp) => this._results.subscribe.next(resp))
        )
  }

  unsubscribe(courseId): void {
    this._subscriptions
        .unsubscribe
        .next(
            this._http
                .delete(`/api/courses/${courseId}/unsubscribe`)
                .subscribe((resp) => this._results.unsubscribe.next(resp))
        )
  }
}
