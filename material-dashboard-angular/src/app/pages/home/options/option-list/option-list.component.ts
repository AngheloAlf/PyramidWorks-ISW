import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';
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
  @Output() optionEvent = new EventEmitter<Option>();
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
  optionToEdit: Option;


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

  deleteOption(option: Option){
    if(confirm(`¿Estas seguro que quieres eliminar ${option.contract_name}?`)){
      this.DataOptions.delete(this.company,option.id).subscribe(res => {
        this.listOptions();
      });
    }
  }

  editOption(option: Option){
    this.optionToEdit = option;
  }

  sendOption(option: Option){
    this.optionEvent.emit(option);
  }

}
