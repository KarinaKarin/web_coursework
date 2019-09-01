import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { markControlsDirty } from '../../../../common/utils';
import { AllAbilityService } from '../../../ability/all-ability.service';
import { Observable } from 'rxjs';
import { Ability } from '../../../ability/model/ability';
import { CoursesActionsService } from '../../courses-actions.service';
import { first, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'spx-create-course-page',
    templateUrl: './create-course-page.component.html',
    styleUrls: ['./create-course-page.component.scss'],
    providers: [
        AllAbilityService
    ]
})
export class CreateCoursePageComponent implements OnInit {

    public time: RegExp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/ ;
    public form: FormGroup;

    public deyOfWeekOptions = [
        { dayOfWeek: 1, title: 'DayOfWeek.Monday', value: 'MONDAY' },
        { dayOfWeek: 2, title: 'DayOfWeek.Tuesday', value: 'TUESDAY' },
        { dayOfWeek: 3, title: 'DayOfWeek.Wednesday', value: 'WEDNESDAY' },
        { dayOfWeek: 4, title: 'DayOfWeek.Thursday', value: 'THURSDAY' },
        { dayOfWeek: 5, title: 'DayOfWeek.Friday', value: 'FRIDAY' },
        { dayOfWeek: 6, title: 'DayOfWeek.Saturday', value: 'SATURDAY' },
        { dayOfWeek: 7, title: 'DayOfWeek.Sunday', value: 'SUNDAY' }
    ];

    public readonly ability: Observable<Ability[]>;

    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _allAbilityService: AllAbilityService,
        private readonly _router: Router,
        private readonly _coursesActionsService: CoursesActionsService
    ) {
        this.ability = this._allAbilityService
            .content
            .pipe(tap((abilities) => {
                if (abilities.length > 0) {
                    this.form.patchValue({
                        'ability': abilities[0]
                    });
                }
            }));

        this.form = this._formBuilder.group({
            'title': [null, Validators.required],
            'description': [null, [ Validators.required, Validators.maxLength(4096) ]],
            'lessonsForPassed': [5, [ Validators.required, Validators.min(0), Validators.max(50) ]],
            'maximumStudents': [20, [ Validators.required, Validators.min(0), Validators.max(30) ]],
            'courseStart': [null, [ Validators.required ]],
            'courseEnd': [null, [ Validators.required ]],
            'ability': [null, [ Validators.required ]],
            'abstractLessons': this._formBuilder.array([
                this._formBuilder.group({
                    'dayOfWeek': [null, [ Validators.required ]],
                    'lessonStart': [null, [ Validators.required, Validators.pattern(this.time) ]],
                    'lessonEnd': [null, [ Validators.required, Validators.pattern(this.time) ]]
                })
            ])
        });
    }

    ngOnInit() {
    }

    addAbstractLesson() {
        const abstractLessons = this.form.controls.abstractLessons as FormArray;

        abstractLessons.push(this._formBuilder.group({
            'dayOfWeek': [null, Validators.required],
            'lessonStart': [null, Validators.required],
            'lessonEnd': [null, Validators.required]
        }))
    }

    removeAbstractLesson(index) {
        const abstractLessons = this.form.controls.abstractLessons as FormArray;

        abstractLessons.removeAt(index);
    }

    createCourse() {
        if (this.form.valid) {
            const {
                title,
                description,
                lessonsForPassed,
                maximumStudents,
                courseStart,
                courseEnd,
                ability,
                abstractLessons
            } = this.form.value;
            this._coursesActionsService
                .results
                .createCourse
                .pipe(first())
                .subscribe(() => {
                    this._router.navigateByUrl('/courses');
                });
            this._coursesActionsService
                .createCourse({
                    title,
                    description,
                    lessonsForPassed,
                    maximumStudents,
                    courseStart: courseStart.toISOString().split('T')[0],
                    courseEnd: courseEnd.toISOString().split('T')[0],
                    abilityId: ability.id,
                    abstractLessons: abstractLessons
                        .map(({ dayOfWeek: { value }, lessonStart, lessonEnd }) => {
                            const [ lessonStartHours, lessonStartMinutes ] = lessonStart.split(':');
                            const [ lessonEndHours, lessonEndMinutes ] = lessonEnd.split(':');

                            const lessonStartDate = new Date();
                            const lessonEndDate = new Date();

                            lessonStartDate.setHours(lessonStartHours);
                            lessonStartDate.setMinutes(lessonStartMinutes);

                            lessonEndDate.setHours(lessonEndHours);
                            lessonEndDate.setMinutes(lessonEndMinutes);

                            const lessonStartTime = lessonStartDate.toISOString().split('T')[1];
                            const lessonEndTime = lessonEndDate.toISOString().split('T')[1];

                            return {
                                dayOfWeek: value,
                                lessonStart: lessonStartTime,
                                lessonEnd: lessonEndTime,
                            }
                        })
                })
        } else {
            markControlsDirty(this.form);
        }
    }

}
