import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable(
//   {
//   providedIn: 'root',
// }
)

export class ApiService {
  constructor(private http: HttpClient) {}

  postTrainRecord(data: any) {
    return this.http.post<any>('http://localhost:3000/trains/', data);
  }

  getTrainRecord() {
    return this.http.get<any>('http://localhost:3000/trains/');
  }

  putTrainRecord(data : any, id : number) {
    return this.http.put<any>('http://localhost:3000/trains/'+id,data);
  }

  deleteTrainRecord(id : number) {
    return this.http.delete<any>('http://localhost:3000/trains/'+id);
  }
}