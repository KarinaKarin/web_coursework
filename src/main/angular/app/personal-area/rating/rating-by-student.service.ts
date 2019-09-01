import { Injectable } from '@angular/core';
import { ContentService } from '../../common/content.service';
import { combineLatest } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Rating } from './model/rating';
import { AuthorizationService } from '../../authorization/authorization.service';

@Injectable()
export class RatingByStudentService extends ContentService<Rating> {

  constructor(
      private readonly _http: HttpClient,
      private readonly _authorizationService: AuthorizationService
  ) {
    super();

    combineLatest(this._authorizationService.user, this._refresh)
        .pipe(takeUntil(this._destroy))
        .subscribe(
            ([ { id } ]) => this._http
                .get<Rating>(`/api/rating/student`, {
                  params: {
                    studentId: id
                  }
                })
                .subscribe((content) => this._content.next(content))
        );
  }
}