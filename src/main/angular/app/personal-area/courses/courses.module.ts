import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesPageComponent } from './pages/courses-page/courses-page.component';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from '../../prime-ng.module';
import { TranslateModule } from '@ngx-translate/core';
import { CoursePageComponent } from './pages/course-page/course-page.component';
import { CreateCoursePageComponent } from './pages/create-course-page/create-course-page.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CoursesPageComponent, CoursePageComponent, CreateCoursePageComponent],
  imports: [
    CommonModule,
    RouterModule,
    PrimeNgModule,
    TranslateModule.forChild(),
    ReactiveFormsModule
  ]
})
export class CoursesModule { }
