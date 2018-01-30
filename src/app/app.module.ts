import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component/app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule,
  MatStepperModule
} from '@angular/material';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatListModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatStepperModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
