import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService } from '../../authorization.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../storage.service';

@Component({
    selector: 'spx-registration-page',
    templateUrl: './registration-page.component.html',
    styleUrls: ['./registration-page.component.scss']
})
export class RegistrationPageComponent {

    public isSubmitted: boolean;
    public readonly now: Date;
    public readonly form: FormGroup;

    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _authorizationService: AuthorizationService,
        private readonly _messageService: MessageService,
        private readonly _translateService: TranslateService,
        private readonly _storageService: StorageService
    ) {
        this.isSubmitted = false;
        this.form = this._formBuilder.group({
            'email': [ null, [ Validators.required, Validators.email ] ],
            'birthday': [ null, Validators.required ],
            'firstName': [ null, Validators.required ],
            'lastName': [ null, Validators.required ],
            'heroName': [ null ],
            'password': [ null, Validators.required ],
            'passwordConfirm': [ null, Validators.required ]
        })
    }

    public submit(): void {
        const { birthday } = this.form.value;
        this._authorizationService
            .registration({
                ...this.form.value, birthday: birthday && birthday.toISOString()
            })
            .subscribe(() => {
                this.isSubmitted = true;
                this._messageService.add({
                    severity: 'success',
                    summary: this._translateService.instant('AuthModule.Registration.Header'),
                    detail: this._translateService.instant('AuthModule.Registration.Success.Message')
                });
            }, () => {
                this._messageService.add({
                    severity: 'error',
                    summary: this._translateService.instant('AuthModule.Registration.Header'),
                    detail: this._translateService.instant('AuthModule.Registration.Error.Message')
                });
            });
    }

}
