import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {PrimeNgModule} from "../../prime-ng.module";
import {TranslateModule} from "@ngx-translate/core";
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingsPageComponent],
  imports: [
    CommonModule,
    RouterModule,
    PrimeNgModule,
    TranslateModule.forChild(),
    ReactiveFormsModule
  ]
})
export class SettingsModule { }
