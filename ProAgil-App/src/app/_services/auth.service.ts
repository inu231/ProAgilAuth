import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators'; // usar o map

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = 'http://localhost:5000/api/user/';
  jwtHelper = new JwtHelperService(); // Instalar o @auth0/angular-jwt - npm via NPM -> digitar no google
  decodedToken: any; // token a saer decodificado

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http
      .post(`${this.baseURL}login`, model).pipe( // pipe para poder pegaer o retorno do post que é um método Observable()
        map((response: any) => { // Map para mapear o retorno corretamente
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token); // localStorage: Armanezamnento Local do browser. Não pode ser acessado como os cookies pelas pessoas.
            this.decodedToken = this.jwtHelper.decodeToken(user.token); // decodifica o token
            sessionStorage.setItem('username', this.decodedToken.unique_name);
          }
        })
      );
  }

  register(model: any) {
    return this.http.post(`${this.baseURL}register`, model);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token); // checa se o token está expirado!
  }

}
