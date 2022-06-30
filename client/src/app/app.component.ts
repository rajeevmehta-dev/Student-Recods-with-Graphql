import { Observable } from "rxjs";
import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import {
  AddEvent,
  CancelEvent,
  EditEvent,
  GridComponent,
  GridDataResult,
  RemoveEvent,
  SaveEvent,
} from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { Student } from "./model";
import { map } from "rxjs/operators";
import { AppService } from "./app.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  public view: Observable<GridDataResult> | undefined;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 2,
  };
  public formGroup: FormGroup | undefined;

  private editService: AppService;
  private editedRowIndex: number | undefined;

  constructor(@Inject(AppService) editServiceFactory: () => AppService) {
    this.editService = editServiceFactory();
  }

  public ngOnInit(): void {
    this.view = this.editService.pipe(
      map((response: any) => {
        console.log(response);
        let resultData = [];
        if (response && (response.data || {} || {}).getAllStudents) {
          resultData = response.data.getAllStudents;
        }
        return process(resultData, this.gridState)}
        )
    );
    console.log(this.view);
    this.editService.read();
  }

  public onStateChange(state: State): void {
    this.gridState = state;
    this.editService.read();
  }

  public addHandler(args: AddEvent): void {
    this.closeEditor(args.sender);
    // define all editable fields validators and default values
    this.formGroup = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      // UnitsInStock: new FormControl(
      //   "",
      //   Validators.compose([
      //     Validators.required,
      //     Validators.pattern("^[0-9]{1,3}"),
      //   ]),
      // ),
    });
    // show the new row editor, with the `FormGroup` build above
    args.sender.addRow(this.formGroup);
  }

  public editHandler(args: EditEvent): void {
    // define all editable fields validators and default values
    const { dataItem } = args;
    this.closeEditor(args.sender);
    this.formGroup = new FormGroup({
      id: new FormControl(dataItem.id),
      name: new FormControl(dataItem.name, Validators.required),
      email: new FormControl(dataItem.email, Validators.required),
      dob: new FormControl(dataItem.dob, Validators.required),
    });

    this.editedRowIndex = args.rowIndex;
    args.sender.editRow(args.rowIndex, this.formGroup);
  }

  public cancelHandler(args: CancelEvent): void {
    // close the editor for the given row
    this.closeEditor(args.sender, args.rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
    const studentRecords: Student[] = formGroup.value;

    this.editService.save(studentRecords, isNew);

    sender.closeRow(rowIndex);
  }

  public removeHandler(args: RemoveEvent): void {
    this.editService.remove(args.dataItem);
  }

  private closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex) {
    // close the editor
    grid.closeRow(rowIndex);
    // reset the helpers
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
}
