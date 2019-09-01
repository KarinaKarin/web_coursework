import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../../courses/courses.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
    selector: 'spx-week-page',
    templateUrl: './week-page.component.html',
    styleUrls: ['./week-page.component.scss']
})
export class WeekPageComponent implements OnInit {

    public lessons: Observable<any[]>;

    public options: any;

    constructor(
        private readonly _coursesService: CoursesService,
        private readonly _router: Router
    ) {
        this.options = {
            plugins: [ 'list' ],
            defaultView: 'listWeek',
            defaultDate: moment().startOf('day').toDate(),
            header: false,
            editable: false,
            eventClick: ({ event }) =>  {
                this._router.navigate(['/lessons', event.id])
            }
        };

        this.lessons = this._coursesService
            .content
            .pipe(map((courses) => {
                const lessons = [];

                courses
                    .forEach((course) => {
                        const { title } = course;

                        course
                            .abstractLessons
                            .forEach((abstractLesson) => {
                                lessons.push(...abstractLesson
                                    .lessons
                                    .filter(({ canceled, provided }) => !(canceled || provided))
                                    .map(({ id, lessonStart, lessonEnd }) => ({
                                        id, title,
                                        start: lessonStart,
                                        end: lessonEnd
                                    })));
                            })
                    });

                return lessons;
            }));
    }

    ngOnInit() {
    }

}
