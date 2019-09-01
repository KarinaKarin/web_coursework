import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../course.service';
import { combineLatest, Observable } from 'rxjs';
import { Course } from '../../model/course';
import { AuthorizationService } from '../../../../authorization/authorization.service';
import { first, map } from 'rxjs/operators';
import { CoursesActionsService } from '../../courses-actions.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
    selector: 'spx-course-page',
    templateUrl: './course-page.component.html',
    styleUrls: ['./course-page.component.scss'],
    providers: [
        CourseService
    ]
})
export class CoursePageComponent implements OnInit {

    public readonly course: Observable<Course>;
    public readonly isSubscribed: Observable<boolean>;
    public readonly isStudent: Observable<boolean>;
    public readonly lessons: Observable<any[]>;
    public readonly options: any;

    constructor(
        private readonly _courseService: CourseService,
        private readonly _authorizationService: AuthorizationService,
        private readonly _coursesActionsService: CoursesActionsService,
        private readonly _router: Router
    ) {
        this.options = {
            plugins: [ 'list' ],
            defaultView: 'listMonth',
            defaultDate: moment().startOf('day').toDate(),
            header: false,
            editable: false,
            eventClick: ({ event }) =>  {
                this._router.navigate(['/lessons', event.id])
            }
        };

        this.course = this._courseService.content;
        this.isStudent = this._authorizationService.isStudent;

        this.isSubscribed = combineLatest(
            this._courseService.content,
            this._authorizationService.user
        )
            .pipe(map(([ { students }, { id } ]) => {
                return !!students.find((student) => student.id === id)
            }));



        this.lessons = this._courseService
            .content
            .pipe(map((course) => {
                const lessons = [];

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
                    });

                return lessons;
            }));
    }

    public toggleSubscribe() {
        combineLatest(this.course, this.isSubscribed)
            .pipe(first())
            .subscribe(([ { id }, isSubscribed ]) => {
                if (isSubscribed) {
                    this._coursesActionsService.unsubscribe(id);
                } else {
                    this._coursesActionsService.subscribe(id);
                }
            });
    }

    ngOnInit() {
    }

}
