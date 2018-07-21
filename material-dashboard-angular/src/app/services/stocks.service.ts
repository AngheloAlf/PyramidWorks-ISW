import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Stock } from '../models/Stock';
import { Company } from '../models/Company';

@Injectable()
export class StocksService {

  constructor(private http: HttpClient) { 
    console.log('StocksService is working.')
  }

  list(company: Company | number, days){
    const id = typeof company === 'number' ? company : company.id;
    const url = days==='all' ? `/api/company/${id}/stocks/` : `/api/company/${id}/stocks/?length=${days}`;
    return this.http.get<Stock[]>(url);
  }
}
