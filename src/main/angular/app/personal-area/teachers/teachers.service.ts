import { Injectable } from '@angular/core';
import { ContentService } from '../../common/content.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Teacher } from './model/teacher';

@Injectable()
export class TeachersService extends ContentService<Teacher[]> {
    private readonly _filters: BehaviorSubject<{
        'firstName': string,
        'lastName': string,
        'ability': string,
        'onlyMy': string,
    }>;

    constructor(private readonly _http: HttpClient) {
        super();
        this._filters = new BehaviorSubject({} as any);

        combineLatest(this._filters, this._refresh)
            .pipe(takeUntil(this._destroy))
            .subscribe(
                ([ filters ]) => this._http
                    .get<Teacher[]>('/api/teachers', {
                        params: Object.entries(filters)
                            .filter(([key, value]) => !!value)
                            .reduce((acc, [key, value]) => {
                                acc[key] = value;
                                return acc;
                            }, {})
                    })
                    .subscribe((teachers) => this._content.next(teachers))
            )
    }

    public setFilters(filters) {
        this._filters.next(filters);
    }
}
