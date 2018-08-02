import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { PagesModule } from './pages/pages.module';

import { AppComponent } from './app.component';

import { CompaniesService } from './services/companies.service';
import { StocksService } from './services/stocks.service';
import { OptionsService } from './services/options.service';
import { CalculationsService } from './services/calculations.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,

    AppRoutingModule,
    PagesModule,
  ],
  providers: [
    CompaniesService,
    StocksService,
    OptionsService,
    CalculationsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
