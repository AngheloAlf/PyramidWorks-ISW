import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '../../components/components.module';
import { HomeRoutingModule } from './home.routing';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { CompaniesComponent } from './companies/companies.component';
import { CompaniesListComponent } from './companies/companies-list/companies-list.component';
import { CompaniesStockChartsComponent } from './companies/companies-stock-charts/companies-stock-charts.component';
import { OptionsComponent } from './options/options.component';
import { OptionListComponent } from './options/option-list/option-list.component'


@NgModule({
  imports: [
    CommonModule,

    ComponentsModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    HomeComponent,
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    CompaniesComponent,
    CompaniesListComponent,
    CompaniesStockChartsComponent,
    OptionsComponent,
    OptionListComponent
  ]
})
export class HomeModule { }
