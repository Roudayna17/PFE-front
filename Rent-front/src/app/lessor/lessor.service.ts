import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessorService {
  private apiUrl = 'http://localhost:3000/lessor'; // Change this if needed

  constructor(private http: HttpClient) {}

  createLessor(lessorData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-lessor`, lessorData);
  }

  getLessors(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list-lessor`);
  }

  getLessorById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/lessor/${id}`);
  }

  updateLessor(id: number, lessorData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update-lessor/${id}`, lessorData);
  }

  deleteLessor(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-lessor/${id}`);
  }

  deleteMultipleLessor(clientIds: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete-multiple-lessor`, { ids: clientIds });
  }
}
