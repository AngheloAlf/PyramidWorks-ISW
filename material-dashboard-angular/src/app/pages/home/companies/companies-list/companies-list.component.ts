import { Component, OnInit, OnChanges, Output, Input, EventEmitter} from '@angular/core';
import { CompaniesService } from '../../../../services/companies.service';
import { Company } from '../../../../models/Company';
import { FormBuilder, FormGroup, Validators} from  '@angular/forms';

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.css']
})
export class CompaniesListComponent implements OnInit, OnChanges {

  companies: Company[];
  currentCompany: Company;
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
      'name': [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
      'ticker': [null, Validators.compose([Validators.required, Validators.maxLength(10)])]
    });
  }

  ngOnInit() {
    this.listCompanies();
  }

  listCompanies(): void{
    this.companiesData.list().subscribe(companies => {
      this.companies = companies;
    })
  }

  getCompany(company: Company | number): void{
    this.companiesData.get(company).subscribe(company => {
      console.log(company);
      this.currentCompany = company;
    })
  }

  addCompany(company: Company): void{
    this.newCompany = company;
    console.log(company);
    this.companiesData.add(company).subscribe(() => {
      this.listCompanies();
    })
  }

  editCompany(company: Company): void{
    this.companiesData.edit(company).subscribe( () => {
      this.listCompanies();
    });
  }

  deleteCompany(company: Company | number): void {
    this.companiesData.delete(company).subscribe( () => {
      this.listCompanies();
    });
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
