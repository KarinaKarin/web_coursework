import { Injectable } from '@angular/core';
import { ContentService } from '../../common/content.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Teacher } from './model/teacher';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class TeacherService extends ContentService<Teacher> {
    constructor(
        private readonly _http: HttpClient,
        private readonly _route: ActivatedRoute
    ) {
        super();

        combineLatest(this._route.params, this._refresh)
            .pipe(takeUntil(this._destroy))
            .subscribe(
                ([ { teacherId } ]) => this._http
                    .get<Teacher>(`/api/teachers/${teacherId}`)
                    .subscribe((teacher) => this._content.next(teacher))
            )
    }
}
