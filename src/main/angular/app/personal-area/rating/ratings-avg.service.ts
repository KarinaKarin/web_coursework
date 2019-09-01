import { Injectable } from '@angular/core';
import { ContentService } from '../../common/content.service';
import { combineLatest } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Rating } from './model/rating';

@Injectable()
export class RatingsAvgService extends ContentService<Rating[]> {

    constructor(
        private readonly _http: HttpClient
    ) {
        super();

        combineLatest(this._refresh)
            .pipe(takeUntil(this._destroy))
            .subscribe(
                ([]) => this._http
                    .get<Rating[]>(`/api/rating`, {
                        params: {
                            average: `${true}`
                        }
                    })
                    .subscribe((content) => this._content.next(content))
            );
    }
}