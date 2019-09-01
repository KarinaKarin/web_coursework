import { Injectable } from '@angular/core';
import { ContentService } from '../../common/content.service';
import { HttpClient } from '@angular/common/http';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Ability } from './model/ability';

@Injectable()
export class AllAbilityService extends ContentService<Ability[]> {

    constructor(private readonly _http: HttpClient) {
        super();

        combineLatest(this._refresh)
            .pipe(takeUntil(this._destroy))
            .subscribe(
                ([]) => this._http
                    .get<Ability[]>(`/api/abilities`)
                    .subscribe((content) => this._content.next(content))
            )
    }
}
