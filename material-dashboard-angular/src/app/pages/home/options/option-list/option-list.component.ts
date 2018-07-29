import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Company } from '../../../../models/Company';
import { Option } from '../../../../models/Option';
import { OptionsService } from '../../../../services/options.service';

@Component({
  selector: 'app-option-list',
  templateUrl: './option-list.component.html',
  styleUrls: ['./option-list.component.css']
})
export class OptionListComponent implements OnInit, OnChanges {

  private _parameters;
  show: boolean;
  @Input() company: Company;
  @Input() 
  set parameters(parameters){
    this._parameters = {
      to: parameters.to === 'seller' ? true : false,
      type: parameters.type === 'Put' ? true : false,
      region: parameters.region === 'Europea' ? true : false
    }
  }
  options: Option[];

  constructor(private DataOptions: OptionsService) {
   }

  ngOnInit() {
  }

  ngOnChanges(){
    this.listOptions();
  }

  listOptions(){
    this.DataOptions.list(this.company).subscribe( options => {
      console.log(options);
      this.options = options.filter( option => option.to === this._parameters.to 
                                              && option.type === this._parameters.type
                                              && option.region === this._parameters.region);
      this.show = this.options.length == 0 ? false : true;
    });
  }
}
