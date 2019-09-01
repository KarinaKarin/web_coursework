import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './authorization/pages/login-page/login-page.component';
import { AuthComponent } from './authorization/pages/auth/auth.component';
import { RegistrationPageComponent } from './authorization/pages/registration-page/registration-page.component';
import { RecoveryPasswordPageComponent } from './authorization/pages/recovery-password-page/recovery-password-page.component';
import { PersonalAreaComponent } from './personal-area/personal-area/personal-area.component';
import { ScheduleComponent } from './personal-area/schedule/schedule/schedule.component';
import { NotificationsPageComponent } from './personal-area/schedule/pages/notifications-page/notifications-page.component';
import { TodayPageComponent } from './personal-area/schedule/pages/today-page/today-page.component';
import { TomorrowPageComponent } from './personal-area/schedule/pages/tomorrow-page/tomorrow-page.component';
import { PersonalAreaPageComponent } from './personal-area/pages/personal-area-page/personal-area-page.component';
import { WeekPageComponent } from './personal-area/schedule/pages/week-page/week-page.component';
import { CoursesPageComponent } from './personal-area/courses/pages/courses-page/courses-page.component';
import { AuthorizationGuard } from './authorization/authorization.guard';
import {CoursePageComponent} from "./personal-area/courses/pages/course-page/course-page.component";
import {TeachersModule} from "./personal-area/teachers/teachers.module";
import {TeachersPageComponent} from "./personal-area/teachers/pages/teachers-page/teachers-page.component";
import {TeacherProfilePageComponent} from "./personal-area/teachers/pages/teacher-profile-page/teacher-profile-page.component";
import {RatingPageComponent} from "./personal-area/rating/pages/rating-page/rating-page.component";
import {SettingsPageComponent} from "./personal-area/settings/pages/settings-page/settings-page.component";
import {CreateCoursePageComponent} from "./personal-area/courses/pages/create-course-page/create-course-page.component";
import { LessonPageComponent } from './personal-area/lessons/pages/lesson-page/lesson-page.component';

const routes: Routes = [
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: LoginPageComponent
            },
            {
                path: 'registration',
                component: RegistrationPageComponent
            },
            {
                path: 'recovery-password',
                component: RecoveryPasswordPageComponent
            }
        ]
    },
    {
        path: '',
        component: PersonalAreaComponent,
        canActivate: [ AuthorizationGuard ],
        canActivateChild: [ AuthorizationGuard ],
        children: [
            {
                path: 'schedule',
                component: ScheduleComponent,
                children: [

                    {
                        path: 'today',
                        component: TodayPageComponent
                    },
                    {
                        path: 'tomorrow',
                        component: TomorrowPageComponent
                    },
                    {
                        path: 'week',
                        component: WeekPageComponent
                    },
                    {
                        path: '**',
                        redirectTo: 'today'
                    }
                ]
            },
            {
                path: 'personal-area',
                component: PersonalAreaPageComponent,
                children: [
                    {
                        path: ':courseId',
                        component: CoursePageComponent
                    }
                ]
            },
            {
                path: 'courses',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: CoursesPageComponent
                    },
                    {
                        path: 'create-course',
                        component: CreateCoursePageComponent
                    },
                    {
                        path: ':courseId',
                        component: CoursePageComponent
                    }

                ]
            },
            {
                path: 'teachers',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: TeachersPageComponent
                    },
                    {
                        path: ':teacherId',
                        component: TeacherProfilePageComponent
                    }
                ]
            },
            {
                path: 'rating',
                component: RatingPageComponent
            },
            {
                path: 'settings',
                component: SettingsPageComponent
            },
            {
                path: 'lessons',
                children: [
                    {
                        path: ':lessonId',
                        component: LessonPageComponent
                    }
                ]
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/schedule/notifications'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
