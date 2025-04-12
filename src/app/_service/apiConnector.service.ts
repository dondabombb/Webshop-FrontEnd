import { Injectable } from '@angular/core';
import axios, {AxiosInstance} from "axios";
import {Router} from "@angular/router";




@Injectable({
  providedIn: 'root'
})
export class ApiConnectorService {
  public static apiUrl = 'http://localhost:8080/api';

  constructor(private router: Router) { }

  public noAuth(): AxiosInstance {
    const instance = axios.create({
      baseURL: ApiConnectorService.apiUrl,
      headers: {
        Accept: 'application/json',
      }
    })
    instance.defaults.headers.common['Content-Type'] = 'application/json';
    return instance;
  }

  public async auth(): Promise<AxiosInstance> {
    const loggedIn = this.isLoggedIn();

    if (!loggedIn) {
      await this.router.navigateByUrl('/login')
      throw new Error('You are not authenticated');
    }

    const token = this.getToken();
    return axios.create({
      baseURL: ApiConnectorService.apiUrl,
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  }

  public isLoggedIn() {
    return !!this.getToken();
  }

  private getToken(): string|null {
    return localStorage.getItem('token');
  }

  public removeToken() {
    localStorage.removeItem('token');
  }

  public storeToken(token: string): void {
    localStorage.setItem('token', token);
  }
}
