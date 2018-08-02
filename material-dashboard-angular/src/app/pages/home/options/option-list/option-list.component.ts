import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';
import { Company } from '../../../../models/Company';
import { Option } from '../../../../models/Option';
import { OptionsService } from '../../../../services/options.service';
import { FormBuilder, FormGroup, Validators} from  '@angular/forms';
import { CalculationsService } from '../../../../services/calculations.service';
import * as _ from 'lodash';

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
  set parameters(parameters) {
    this._parameters = {
      to: parameters.to === 'seller' ? true : false,
      type: parameters.type === 'Put' ? true : false,
      region: parameters.region === 'Europea' ? true : false,
      selectAll: parameters.selectAll
    }
  }
  options: Option[];
  form: FormGroup;

  constructor(private DataOptions: OptionsService, private DataCalculation: CalculationsService, private fb: FormBuilder ) {
    this.form = fb.group({
      'delay': [null, Validators.compose([Validators.required, Validators.min(0)])],
      'disc': [null, Validators.compose([Validators.required, Validators.min(0)])],
      'free_rate': [null, Validators.compose([Validators.required, Validators.min(0)])],
      'simu': [null, Validators.compose([Validators.required, Validators.min(0)])]
    })
  }

  ngOnInit() {
    this.getOptions();
  }

  ngOnChanges(changes) {
    if(this.options != null) {
      console.log(this.options);
      console.log(changes);
      this.listOptions(changes.parameters.currentValue.selectAll != changes.parameters.previousValue.selectAll);
    }
  }

  listOptions(toggleSelected: boolean) {
    this.options = this.options.filter(option => option.to === this._parameters.to);
    if(toggleSelected){
      this.options = this.options.map(option => {
        option.select = this._parameters.selectAll;
        return option;
      });
    }
    this.show = this.options.length == 0 ? false : true;
  }

  getOptions() {
    this.DataOptions.list(this.company).subscribe(options => {
      this.options = options;
      this.listOptions(false);
      console.log(this.company);
    });
  }

  pushOption(option){
    this.options.push(option);
  }

  editOption(option){
    const idx = this.options.findIndex( _option => _option.id = option.id);
    this.options[idx] = option;
  }

  deleteOption(option: Option) {
    if (confirm(`¿Estas seguro que quieres eliminar ${option.contract_name}?`)) {
      this.DataOptions.delete(this.company, option.id).subscribe(res => {
        this.getOptions();
        this.listOptions(false);
      });
    }
  }

  sendOption(option: Option){
    console.log(option);
    this.optionEvent.emit(option);
  }

  calculate(parameters){
    const optionsToCal = this.options.filter(option => option.select);
    optionsToCal.forEach(option => {
      this.DataCalculation.europeanSimulation(option, parameters.delay, parameters.disc, parameters.simu, parameters.free_rate).subscribe(res => {
        if(res.error == 'None'){
          option.pricing = res.value;
          this.editOption(option);
        }
      });
    });
  }
}
