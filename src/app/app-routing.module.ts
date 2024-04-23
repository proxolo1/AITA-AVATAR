import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { SignupComponent } from './signup/signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  { path: 'chat/:id', component: ChatComponent, canActivate: [AuthGuard] },
  {
    path: 'chat', component: ChatComponent, canActivate: [AuthGuard]
  },
  { path: 'signup', component: SignupComponent },
  {
    path: '**', component: LoginComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    StoreModule.forRoot({}),
    StoreRouterConnectingModule.forRoot(),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
