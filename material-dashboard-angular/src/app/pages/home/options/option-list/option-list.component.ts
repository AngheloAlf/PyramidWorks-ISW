import { Component, OnInit, Input } from '@angular/core';
import { Company } from '../../../../models/Company'

@Component({
  selector: 'app-option-list',
  templateUrl: './option-list.component.html',
  styleUrls: ['./option-list.component.css']
})
export class OptionListComponent implements OnInit {

  @Input() company: Company;
  @Input() parameters: {
    calculation: string,
    seller: { 
      type: string
    },
    buyer: {
      type: string
    }
  };

  constructor() { }

  ngOnInit() {
  }

  listOptions(){}

}
