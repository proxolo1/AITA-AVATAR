import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatComponent } from './chat/chat.component';
import { MarkdownModule } from 'ngx-markdown';
import { ButtonsComponent } from './buttons/buttons.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { EffectsModule } from '@ngrx/effects';
import { ChatContentComponent } from './chat/chat-content/chat-content.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SignupComponent } from './signup/signup/signup.component';
import {  HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { AvatarComponent } from './avatar/avatar.component';
@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ButtonsComponent,
    SidebarComponent,
    ChatContentComponent,
    SignupComponent,
    LoginComponent,
    AvatarComponent,
  ],
  imports: [
    EffectsModule.forRoot([]),
    BrowserModule,
    MatDialogModule,
    MatButtonModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatInputModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule {}
