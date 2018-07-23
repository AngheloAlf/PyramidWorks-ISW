import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Company } from '../models/Company'

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()

export class CompaniesService {

  constructor(private http: HttpClient) { 
    console.log('CompaniesService is working.')
  }

  list(){
    return this.http.get<Company[]>('/api/company/');
  }

  get(company: Company | number){
    const id = typeof company === 'number' ? company : company.id;
    const url = `/api/company/${id}`;
    return this.http.get<Company>(url);
  }

  add(company: Company){
    return this.http.post<Company>('/api/company/', company, httpOptions);
  }

  edit(company: Company){
    return this.http.put<Company>(`/api/company/${company.id}/`, company, httpOptions);
  }

  delete(company: Company | number){
    const id = typeof company === 'number' ? company : company.id;
    const url = `/api/company/${id}`;
    return this.http.delete<Company>(url, httpOptions);
  }
}
