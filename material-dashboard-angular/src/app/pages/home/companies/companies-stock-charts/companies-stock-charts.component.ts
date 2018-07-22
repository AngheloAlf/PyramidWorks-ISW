import { Component, OnInit, Input, OnChanges, ElementRef, SimpleChange, SimpleChanges, ViewChild} from '@angular/core';
import { Company } from '../../../../models/Company';
import { Stock } from '../../../../models/Stock';
import { StocksService } from '../../../../services/stocks.service';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import * as _ from 'lodash';

@Component({
  selector: 'app-companies-stock-charts',
  templateUrl: './companies-stock-charts.component.html',
  styleUrls: ['./companies-stock-charts.component.css']
})
export class CompaniesStockChartsComponent implements OnInit, OnChanges {

  @ViewChild('chart') el: ElementRef;

  chart: any;
  dates: string[];
  days: number = 30;
  colors = [
    '#e619rb',
    '#3cb44b',
    '#ffe119',
    '#0082c8',
    '#f58231',
    '#911eb4',
    '#46f0f0',
    '#f032e6',
    '#d2f53c',
    '#fabebe',
    '#008080',
    '#e6beff',
    '#aa6e28',
    '#fffac8',
    '#800000',
    '#aaffc3',
    '#808000',
    '#ffd8b1',
    '#000080',
    '#808080',
    '#000000'
  ];
  chartTraces: {x: string[],
                y: number[],
                name: string,
                mode: string}[] = [];

  @Input() companies: Company[];
  @Input() dummy: number;
  ngOnChanges(changes){
    console.log("esto es estupido")
    console.log(changes);
    console.log(this.dummy);
    this.addStocksTrace(this.days);
    this.setChart(this.chartTraces);
  }

 constructor(private StocksData: StocksService) { }

  ngOnInit() {
  }
  
  addStocksTrace(days){
    let idx = 0;
    this.chartTraces = [];
    this.dates = [];
    this.companies.forEach( company => {
      let companyTrace = {
        x: undefined,
        y: undefined,
        mode: 'lines+markers',
        name: company.name
      }
      this.StocksData.list(company, days).subscribe( stocks => {
        stocks = stocks.reverse();
        companyTrace.x = stocks.map(stocks => stocks.date);
        companyTrace.y = stocks.map(stocks => Number(stocks.open_price));
        this.chartTraces.push(companyTrace);
      })
      idx++;
    })
  }

  setChart(data){
    const element = this.el.nativeElement;
    Plotly.newPlot(element, data);

  }
  
}
