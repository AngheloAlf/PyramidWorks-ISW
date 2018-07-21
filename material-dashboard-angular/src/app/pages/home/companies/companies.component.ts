import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Company } from '../../../models/Company';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
  animations: [
    trigger('chartState', [
      state('show' , style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0
      })),
      transition('show => hide', animate('300ms ease-out')),
      transition('hide => show', animate('300ms ease-in'))
    ])
  ]
})
export class CompaniesComponent implements OnInit {

  companiesToCompare: Company[] = [];
  maxCompanies = 20;
  dummy = 0;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {}

  receiveCompanies(eventCompany){
    if (this.companiesToCompare.length <= 19){
      let index = this.companiesToCompare.indexOf(eventCompany);
      if (index > -1){
        this.companiesToCompare.splice(index,1);
      }
      else{
        this.companiesToCompare.push(eventCompany);
      }
      this.changeDetectorRef.detectChanges();
      this.dummy++;
    }
  }

  addOne(){
    this.maxCompanies++;
  }
}
