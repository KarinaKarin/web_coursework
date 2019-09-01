import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../../model/course';
import { AuthorizationService } from '../../../../authorization/authorization.service';
import { CoursesService } from '../../courses.service';
import { FormBuilder, FormGroup } from '@angular/forms';

interface WeekDay{
    name: String;
}

@Component({
    selector: 'spx-courses-page',
    templateUrl: './courses-page.component.html',
    styleUrls: ['./courses-page.component.scss'],
    providers: [
        CoursesService
    ]
})
export class CoursesPageComponent implements OnInit {

    public readonly weekDays: Observable<WeekDay[]>;
    public readonly courses: Observable<Course[]>;
    public readonly isLoading: Observable<boolean>;
    public readonly isTeacher: Observable<boolean>;
    public readonly isStudent: Observable<boolean>;
    public readonly form: FormGroup;

    constructor(
        private readonly _translateService: TranslateService,
        private readonly _coursesService: CoursesService,
        private readonly _authorizationService: AuthorizationService,
        private readonly _formBuilder: FormBuilder
    ) {
        this.isTeacher = this._authorizationService.isTeacher;
        this.isStudent = this._authorizationService.isStudent;
        this.courses = this._coursesService.content;
        this.isLoading = this._coursesService.load;
        this.form = this._formBuilder.group({
           'title': [ null ],
           'teacher': [ null ],
           'ability': [ null ],
           'dayOfWeek': [ null ]
        });
        this.form
            .valueChanges
            .subscribe((search) => this._coursesService.setParams({
                search: {
                    ...search, dayOfWeek: search.dayOfWeek && search.dayOfWeek.id
                }
            }));

        this._coursesService.setParams({});

        this.weekDays = merge(of(true), this._translateService.onLangChange)
            .pipe(
                map(() => [
                    {
                        id: 1,
                        name: this._translateService.instant('DayOfWeek.Monday')
                    },
                    {
                        id: 2,
                        name: this._translateService.instant('DayOfWeek.Tuesday')
                    },
                    {
                        id: 3,
                        name: this._translateService.instant('DayOfWeek.Wednesday')
                    },
                    {
                        id: 4,
                        name: this._translateService.instant('DayOfWeek.Thursday')
                    },
                    {
                        id: 5,
                        name: this._translateService.instant('DayOfWeek.Friday')
                    },
                    {
                        id: 6,
                        name: this._translateService.instant('DayOfWeek.Saturday')
                    },
                    {
                        id: 7,
                        name: this._translateService.instant('DayOfWeek.Sunday')
                    }
                ])
            );
    }

    ngOnInit() {
    }

}
