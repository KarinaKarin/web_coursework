import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../authorization.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'spx-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(
      private readonly _authorizationService: AuthorizationService,
      private readonly _router: Router
  ) {
    this._authorizationService
        .isAuth
        .pipe(filter((isAuth) => isAuth))
        .subscribe(() => {
          this._router.navigateByUrl('/schedule/notifications');
        });
  }

  ngOnInit() {
  }

}
