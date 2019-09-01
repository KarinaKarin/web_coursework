import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService } from '../../authorization.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { filter, first, map } from 'rxjs/operators';

@Component({
    selector: 'spx-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']

})
export class LoginPageComponent implements OnInit {

    @ViewChild('passwordInput')
    public passwordInput: ElementRef<HTMLInputElement>;

    public form: FormGroup;

    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _route: ActivatedRoute,
        private readonly _authorizationService: AuthorizationService,
        private readonly _messageService: MessageService,
        private readonly _translateService: TranslateService
    ) {
        this.form = this._formBuilder.group({
            'username': [ null, Validators.required ],
            'password': [ null, Validators.required ]
        });


    }

    public ngOnInit(): void {
        this._route
            .queryParams
            .pipe(
                filter((params) => !!params.emailConfirmed),
                map(({ emailConfirmed }) => emailConfirmed),
                first()
            )
            .subscribe((emailConfirmed) => {
                if (emailConfirmed) {
                    this.form.patchValue({ 'username': emailConfirmed });
                    this.passwordInput.nativeElement.focus();
                    this._messageService.add({
                        severity: 'success',
                        summary: this._translateService.instant('AuthModule.Login.EmailSubmit.Title'),
                        detail: this._translateService.instant('AuthModule.Login.EmailSubmit.Message')
                    });
                }
            });
    }

    public submit(): void {
        const { username, password } = this.form.value;

        this._authorizationService
            .login(username, password)
            .subscribe({
                error: ({ error }) => {
                    if (error && error.error === 'invalid_grant') {
                        this._messageService.add({
                            severity: 'error',
                            summary: this._translateService.instant('AuthModule.Login.Error.Title'),
                            detail: this._translateService.instant('AuthModule.Login.Error.Message')
                        });
                    }
                }
            });
    }

}
