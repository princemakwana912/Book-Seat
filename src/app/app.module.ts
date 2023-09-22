import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SeatbookComponent } from './seatbook/seatbook.component';
import { DbService } from './seatbook/db.service';

@NgModule({
  declarations: [
    AppComponent,
    SeatbookComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DbService],
  bootstrap: [AppComponent]
})
export class AppModule { }
