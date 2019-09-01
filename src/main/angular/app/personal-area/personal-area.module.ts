import {RouterModule} from '@angular/router';
import {PrimeNgModule} from '../prime-ng.module';
import {TranslateModule} from '@ngx-translate/core';
import {PersonalAreaComponent} from "./personal-area/personal-area.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ScheduleModule} from "./schedule/schedule.module";
import {PersonalAreaPageComponent} from './pages/personal-area-page/personal-area-page.component';
import {CoursesModule} from "./courses/courses.module";
import {TeachersModule} from "./teachers/teachers.module";
import { AbilityModule } from './ability/ability.module';
import {RatingModule} from "./rating/rating.module";
import {SettingsModule} from "./settings/settings.module";
import { LessonsModule } from './lessons/lessons.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
       PersonalAreaComponent,
       PersonalAreaPageComponent

    ],
    exports: [
        PersonalAreaComponent,
        ScheduleModule,
        CoursesModule,
        TeachersModule,
        RatingModule,
        SettingsModule,
        LessonsModule
    ],
    imports: [
        CommonModule,
        RouterModule,
        PrimeNgModule,
        FormsModule,
        TranslateModule.forChild(),
        ScheduleModule,
        CoursesModule,
        TeachersModule,
        RatingModule,
        AbilityModule,
        SettingsModule,
        LessonsModule
    ]
})
export class PersonalAreaModule { }
