import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage.service';
import { AccessToken } from './models/access-token';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

    constructor(
        private readonly _storage: StorageService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this._storage.getObjectItem<AccessToken>('TOKEN');

        return token && token.access_token
            ? next.handle(request.clone({ setHeaders: { 'Authorization': `Bearer ${token.access_token}` } }))
            : next.handle(request);
    }
}
