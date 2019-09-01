import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService } from '../../../../authorization/authorization.service';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'spx-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {

  public readonly form: FormGroup;

  constructor(
      private readonly _formBuilder: FormBuilder,
      private readonly _authorizationService: AuthorizationService,
      private readonly _router: Router
  ) {
    this.form = this._formBuilder.group({
      'firstName': [ null, [Validators.required] ],
      'lastName': [ null, [Validators.required] ],
      'heroName': [ null, [Validators.required] ],
      'birthday': [ null, [Validators.required] ],
      'avatar': [ null ]
    });

    this._authorizationService
        .user
        .pipe(first())
        .subscribe((user) => this.form.patchValue({
          ...user, birthday: moment(user.birthday).toDate()
        }))
  }

  ngOnInit() {
  }

  saveUser() {
    if (this.form.valid) {
      this._authorizationService
          .updateUser({
            ...this.form.value, birthday: moment(this.form.value.birthday).toISOString()
          })
          .subscribe(() => {
            this._router.navigateByUrl('/personal-area');
          });
    }
  }

  fileSelected(files: FileList) {
    this.form
        .controls
        .avatar
        .patchValue(files && files.item(0))
  }

}
