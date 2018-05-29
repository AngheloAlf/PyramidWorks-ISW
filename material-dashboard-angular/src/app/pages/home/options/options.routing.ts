/*import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import {OptionsComponent} from './options.component';
import { AddListOptionsComponent } from './components/add-list-options/add-list-options.component';



const routes: Routes = [
  { path: 'home/options',  component: OptionsComponent,
    children: [
      { path: 'addListOptions',      component: AddListOptionsComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  exports: [
    RouterModule
  ],
})
export class OptionsRoutingModule { }
*/
