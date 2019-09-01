import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule/schedule.component';
import {RouterModule} from "@angular/router";
import {PrimeNgModule} from "../../prime-ng.module";
import {TranslateModule} from "@ngx-translate/core";
import { NotificationsPageComponent } from './pages/notifications-page/notifications-page.component';
import { TodayPageComponent } from './pages/today-page/today-page.component';
import { TomorrowPageComponent } from './pages/tomorrow-page/tomorrow-page.component';
import { WeekPageComponent } from './pages/week-page/week-page.component';
import {FullCalendarModule} from "@fullcalendar/angular";

@NgModule({
    declarations: [ScheduleComponent, NotificationsPageComponent, TodayPageComponent, TomorrowPageComponent, WeekPageComponent],
    exports: [ScheduleComponent, NotificationsPageComponent, TodayPageComponent, TomorrowPageComponent, WeekPageComponent],
    imports: [
        CommonModule,
        RouterModule,
        PrimeNgModule,
        TranslateModule.forChild(),
        FullCalendarModule
    ]
})
export class ScheduleModule { }
