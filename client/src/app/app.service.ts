import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Student } from './model';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

@Injectable()
export class AppService extends BehaviorSubject<Student[]> {
  constructor(private http: HttpClient) {
    super([]);
  }

  private data: Student[] = [];
  baseurl = environment.baseurl;

  public read(): void {
    if (this.data.length) {
      return super.next(this.data);
    }

    this.fetch()
      .pipe(
        tap((response: any) => {
          const {
            data: { getAllStudents: resultData },
          } = response;
          this.data = <Student[]>resultData || [];
          console.log(this.data);
        }),
      )
      .subscribe((data) => {
        super.next(data);
      });
  }

  public save(data: Student[], isNew?: boolean): void {
    const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

    this.reset();

    this.fetch(action, data).subscribe(
      () => this.read(),
      () => this.read(),
    );
  }

  public remove(data: Student[]): void {
    this.reset();

    this.fetch(REMOVE_ACTION, data).subscribe(
      () => this.read(),
      () => this.read(),
    );
  }

  public resetItem(dataItem: Student): void {
    if (!dataItem) return;

    // find orignal data item
    const originalDataItem = this.data.find((item) => item.id === dataItem.id);

    // revert changes
    Object.assign(originalDataItem || [], dataItem);

    super.next(this.data);
  }

  private reset() {
    this.data = [];
  }

  private fetch(action = '', data?: any): Observable<Student[]> {
    // return this.http
    //   .jsonp(
    //     `https://demos.telerik.com/kendo-ui/service/Products/${action}?${this.serializeModels(
    //       data,
    //     )}`,
    //     'callback',
    //   )
    //   .pipe(map((res) => <Student[]>res));
    const body = {
      query: 'query { getAllStudents { id name age dob email } }',
    };
    return this.http
      .post<Student[]>(this.baseurl, body)
      .pipe(catchError(this.handleError));
  }

  private serializeModels(data?: Student[]): string {
    return data ? `&models=${JSON.stringify([data])}` : '';
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`,
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
