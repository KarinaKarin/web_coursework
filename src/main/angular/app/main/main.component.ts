import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../storage.service';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'spx-root',
  templateUrl: './main.component.html',
  styleUrls: [ './main.component.scss' ],
  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class MainComponent {

  constructor(
      private readonly _translate: TranslateService,
      private readonly _storage: StorageService
  ) {
    this._translate.setDefaultLang('en');

    this._translate.use(this._storage.getStringItem('LOCALE') || 'en');
  }
}
