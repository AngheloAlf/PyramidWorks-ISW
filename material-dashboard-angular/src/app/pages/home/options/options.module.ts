import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { OptionsComponent } from './options.component';
import { AddListOptionsComponent } from './components/add-list-options/add-list-options.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    OptionsComponent,
    AddListOptionsComponent
  ]
})
export class OptionsModule { }
