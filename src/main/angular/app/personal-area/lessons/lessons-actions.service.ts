import { Injectable } from '@angular/core';
import { ActionsService } from '../../common/actions.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LessonsActionsService extends ActionsService<LessonsActionsService> {

    constructor(
        private readonly _http: HttpClient
    ) {
        super();
    }

    cancel(lessonId): void {
        this._subscriptions
            .cancel
            .next(
                this._http
                    .delete(`/api/lessons/${lessonId}`)
                    .subscribe((resp) => this._results.cancel.next(resp))
            )
    }

    changeTime(lessonId, lessonStart, lessonEnd): void {
        this._subscriptions
            .changeTime
            .next(
                this._http
                    .put(`/api/lessons/${lessonId}`, {
                        lessonStart, lessonEnd
                    })
                    .subscribe((resp) => this._results.changeTime.next(resp))
            )
    }

    provided(lessonId): void {
        this._subscriptions
            .provided
            .next(
                this._http
                    .put(`/api/lessons/${lessonId}/provided`, undefined)
                    .subscribe((resp) => this._results.provided.next(resp))
            )
    }
}
