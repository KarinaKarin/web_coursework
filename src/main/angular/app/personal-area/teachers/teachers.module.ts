import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TeachersPageComponent} from './pages/teachers-page/teachers-page.component';
import {PrimeNgModule} from "../../prime-ng.module";
import {RouterModule} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import { TeacherProfilePageComponent } from './pages/teacher-profile-page/teacher-profile-page.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TeachersPageComponent, TeacherProfilePageComponent],
  exports: [TeachersPageComponent, TeacherProfilePageComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PrimeNgModule,
    TranslateModule.forChild(),
  ]
})
export class TeachersModule { }
