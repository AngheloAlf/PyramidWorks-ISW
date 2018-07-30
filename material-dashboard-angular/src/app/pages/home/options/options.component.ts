import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../../../models/Company';
import { Option } from '../../../models/Option';
import { OptionsService } from '../../../services/options.service';
import { CompaniesService } from '../../../services/companies.service';
import { FormBuilder, FormGroup, Validators} from  '@angular/forms';
import { $ } from 'protractor';

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

  @ViewChild('sellerList') sellerList;
  @ViewChild('buyerList') buyerList;
  @ViewChild('popUpOptionForm') popUpOptionForm: ElementRef;

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
  form2: FormGroup;
  to;
  ready: boolean = false;
  option_recived: Option;

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
    this.form2 = fb.group({
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
          region: this.parameters.buyer.region
        }
      }
      else{
        buyer = {
          to: 'buyer',
          type: this.parameters.buyer.type,
          region: optionValue
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
        this.sellerList.listOptions();
      }
      else{
        this.buyerList.listOptions();
      }
      //this.popUpOptionForm.modal('hide');
    })
  }

  receiveOption(eventCompany){
    alert("Recivido");
    console.log(eventCompany);
    this.option_recived = eventCompany;
    document.getElementById("edit_contract_name").setAttribute("value", this.option_recived.contract_name);
    document.getElementById("edit_contract_name_label").classList.remove("is-empty");

    document.getElementById("edit_region").setAttribute("selectedIndex", this.option_recived.region ? "1" : "0");
    document.getElementById("edit_region").setAttribute("value", this.option_recived.region ? "Europea" : "Americana");

    document.getElementById("edit_strike_price").setAttribute("value", this.option_recived.strike_price.toString());
    document.getElementById("edit_strike_price_label").classList.remove("is-empty");

    document.getElementById("edit_bid_price").setAttribute("value", this.option_recived.bid_price.toString());
    document.getElementById("edit_bid_price_label").classList.remove("is-empty");

    document.getElementById("edit_ask_price").setAttribute("value", this.option_recived.ask_price.toString());
    document.getElementById("edit_ask_price_label").classList.remove("is-empty");

    document.getElementById("edit_type").setAttribute("selectedIndex", this.option_recived.type ? "1" : "0");
    document.getElementById("edit_type").setAttribute("value", this.option_recived.type ? "Put" : "Call");

    document.getElementById("edit_to").setAttribute("selectedIndex", this.option_recived.type ? "1" : "0");
    document.getElementById("edit_to").setAttribute("value", this.option_recived.type ? "Sell" : "Buy");

    document.getElementById("edit_date").setAttribute("value", this.option_recived.expire_date);
    document.getElementById("edit_date_label").classList.remove("is-empty");
  }

  updateOption(option: Option): void{
    option.pricing = this.option_recived.pricing;
    option.id = this.option_recived.id;

    this.optionService.edit(this.company, option).subscribe(response => {
      alert(response);
      alert("Actualizado!");
      }
    );
  }
}
