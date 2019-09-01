import { Component, OnInit } from '@angular/core';
import { AbilityService } from '../../ability/ability.service';
import { Observable } from 'rxjs';
import { AbilityLevel } from '../../ability/model/ability-level';
import { AuthorizationService } from '../../../authorization/authorization.service';
import { Course } from '../../courses/model/course';
import { CoursesService } from '../../courses/courses.service';
import { tap } from 'rxjs/operators';
import { User } from '../../../authorization/models/user';
import { RatingByStudentService } from '../../rating/rating-by-student.service';
import { Rating } from '../../rating/model/rating';

@Component({
  selector: 'spx-personal-area-page',
  templateUrl: './personal-area-page.component.html',
  styleUrls: ['./personal-area-page.component.scss'],
  providers: [
    AbilityService,
    CoursesService,
    RatingByStudentService
  ]
})
export class PersonalAreaPageComponent implements OnInit {
  public readonly isTeacher: Observable<boolean>;
  public readonly isStudent: Observable<boolean>;
  public readonly isLoading: Observable<boolean>;
  public readonly courses: Observable<Course[]>;
  public readonly user: Observable<User>;
  public readonly rating: Observable<Rating>;


  public readonly abilityLevels: Observable<AbilityLevel[]>;

  constructor(
      private readonly _abilityService: AbilityService,
      private readonly _coursesService: CoursesService,
      private readonly _ratingByStudentService: RatingByStudentService,
      private readonly _authorizationService: AuthorizationService
  ) {
    this.isTeacher = this._authorizationService.isTeacher;
    this.isStudent = this._authorizationService.isStudent;
    this.abilityLevels = this._abilityService.content;
    this.courses = this._coursesService.content;
    this.isLoading = this._coursesService.load;
    this.rating = this._ratingByStudentService.content;

    this.user = this._authorizationService
        .user
        .pipe(tap(({ id }) => {
          this._coursesService.setParams({ studentId: id });
          this._abilityService.setAccountId(id);
        }));

  }

  ngOnInit() {
  }

}
