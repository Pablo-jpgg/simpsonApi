import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceapiService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getPersonajes(){
    return this.http.get(`${this.baseUrl}`);
  }
  getPersonajesPage(page: number, limit: number) {
    const url = `${this.baseUrl}?page=${page}&limit=${limit}`;
    return this.http.get(url);
  }
}
