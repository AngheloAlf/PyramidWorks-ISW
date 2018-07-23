import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../../../models/Company';
import { CompaniesService } from '../../../services/companies.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  company: Company;
  parameters: {
    calculation: string,
    seller: { 
      type: string
    },
    buyer: {
      type: string
    }
  };

  constructor(private route: ActivatedRoute, private companyData: CompaniesService) { }

  ngOnInit() {
    this.companyData.get(Number(this.route.snapshot.paramMap.get('id'))).subscribe(company => {
      this.company = company;
      console.log(this.company);
    })
  }

  

}
