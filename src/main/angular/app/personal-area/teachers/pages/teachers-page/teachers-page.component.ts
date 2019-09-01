import { Component, OnInit } from '@angular/core';
import { TeachersService } from '../../teachers.service';
import { Observable } from 'rxjs';
import { Teacher } from '../../model/teacher';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Unsubscribable } from '../../../../common/unsubscribable';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'spx-teachers-page',
  templateUrl: './teachers-page.component.html',
  styleUrls: ['./teachers-page.component.scss'],
  providers: [
    TeachersService
  ]
})
export class TeachersPageComponent extends Unsubscribable implements OnInit {

  public readonly teachers: Observable<Teacher[]>;
  public readonly filters: FormGroup;

  constructor(
      private readonly _teachersService: TeachersService,
      private readonly _formBuilder: FormBuilder
  ) {
    super();
    this.teachers = this._teachersService.content;
    this.filters = this._formBuilder.group({
      'firstName': null,
      'lastName': null,
      'ability': null,
      'onlyMy': null
    });

    this.filters
        .valueChanges
        .pipe(takeUntil(this._destroy))
        .subscribe((filters) => this._teachersService.setFilters(filters));
  }

  ngOnInit() {
  }

}
