import { Injectable } from '@angular/core';
import { ContentService } from '../../common/content.service';
import { combineLatest } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Rating } from './model/rating';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class RatingsByLessonService extends ContentService<Rating[]> {

  constructor(
      private readonly _http: HttpClient,
      private readonly _route: ActivatedRoute
  ) {
    super();

    combineLatest(this._route.params, this._refresh)
        .pipe(takeUntil(this._destroy))
        .subscribe(
            ([ { lessonId } ]) => this._http
                .get<Rating[]>(`/api/rating`, {
                  params: {
                    lessonId
                  }
                })
                .subscribe((content) => this._content.next(content))
        );
  }
}