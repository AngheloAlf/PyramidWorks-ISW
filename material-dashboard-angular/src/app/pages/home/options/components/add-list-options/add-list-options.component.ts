import { Component, OnInit } from '@angular/core';

/*class Company {
  name: string;
  ticker: string;
}*/


@Component({
  selector: 'app-add-list-options',
  templateUrl: './add-list-options.component.html',
  styleUrls: ['./add-list-options.component.css']
})
export class AddListOptionsComponent implements OnInit {
  log(x) {
    console.log(x);
  }
  newOptionList(companyName, companyTicker){
    console.log(companyName, companyTicker);
  }
  constructor() { }

  ngOnInit() {
  }

}
