import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Calculation } from '../models/Calculation';
import { Option } from '../models/Option';
import * as moment from 'moment-business-days';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable()
export class CalculationsService {

  private july4th = '2018-07-04';
  private laborDay = '2018-09-07';
  constructor(private http: HttpClient) {
    console.log('Calculation Service is Working')
    moment.locale('us', {
      holidays: [this.july4th, this.laborDay],
      holidaysFormat: 'YYYY-MM-DD'
    });
  }

  europeanSimulation(option: Option, delay: number, disc: number, simu: number, rate: number){
    const today = new Date();
    let days: number;
    const dd = today.getDate() < 10 ? '0'+today.getDate() : today.getDate();
    const mm = today.getMonth()+1 < 10 ? '0'+(today.getMonth()+1): today.getMonth()+1;
    const yyyy = today.getFullYear();
    const todayFormated = `${yyyy}-${mm}-${dd}`;
    //const exp = option.expire_date.split('-');
    //const expire_date = exp[1]+'-'+exp[2]+'-'+ exp[0];
    console.log(todayFormated);
    if(today < new Date(option.expire_date)){
      days = moment(todayFormated, 'YYYY-MM-DD').businessDiff(moment(option.expire_date, 'YYYY-MM-DD'));
    }
    else{
      days = 0;
    }
    const id = option.id;
    const url = `/api/calculation/?id=${id}&days=${days}&delay=${delay}&disc=${disc}&simu=${simu}&tasa=${rate}`;
    return this.http.get<Calculation>(url);
  }
}
