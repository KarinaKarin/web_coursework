import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../../courses/courses.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
    selector: 'spx-today-page',
    templateUrl: './today-page.component.html',
    styleUrls: ['./today-page.component.scss']
})
export class TodayPageComponent implements OnInit {

    public lessons: Observable<any[]>;
    public options: any;

    constructor(
        private readonly _coursesService: CoursesService,
        private readonly _router: Router
    ) {
        this.options = {
            plugins: [ 'list' ],
            defaultView: 'listDay',
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
