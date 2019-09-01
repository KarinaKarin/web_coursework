import { Component } from '@angular/core';
import { AuthorizationService } from '../../authorization.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'spx-recovery-password-page',
  templateUrl: './recovery-password-page.component.html',
  styleUrls: ['./recovery-password-page.component.scss']
})
export class RecoveryPasswordPageComponent {

  public readonly form: FormGroup;

  constructor(
      private readonly _formBuilder: FormBuilder,
      private readonly _authorizationService: AuthorizationService,
      private readonly _router: Router
  ) {
    this.form = this._formBuilder.group({
      'email': [ null, [ Validators.required, Validators.email ] ]
    })
  }

  public submit(): void {
    const { email } = this.form.value;
    this._authorizationService
        .recoveryPassword(email)
        .subscribe(() => {
          this._router.navigateByUrl('/auth');
        });
  }

}
