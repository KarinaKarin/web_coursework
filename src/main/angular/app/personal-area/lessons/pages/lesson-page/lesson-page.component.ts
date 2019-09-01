import { Component, OnInit } from '@angular/core';
import { CourseByLessonService } from '../../../courses/course-by-lesson.service';
import { Course } from '../../../courses/model/course';
import { combineLatest, Observable } from 'rxjs';
import { Lesson } from '../../model/lesson';
import { first, map } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService } from '../../../../authorization/authorization.service';
import { LessonsActionsService } from '../../lessons-actions.service';
import { RatingActionsService } from '../../../rating/rating-actions.service';
import { RatingsByLessonService } from '../../../rating/ratings-by-lesson.service';
import { Rating } from '../../../rating/model/rating';

@Component({
    selector: 'spx-lesson-page',
    templateUrl: './lesson-page.component.html',
    styleUrls: ['./lesson-page.component.scss'],
    providers: [
        CourseByLessonService,
        RatingsByLessonService
    ]
})
export class LessonPageComponent implements OnInit {
    // public readonly time: RegExp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
    public readonly isoDate: RegExp = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

    public readonly timeForm: FormGroup;
    public readonly ratingForm: FormGroup;
    public readonly course: Observable<Course>;
    public readonly lesson: Observable<Lesson>;
    public readonly ratings: Observable<Rating[]>;
    public readonly isTeacher: Observable<boolean>;

    constructor(
        private readonly _courseByLessonService: CourseByLessonService,
        private readonly _ratingByLessonService: RatingsByLessonService,
        private readonly _route: ActivatedRoute,
        private readonly _router: Router,
        private readonly _formBuilder: FormBuilder,
        private readonly _authorizationService: AuthorizationService,
        private readonly _lessonsActionsService: LessonsActionsService,
        private readonly _ratingActionsService: RatingActionsService
    ) {
        this.timeForm = this._formBuilder.group({
            'lessonStart': [ null, [ Validators.required, Validators.pattern(this.isoDate) ] ],
            'lessonEnd': [ null, [ Validators.required, Validators.pattern(this.isoDate) ] ]
        });
        this.ratingForm = this._formBuilder.group({

        });
        this.ratings = this._ratingByLessonService.content;

        this.isTeacher = combineLatest(
            this._authorizationService.user,
            this._courseByLessonService.content
        )
            .pipe(map(([ teacher, course ]) => teacher.id === course.teacher.id));
        this.course = this._courseByLessonService.content;

        this._courseByLessonService
            .content
            .pipe(first())
            .subscribe(({ students }) => {
                (this.ratingForm.registerControl('ratings',
                    this._formBuilder.array(students.map(({ id, heroName, firstName, lastName }) =>
                        this._formBuilder.group({
                            'id': [id, [ Validators.required ]],
                            'heroName': [heroName, [ Validators.required ]],
                            'firstName': [firstName, [ Validators.required ]],
                            'lastName': [lastName, [ Validators.required ]],
                            'isPresent': [false, [ Validators.required ]],
                            'rating': [0, [ Validators.required ]]
                        })))) as FormArray)
                    .controls
                    .forEach((studentFormGroup: FormGroup) => {
                        studentFormGroup
                            .controls
                            .isPresent
                            .valueChanges
                            .subscribe((isPresent) => {
                                const { rating } = studentFormGroup.controls;
                                if (!isPresent) {
                                    rating.patchValue(0);
                                    rating.disable();
                                } else {
                                    rating.enable();
                                }
                            });
                        studentFormGroup
                            .controls
                            .isPresent
                            .patchValue(false);
                    });
            });

        combineLatest(this._courseByLessonService.content, this._route.params)
            .pipe(first(), map(this.findLesson))
            .subscribe((lesson) => {
                this.timeForm.patchValue({
                    'lessonStart': lesson.lessonStart,
                    'lessonEnd': lesson.lessonEnd
                });
            });


        this.lesson = combineLatest(
            this._courseByLessonService.content,
            this._route.params
        )
            .pipe(map(this.findLesson))
    }

    ngOnInit() {
    }

    public changeTime(lessonId) {
        if (this.timeForm.valid) {
            combineLatest(this.course, this._lessonsActionsService.results.changeTime)
                .pipe(first())
                .subscribe(([ { id } ]) => {
                    this._router.navigate(['/courses', id]);
                });

            const { lessonStart, lessonEnd } = this.timeForm.value;

            this._lessonsActionsService.changeTime(lessonId, lessonStart, lessonEnd);
        }
    }

    public cancel(lessonId) {
        combineLatest(this.course, this._lessonsActionsService.results.cancel)
            .pipe(first())
            .subscribe(([ { id } ]) => {
                this._router.navigate(['/courses', id]);
            });

        this._lessonsActionsService.cancel(lessonId);
    }

    public createRatings() {
        combineLatest(this.course, this._lessonsActionsService.results.provided)
            .pipe(first())
            .subscribe(([ { id } ]) => {
                this._router.navigate(['/courses', id]);
            });

        this.lesson
            .pipe(first())
            .subscribe((lesson) => {
                this._ratingActionsService
                    .create(this.ratingForm
                        .value
                        .ratings
                        .filter(({ isPresent }) => isPresent)
                        .map(({ id, rating }) => ({
                            lessonId: lesson.id,
                            studentId: id,
                            rating: rating,
                        })));
                this._lessonsActionsService.provided(lesson.id);
            });
    }

    private findLesson([ { id, abstractLessons }, { lessonId } ]: [ Course, Params ]) {
        let lesson = null;

        for (const {lessons} of abstractLessons) {
            lesson = lessons.find((item) => item.id == lessonId);

            if (lesson) {
                break;
            }
        }

        return lesson;
    }

}
