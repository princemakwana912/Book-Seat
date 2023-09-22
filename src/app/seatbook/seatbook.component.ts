import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DbService } from "./db.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Component({
  selector: 'app-seatbook',
  templateUrl: './seatbook.component.html',
  styleUrls: ['./seatbook.component.scss']
})
export class SeatbookComponent implements OnInit {
  bookings: any;
  constructor(private _fb: FormBuilder, private serv: DbService) { }
  bookingForm!: FormGroup;
  public data$!: Observable<any>;
  public fourSeater = [1, 2, 3, 4];
  public threeSeater = [1, 2, 3];
  public message = "";
  total: number = 0;
  booked: number = 0;
  rem: number | number[] = 0;


  ngOnInit(): void {
    this.createForm();
    this.data$ = this.serv.data.pipe(tap(d => (this.rem = d.rem)));
  }

  createForm() {
    this.bookingForm = this._fb.group({
      seatsToBook: ["", Validators.required]
    });
  }

  getSeatNum(n: number, row: number) {
    return (row - 1) * 4 + n;
  }

  checkBook(n: number, row: number, bs: number[]): boolean {
    const seat = this.getSeatNum(n, row);
    return bs.some(bs => bs === seat);
  }

  book() {
    if (!this.bookingForm.valid) return;
    let { seatsToBook } = this.bookingForm.value;
    if (seatsToBook > 7) {
      this.message = "Max 7 seats at a time";
      this.hideMessage();
      return;
    }
    if (seatsToBook <= 0) {
      this.message = "Min of 1 seat required";
      this.hideMessage();
      return;
    }
    if (this.rem < seatsToBook) {
      this.message = `Only ${this.rem} seats available, reduce num of seats`;
      this.hideMessage();
      return;
    }
    const [bookedSeats, rem] = this.serv.bookSeats(seatsToBook);
    this.rem = rem;
    this.bookings.unshift({
      time: Date.now(),
      seats: bookedSeats
    });
  }

  hideMessage(t = 1500) {
    setTimeout(() => (this.message = ""), t);
  }
}

