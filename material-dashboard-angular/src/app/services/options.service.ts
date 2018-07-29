import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Option } from '../models/Option';
import { Company } from '../models/Company';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class OptionsService {

  constructor(private http: HttpClient) { 
    console.log('OptionService is working.')
  }

  list(company?: Company | number){
    let url;
    if (company){
      const id = typeof company === 'number' ? company : company.id; 
      url = `/api/company/${id}/options/`;
    }
    else{
      url = '/api/options/'; 
    }
    return this.http.get<Option[]>(url);
  }

  get(company: Company | number, option: Option | number){
    const idCompany = typeof company === 'number' ? company : company.id;
    const idOption = typeof option == 'number' ? option : option.id;
    const url = `/api/company/${idCompany}/options/${idOption}`;
    return this.http.get<Option>(url);
  }

  add(company: Company | number, option: Option){
    const idCompany = typeof company === 'number' ? company : company.id;
    const url = `/api/company/${idCompany}/options/`;
    console.log(option);
    return this.http.post<Option>(url, option, httpOptions);
  }

  edit(company: Company | number, option: Option){
    const idCompany = typeof company === 'number' ? company : company.id;
    const url = `/api/company/${idCompany}/options/${option.id}`;
    return this.http.put<Option>(url, option, httpOptions);
  }

  delete(company: Company | number, option: Option | number){
    const idCompany = typeof company === 'number' ? company : company.id;
    const idOption = typeof option == 'number' ? option : option.id;
    const url = `/api/company/${idCompany}/options/${idOption}`;
    return this.http.delete<Option>(url, httpOptions);
  }
}
