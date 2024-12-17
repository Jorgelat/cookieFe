import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


export interface UValue {
  name: string;
  points: number;
  autoClickerBaseCost: number;
  numAutoClickers: number;
}

@Injectable({
    providedIn: 'root',
  })
  export class Service {
    private apiUrl = 'http://localhost:3000/api/data/';
    user: UValue = {
      name: '',
      points: 0,
      autoClickerBaseCost: 0,
      numAutoClickers: 0,
    };
    constructor(private httpClient: HttpClient){

    }
   
    getUser(user: string): Observable<any>{
      return this.httpClient.get<any>(`${this.apiUrl}${user}`);
    }
    updateUser(valueUser: UValue): Observable<boolean>{
      const headers = new HttpHeaders().set('Content-Type', 'application/json'); 
      if(valueUser?.autoClickerBaseCost === 0){
        valueUser.autoClickerBaseCost = 50;
      }
      return this.httpClient.put<any>(`${this.apiUrl}`, { user: valueUser }, { headers });
    }
    addUser(valueUser: string): Observable<boolean>{  
      const headers = new HttpHeaders().set('Content-Type', 'application/json');      
      return this.httpClient.post<any>(`${this.apiUrl}`, { name: valueUser }, { headers });
    }

    resetUser(){
      localStorage.removeItem('user');
      this.user = {
        name: '',
        points: 0,
        autoClickerBaseCost: 0,
        numAutoClickers: 0,
      };
    }

    updateModelServiceUserClicks(points: number, autoClickerCost: number, numAutoClickers: number){
      this.user = {
        name: this.user.name,
        points: points,
        autoClickerBaseCost: autoClickerCost,
        numAutoClickers: numAutoClickers
      }
    }

    logOut(){
      if(this.user.autoClickerBaseCost === 0){
        this.user.autoClickerBaseCost = 50;
      }
      this.updateUser(this.user).subscribe((ret) => {
        this.resetUser();
        localStorage.removeItem('user');
        window.location.href = '/login';
      })     
    }
    
  }
