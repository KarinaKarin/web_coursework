import { Injectable } from '@angular/core';
import { ContentService } from '../../common/content.service';
import { combineLatest, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Course } from './model/course';

@Injectable()
export class CoursesService extends ContentService<Course[], boolean> {
    private readonly _params: ReplaySubject<{
        teacherId?: number,
        studentId?: number,
        search?: {
            title?: string,
            teacher?: string,
            ability?: string,
            dayOfWeek?: number
        }
    }>;

    constructor(private readonly _http: HttpClient) {
        super();
        this._params = new ReplaySubject(1);

        combineLatest(this._params, this._refresh)
            .pipe(
                takeUntil(this._destroy),
                switchMap(([ { teacherId, studentId, search } ]) => {
                    const params = {};
                    if (teacherId) {
                        params['teacherId'] = `${teacherId}`;
                    } else if (studentId) {
                        params['studentId'] = `${studentId}`;
                    } else if (search) {
                        Object.entries(search)
                            .filter(([ key, value ]) => !!value)
                            .forEach(([ key, value ]) => params[key] = value);
                    }

                    this._load.next(true);
                    return this._http.get<Course[]>('/api/courses', { params });
                })
            )
            .subscribe((content) => {
                this._content.next(content);
                this._load.next(false)
            });
    }

    public setParams(params): void {
        this._params.next(params);
    }
}