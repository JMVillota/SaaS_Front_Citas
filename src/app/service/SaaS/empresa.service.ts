import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Empresa } from '../../api/empresa/empresa.model';
import { environment } from '../../../environments/environment.prod'; // Cambia esto si estás en producción

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
    console.log('API URL:', this.apiUrl); // Log para depuración
  }

  // Obtener todas las empresas
  public getEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.apiUrl}/empresas`)
      .pipe(catchError(this.handleError));
  }

  // Obtener una empresa por ID
  public getEmpresa(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/empresas/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Crear una nueva empresa
  public createEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(`${this.apiUrl}/empresas`, empresa)
      .pipe(catchError(this.handleError));
  }

  // Actualizar una empresa existente
  public updateEmpresa(id: number, empresa: Partial<Empresa>): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.apiUrl}/empresas/${id}`, empresa)
      .pipe(catchError(this.handleError));
  }

  // Eliminar una empresa
  public deleteEmpresa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/empresas/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}