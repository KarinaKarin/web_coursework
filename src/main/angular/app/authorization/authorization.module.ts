import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthComponent } from './pages/auth/auth.component';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from '../prime-ng.module';
import { RecoveryPasswordPageComponent } from './pages/recovery-password-page/recovery-password-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthorizationGuard } from './authorization.guard';

@NgModule({
  declarations: [
    LoginPageComponent,
    RegistrationPageComponent,
    RecoveryPasswordPageComponent,
    AuthComponent
  ],
  exports: [
    LoginPageComponent,
    RegistrationPageComponent,
    RecoveryPasswordPageComponent,
    AuthComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,

    PrimeNgModule,

    TranslateModule.forChild()
  ],
  providers: [
    AuthorizationGuard
  ]
})
export class AuthorizationModule { }
