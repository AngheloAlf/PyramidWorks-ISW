import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../../../models/Company';
import { Option } from '../../../models/Option';
import { OptionsService } from '../../../services/options.service';
import { CompaniesService } from '../../../services/companies.service';
import { FormBuilder, FormGroup, Validators} from  '@angular/forms';

declare var $: any;
interface Parameter{
  seller: {
    to: string,
    region: string,
    type: string,
    selectAll: boolean
  },
  buyer: {
    to: string,
    region: string,
    type: string,
    selectAll: boolean
  }
}
@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  @ViewChild('sellerList') sellerList;
  @ViewChild('buyerList') buyerList;
  @ViewChild('popUpOptionForm') popUpOptionForm: ElementRef;

  company: Company;
  parameters: Parameter = {
    seller: {
      to: 'seller',
      region: 'Europea',
      type: 'Call',
      selectAll: false
    },
    buyer: {
      to: 'buyer',
      region: 'Europea',
      type: 'Call',
      selectAll: false
    }
  };
  form: FormGroup;
  to;
  ready: boolean = false;
  hidden: boolean = false;

  constructor(private route: ActivatedRoute, private companyData: CompaniesService, private optionService: OptionsService, private fb: FormBuilder) {
    this.form = fb.group({
      'contract_name': [null, Validators.compose([Validators.required, Validators.maxLength(70)])],
      'bid_price': [null, Validators.compose([Validators.required, Validators.min(0)])],
      'ask_price': [null, Validators.compose([Validators.required, Validators.min(0)])],
      'expire_date': [null, Validators.required],
      'strike_price': [null, Validators.compose([Validators.required, Validators.min(0)])],
      'region': [null],
      'to': [null],
      'type': [null]
    });
  }

  ngOnInit() {
    this.companyData.get(Number(this.route.snapshot.paramMap.get('id'))).subscribe(company => {
      this.company = company;
      this.ready = true;
      console.log(this.company);
    });
  }

  change(to, option, optionValue){
    let seller = this.parameters.seller;
    let buyer = this. parameters.buyer;
    console.log(option, optionValue)
    if(to === 'seller'){
      if (option === 'type'){
        seller = {
          to: 'seller',
          type: optionValue,
          region: seller.region,
          selectAll: seller.selectAll
        }
      }
      if(option === 'toggleAll'){
        seller = {
          to: 'seller',
          type: seller.type,
          region: seller.region,
          selectAll: optionValue
        }
      }
      if(option === 'region'){
        seller = {
          to: 'seller',
          type: seller.type,
          region: optionValue,
          selectAll: seller.selectAll
        }
      }
    }
    else{
      if (option === 'type'){
        buyer = {
          to: 'buyer',
          type: optionValue,
          region: buyer.region,
          selectAll: buyer.selectAll
        }
      }
      if(option === 'toggleAll'){
        buyer = {
          to: 'buyer',
          type: buyer.type,
          region: buyer.region,
          selectAll: optionValue
        }
      }
      if(option === 'region'){
        buyer = {
          to: 'buyer',
          type: buyer.type,
          region: optionValue,
          selectAll: buyer.selectAll
        }
      }
    }
    this.parameters = {seller: seller, buyer:buyer};
  }

  addOption(option: Option): void{
    option.pricing = null;
    option.to = this.to === 'sell' ? true : false;
    this.optionService.add(this.company, option).subscribe( response => {
      if(option.to){
        this.sellerList.pushOption(option)
        this.sellerList.listOptions();
      }
      else{
        this.buyerList.pushOption(option)
        this.buyerList.listOptions();
      }
      $('#popUpOptionForm').modal('hide');
    });
  }
}
