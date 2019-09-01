import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MenuItem} from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthorizationService } from '../../authorization/authorization.service';
import { User } from '../../authorization/models/user';
import { StorageService } from '../../storage.service';

@Component({
    templateUrl: './personal-area.component.html',
    styleUrls: ['./personal-area.component.scss']
})
export class PersonalAreaComponent implements OnInit, OnDestroy {

    public readonly mobileQuery: MediaQueryList;

    public readonly user: Observable<User>;

    public readonly items: Observable<MenuItem[]>;

    private readonly _mobileQueryListener: () => void;

    constructor(
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _media: MediaMatcher,
        private readonly _translateService: TranslateService,
        private readonly _authorizationService: AuthorizationService,
        private readonly _storage: StorageService,
        private readonly _confirmationService: ConfirmationService
    ) {
        this.user = this._authorizationService.user;
        this.mobileQuery = _media.matchMedia('(min-width: 768px)');
        this._mobileQueryListener = () => _changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);

        this.items = merge(of(true), this._translateService.onLangChange)
            .pipe(
                map<any, MenuItem[]>(() => [
                        {
                            label: this._translateService.instant('PersonalAreaModule.Schedule'),
                            routerLink: '/schedule'
                        },
                        {
                            label: this._translateService.instant('PersonalAreaModule.PersonalArea'),
                            routerLink: '/personal-area'
                        },
                        {
                            label: this._translateService.instant('PersonalAreaModule.Courses'),
                            routerLink: '/courses'
                        },
                        {
                            label: this._translateService.instant('PersonalAreaModule.Teachers'),
                            routerLink: '/teachers'
                        },
                        {
                            label: this._translateService.instant('PersonalAreaModule.Rating'),
                            routerLink: '/rating'
                        },
                        {
                            label: this._translateService.instant('PersonalAreaModule.Settings'),
                            routerLink: '/settings',
                            items: [
                                [
                                    {
                                        label: this._translateService.instant('PersonalAreaModule.Settings'),
                                        items: [
                                            {
                                                label: this._translateService.instant('PersonalAreaModule.PersonalSettings'),
                                                routerLink: '/settings'
                                            }
                                        ]
                                    },
                                    {
                                        label: this._translateService.instant('PersonalAreaModule.Language'),
                                        items: [
                                            {
                                                label: 'English',
                                                command: () => this.setLocale('en')
                                            },
                                            {
                                                label: 'Русский',
                                                command: () => this.setLocale('ru')                                            }
                                        ]
                                    }
                                ]

                            ]
                        },
                        {
                            label: this._translateService.instant('PersonalAreaModule.Logout'),
                            command: () => this.confirm()
                        }
                    ]
                ));
    }

    public ngOnInit(): void {

    }

    public ngOnDestroy(): void {
        this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    }

    private setLocale(locale) {
        this._translateService.use(locale);
        this._storage.setStringItem('LOCALE', locale);
    }

    confirm() {
        this._confirmationService.confirm({
            message: this._translateService.instant('PersonalAreaModule.ConfirmLogout'),
            accept: () => {
                this._authorizationService.logout()
            }
        });
    }

}




