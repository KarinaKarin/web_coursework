import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Rating } from '../../model/rating';
import { RatingsAvgService } from '../../ratings-avg.service';

@Component({
  selector: 'spx-rating-page',
  templateUrl: './rating-page.component.html',
  styleUrls: ['./rating-page.component.scss'],
  providers: [
    RatingsAvgService
  ]
})
export class RatingPageComponent implements OnInit {

  public ratings: Observable<Rating[]>;

  constructor(
      private readonly _ratingsService: RatingsAvgService
  ) {
    this.ratings = this._ratingsService.content;
  }

  ngOnInit() {
  }

}
