import { Component, OnInit, OnChanges, Output, Input, EventEmitter} from '@angular/core';
import { CompaniesService } from '../../../../services/companies.service';
import { Company } from '../../../../models/Company';
import { FormBuilder, FormGroup, Validators} from  '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.css']
})
export class CompaniesListComponent implements OnInit, OnChanges {

  companies: Company[] = [];
  companySelected: Company;
  newCompany: Company;
  form: FormGroup;

  @Output() companyEvent = new EventEmitter<Company>();
  @Input() companiesToCompare: Company[];
  @Input() maxCompanies: number;

  ngOnChanges(){
    console.log('hello');
  }

  constructor(private companiesData:CompaniesService, private fb: FormBuilder) {
    this.form = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.maxLength(70)])],
      'ticker': [null, Validators.compose([Validators.required, Validators.maxLength(10)])]
    });
  }

  ngOnInit() {
    this.listCompanies();
  }

  selectCompany(company: Company){
    this.companySelected = company;
  }

  deselect(){
    this.companySelected = undefined;
  }

  listCompanies(): void{
    this.companiesData.list().subscribe(companies => {
      this.companies = companies;
    })
  }

  getCompany(company: Company): void{
    this.companySelected = company;
    this.companiesData.get(company).subscribe(company => {
      console.log(company);
    })
  }

  addCompany(company: Company): void{
    this.newCompany = company;
    this.companiesData.add(company).subscribe( response => {
      console.log(response);
      this.companies.push(response);
      console.log(this.companies);
    })
  }

  editCompany(): void{
    this.companiesData.edit(this.companySelected).subscribe( () => {
      this.deselect();
      this.listCompanies();
    });
  }

  deleteCompany(company: Company): void {
    if(confirm(`¿Estas seguro que quieres eliminar ${company.name} y sus datos relacionados?`)){
      this.companiesData.delete(company).subscribe(() => {
        _.remove(this.companies, e => e.id == company.id);
        console.log(this.companies);
      });
    }
  }

  sendCompany(company: Company){
    this.companyEvent.emit(company);
  }
  /*
  showNotification(from: string, align: string) {
    let color = Math.floor((Math.random() * 4) + 1);
    $.notify({
        icon: "notifications",
        message: "Welcome to <b>Material Dashboard</b> - a beautiful freebie for every web developer."
    }, {
        type: type[color],
        timer: 4000,
        placement: {
            from: from,
            align: align
        }
    });
  }*/
}
