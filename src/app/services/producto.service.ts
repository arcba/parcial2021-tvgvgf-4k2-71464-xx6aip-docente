import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { of } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    this.resourceUrl = 'https://pymesbackend.azurewebsites.net/api/productos';
  }

  get(){
    return this.httpClient.get(this.resourceUrl);
  }

  put(Id: number, obj: Producto) {
    return this.httpClient.put(this.resourceUrl + Id, obj);
  }

  post(obj: Producto) {
    return this.httpClient.post(this.resourceUrl, obj);
  }
}

