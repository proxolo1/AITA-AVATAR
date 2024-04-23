import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from '../config/enviorment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient) { }
  signUp(data: any): Observable<any> {
    return this._http.post<any>(`${environment.apiUrl}`, data)
  }
  login(data: any): Observable<any> {
    return this._http.post<any>(`${environment.apiUrl}/login`, data)
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  setToken(value:string):void{
    localStorage.setItem('token', value);
  }
  getYoutubeData(search:string) {
    return this._http.get(`https://www.googleapis.com/youtube/v3/search/?key=AIzaSyDO_6oG57btEx_QkAeV5x-uXd6mOfZod1k&q=${search}&type=video&part=snippet`)
  }
}
