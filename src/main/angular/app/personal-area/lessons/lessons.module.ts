import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonPageComponent } from './pages/lesson-page/lesson-page.component';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from '../../prime-ng.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataGridModule } from 'primeng/primeng';

@NgModule({
  declarations: [LessonPageComponent],
  imports: [
    CommonModule,
    RouterModule,
    PrimeNgModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    FormsModule,
    DataGridModule
  ],
  exports: [LessonPageComponent]
})
export class LessonsModule { }
