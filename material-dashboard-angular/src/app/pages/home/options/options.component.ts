import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../../../models/Company';
import { Option } from '../../../models/Option';
import { OptionsService } from '../../../services/options.service';
import { CompaniesService } from '../../../services/companies.service';
import { FormBuilder, FormGroup, Validators} from  '@angular/forms';

interface Parameter{
  seller: {
    to: string,
    region: string,
    type: string
  },
  buyer: {
    to: string,
    region: string,
    type: string
  }
}
@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  company: Company;
  parameters: Parameter = {
    seller: {
      to: 'seller',
      region: 'Europea',
      type: 'Call'
    },
    buyer: {
      to: 'buyer',
      region: 'Europea',
      type: 'Call'
    }
  };
  form: FormGroup;

  constructor(private route: ActivatedRoute, private companyData: CompaniesService, private optionService: OptionsService, private fb: FormBuilder) {
    this.form = fb.group({
      'contract_name': [null, Validators.compose([Validators.required, Validators.maxLength(70)])],
      'bid_price': [null, Validators.compose([Validators.required, Validators.maxLength(70)])],
      'ask_price': [null, Validators.compose([Validators.required, Validators.maxLength(70)])],
      'date': [null, Validators.compose([Validators.required, Validators.maxLength(70)])],
      'strike_price': [null, Validators.compose([Validators.required, Validators.maxLength(10)])]
    });
  }

  ngOnInit() {
    this.companyData.get(Number(this.route.snapshot.paramMap.get('id'))).subscribe(company => {
      this.company = company;
      console.log(this.company);
    });
  }

  change(to, option, optionValue){
    console.log('wea');
    let seller = this.parameters.seller;
    let buyer = this. parameters.buyer;
    if(to === 'seller'){
      if (option == 'type'){
        seller = {
          to: 'seller',
          type: optionValue,
          region: this.parameters.seller.region
        }
      }
      else{
        seller = {
          to: 'seller',
          type: this.parameters.seller.type,
          region: optionValue
        }
      }
    }
    else{
      if (option == 'type'){
        buyer = {
          to: 'buyer',
          type: optionValue,
          region: this.parameters.seller.region
        }
      }
      else{
        buyer = {
          to: 'buyer',
          type: this.parameters.seller.type,
          region: optionValue
        }
      }
    }
    this.parameters = {seller: seller, buyer:buyer};
  }

  addOption(option: Option): void{

    this.optionService.add(this.company, option).subscribe( response => {
      
    })
  }
}
