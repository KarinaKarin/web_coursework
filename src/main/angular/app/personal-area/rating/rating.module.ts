import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingPageComponent } from './pages/rating-page/rating-page.component';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from '../../prime-ng.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RatingPageComponent],
  imports: [
    CommonModule,
    RouterModule,
    PrimeNgModule,
    FormsModule,
    TranslateModule.forChild(),
  ]
})
export class RatingModule { }
