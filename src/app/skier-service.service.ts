import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkierServiceService {

  private baseUrl = 'http://192.168.223.128:8089/api/skier';
  constructor(private http: HttpClient ) {}

  addSkier(skierData: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${this.baseUrl}/add`, skierData, { headers });
  }
  

  // Retrieve All Skiers
  getAllSkiers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  // Retrieve Skier by ID
  getSkierById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get/${id}`);
  }

  // Retrieve Skiers by Subscription Type
  getSkiersBySubscription(type: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getSkiersBySubscription?typeSubscription=${type}`);
  }

}
