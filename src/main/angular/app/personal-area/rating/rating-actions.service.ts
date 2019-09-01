import { Injectable } from '@angular/core';
import { ActionsService } from '../../common/actions.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RatingActionsService extends ActionsService<RatingActionsService> {

  constructor(
      private readonly _http: HttpClient
  ) {
    super();
  }

  create(ratings): void {
    this._subscriptions
        .create
        .next(
            this._http
                .post(`/api/rating`, ratings)
                .subscribe((resp) => this._results.create.next(resp))
        )
  }
}
