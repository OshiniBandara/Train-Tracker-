import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  getTrainSchedules() {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) {}

  // Signup API
  singup(data: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/signup`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/login`, data);
  }

  // Get All Users API
  getUsers(): Observable<any> {
    return this.http.get<any>(`${BASE_URL}/users`);
  }

  // Fetch a specific train record by ID
  getTrainRecord(id?: string): Observable<any> {
    if(id){
      return this.http.get<any>(`${BASE_URL}/trainRecords/${id}`);
    }else{
      return this.http.get<any>(`${BASE_URL}/getAllTrainRecords`);
    }
  }

  // Get all train records
  getTrainRecords(): Observable<any> {
    return this.http.get<any>(`${BASE_URL}/getAllTrainRecords`);  // Fetch all records
  }

  // POST method to add a new train record
  postTrainRecord(trainRecord: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/addTrainRecord`, trainRecord);
  }

  // Update a train record by ID
  putTrainRecord(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${BASE_URL}/updateTrainRecord/${id}`, data);  // Update using the ID
  }

  // Delete a train record by ID
  deleteTrainRecord(id: string): Observable<any> {
    return this.http.delete<any>(`${BASE_URL}/deleteTrainRecord/${id}`);  // Delete by record ID
  }

}