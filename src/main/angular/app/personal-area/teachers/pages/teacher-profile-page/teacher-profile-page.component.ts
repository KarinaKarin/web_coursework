import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../teacher.service';
import { Observable } from 'rxjs';
import { Teacher } from '../../model/teacher';
import { AbilityService } from '../../../ability/ability.service';
import { AbilityLevel } from '../../../ability/model/ability-level';
import { tap } from 'rxjs/operators';
import { CoursesService } from '../../../courses/courses.service';
import { Course } from '../../../courses/model/course';

@Component({
  selector: 'spx-teacher-profile',
  templateUrl: './teacher-profile-page.component.html',
  styleUrls: ['./teacher-profile-page.component.scss'],
  providers: [
    TeacherService,
    AbilityService,
    CoursesService
  ]
})
export class TeacherProfilePageComponent implements OnInit {

  public readonly teacher: Observable<Teacher>;
  public readonly abilities: Observable<AbilityLevel[]>;

  public readonly courses: Observable<Course[]>;
  public readonly isLoading: Observable<boolean>;

  constructor(
      private readonly _teacherService: TeacherService,
      private readonly _abilityService: AbilityService,
      private readonly _coursesService: CoursesService
  ) {
    this.teacher = this._teacherService
        .content
        .pipe(tap(({ id }) => {
          this._abilityService.setAccountId(id);
          this._coursesService.setParams({ teacherId: id })
        }));
    this.abilities = this._abilityService.content;

    this.courses = this._coursesService.content;
    this.isLoading = this._coursesService.load;
  }

  ngOnInit() {
  }

}
