import { Injectable } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { Observable } from 'rxjs';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable()
export class AuthorizationGuard implements CanActivate, CanActivateChild {

    constructor(
        private readonly _router: Router,
        private readonly _authorizationService: AuthorizationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.isAuth();
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.isAuth();
    }

    private isAuth(): Observable<boolean> {
        return this._authorizationService
            .isAuth
            .pipe(tap((isAuth) => {
                if (!isAuth) {
                    this._router.navigateByUrl('/auth')
                }
            }));
    }


}
