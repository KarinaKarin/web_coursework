import { Component, OnInit } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { merge, Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { CoursesService } from '../../courses/courses.service';
import { AuthorizationService } from '../../../authorization/authorization.service';

@Component({
    selector: 'spx-schedule-page',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.scss'],
    providers: [
        CoursesService
    ]
})
export class ScheduleComponent implements OnInit {

    public readonly items: Observable<MenuItem[]>;

    constructor(
        private readonly _translateService: TranslateService,
        private readonly _coursesService: CoursesService,
        private readonly _authorizationService: AuthorizationService
    ) {
        this._authorizationService
            .user
            .pipe(first())
            .subscribe(({ id }) => this._coursesService.setParams({ studentId: id }));

        this.items = merge(of(true), this._translateService.onLangChange)
            .pipe(
                map<any, MenuItem[]>(() => [

                        {
                            label: this._translateService.instant('ScheduleModule.Today'),
                            routerLink: '/schedule/today'
                        },
                        {
                            label: this._translateService.instant('ScheduleModule.Tomorrow'),
                            routerLink: '/schedule/tomorrow'
                        },
                        {
                            label: this._translateService.instant('ScheduleModule.Week'),
                            routerLink: '/schedule/week'
                        }
                    ]
                ));
    }

    ngOnInit() {



    }

}
