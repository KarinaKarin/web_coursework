import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccessToken } from './models/access-token';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from './models/user';
import { StorageService } from '../storage.service';
import { Registration } from './models/registration';

@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {
    public readonly user: Observable<User>;
    public readonly isAuth: Observable<boolean>;
    public readonly isStudent: Observable<boolean>;
    public readonly isTeacher: Observable<boolean>;
    public readonly isAdministrator: Observable<boolean>;
    public readonly token: Observable<string | null>;

    private readonly _clientId = 'school-of-people-x';
    private readonly _clientSecret = 'school-of-people-x-secret';
    private readonly _storagePropertyName = 'TOKEN';
    private readonly _token: BehaviorSubject<AccessToken | null>;
    private readonly _user: ReplaySubject<User>;

    constructor(
        private readonly _http: HttpClient,
        private readonly _router: Router,
        private readonly _storage: StorageService
    ) {
        this._token = new BehaviorSubject(this._storage.getObjectItem(this._storagePropertyName));
        this.token = this._token
            .asObservable()
            .pipe(map((accessToken) => accessToken ? accessToken.access_token : null));
        this.isAuth = this.token.pipe(map((token) => !!token));

        this._user = new ReplaySubject(1);
        this.user = this._user.asObservable();
        this.isStudent = this.user.pipe(map(({ roles }) => roles.find(({ name }) => name === 'ROLE_STUDENT')));
        this.isTeacher = this.user.pipe(map(({ roles }) => roles.find(({ name }) => name === 'ROLE_TEACHER')));
        this.isAdministrator = this.user.pipe(map(({ roles }) => roles.find(({ name }) => name === 'ROLE_ADMIN')));

        this.isAuth
            .pipe(filter((isAuth) => isAuth))
            .subscribe(() => {
                this._http
                    .get<User>('/api/auth/me')
                    .subscribe((user) => {
                        this._user.next(user);
                    });
            })
    }

    public login(username, password): Observable<AccessToken> {
        let data = new URLSearchParams();

        data.append('username', username);
        data.append('password', password);
        data.append('grant_type','password');
        data.append('scope','read write');
        data.append('client_id', this._clientId);

        return this._http
            .post<AccessToken>('/oauth/token', data.toString(), {
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Authorization': `Basic ${btoa(`${this._clientId}:${this._clientSecret}`)}`
                }
            })
            .pipe(
                tap((token) => {
                    this._storage.setObjectItem(this._storagePropertyName, token);
                    this._token.next(token);
                })
            );
    }

    public registration(registration: Registration) {
        return this._http
            .post<User>('/api/auth/register', registration)
    }

    public recoveryPassword(email: string) {
        return this._http
            .post('/api/auth/recovery-password', {
                email
            })
    }

    public logout(): void {
        this._storage.removeItem(this._storagePropertyName);
        this._token.next(null);
        this._router.navigateByUrl('/auth');
    }

    public updateUser(user) {
        const formData: FormData = new FormData();

        Object.entries(user)
            .forEach(([ key, value ]: [ string, string | Blob ]) => formData.append(key, value))

        return this._http
            .put<User>('/api/auth/update', formData)
            .pipe(tap((user) => {
                this._user.next(user);
            }));
    }
}
