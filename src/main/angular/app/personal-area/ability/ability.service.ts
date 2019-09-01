import { Injectable } from '@angular/core';
import { ContentService } from '../../common/content.service';
import { AbilityLevel } from './model/ability-level';
import { HttpClient } from '@angular/common/http';
import { combineLatest, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class AbilityService extends ContentService<AbilityLevel[]> {
    private readonly _account: ReplaySubject<number | 'my'>;

    constructor(private readonly _http: HttpClient) {
        super();

        this._account = new ReplaySubject(1);

        combineLatest(this._account, this._refresh)
            .pipe(takeUntil(this._destroy))
            .subscribe(
                ([ accountId ]) => this._http
                    .get<AbilityLevel[]>(`/api/abilities/${accountId}`)
                    .subscribe((content) => this._content.next(content))
            )
    }

    public setAccountId(id): void {
        this._account.next(id);
    }
}
