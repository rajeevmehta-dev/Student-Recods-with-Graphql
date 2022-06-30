import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  HttpClient,
  HttpClientJsonpModule,
  HttpClientModule,
} from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";

import { GridModule } from "@progress/kendo-angular-grid";

import { AppComponent } from "./app.component";
import { AppService } from "./app.service";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    GridModule,
  ],
  providers: [
    {
      deps: [HttpClient],
      provide: AppService,
      useFactory: (jsonp: HttpClient) => () => new AppService(jsonp),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
