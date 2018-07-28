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

  @Input() company: Company;
  @Input() parameters: {
    calculation: string,
    to: boolean,
    type: boolean
  };
  options: Option[];

  constructor(private DataOptions: OptionsService) {
   }

  ngOnInit() {
  }

  ngOnChanges(){
    console.log(this.parameters);
    this.listOptions();
  }

  listOptions(){
    this.DataOptions.list(this.company).subscribe( options => {
      this.options = options.filter( option => option.to === this.parameters.to && option.type === this.parameters.type);
    })
  }
}
