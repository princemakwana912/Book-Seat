import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type SEAT_ROW = {
  row: number;
  booked: number;
  max: number;
  start: number;
  booked_seats: number[];
};

type DATASTORE = {
  seatChart: SEAT_ROW[];
  total: number;
  booked: number;
  rem: number;
};

@Injectable()
export class DbService {
  constructor() { }
  private dataStore: DATASTORE = {
    seatChart: [
      { row: 1, booked: 0, max: 4, start: 1, booked_seats: [] },
      { row: 2, booked: 0, max: 4, start: 5, booked_seats: [] },
      { row: 3, booked: 0, max: 4, start: 9, booked_seats: [] },
      { row: 4, booked: 0, max: 4, start: 13, booked_seats: [] }

    ],
    total: 16,
    booked: 0,
    rem: 16,
  };
  private _data = new BehaviorSubject<DATASTORE>(this.dataStore);

  get data() {
    return this._data.asObservable();
  }

  bookSeats(seatsToBook: number) {
    let rem = seatsToBook;
    let bookedSeats = [];

    main: for (let row of this.dataStore.seatChart) {
      if (rem === 0) break main;
      const rowBookings = Math.min(row.max - row.booked, rem);
      rem -= rowBookings;
      row.booked += rowBookings;
      const bs = row.booked_seats;
      let count = 0;
      inner: for (let i = row.start; i <= row.start + row.max; i++) {
        if (count === rowBookings) break inner;
        const alreadyBooked = bs.some((n) => n === i);
        if (!alreadyBooked) {
          count++;
          bs.push(i);
          bookedSeats.push(i);
        }
      }
    }
    this.dataStore.booked += seatsToBook;
    this.dataStore.rem -= seatsToBook;
    return [bookedSeats, this.dataStore.rem];
  }
}
