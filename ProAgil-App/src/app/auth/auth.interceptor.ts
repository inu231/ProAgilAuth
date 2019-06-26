import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap'; // chamar o tap exatamente desta forma, se não haverá conflito com o Observable.

// Injetar no app.module.ts no array providers!
// Checar como foi feito no app.modulo.ts, array providers, linha http_interceptors

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    // Método que interceptará todas as requisicoes HTTP do cliente
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (localStorage.getItem('token') !== null) { // Se está logado
            const cloneReq = req.clone({ // clona a requisicao e adiciona um header nela.
                headers: req.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`) // setando  o header na requisicao, no caso o token do local storage.
            });
            return next.handle(cloneReq).pipe(
                tap( // o tap empilha as requisicoes tratadas no pipe.
                    succ => { },
                    err => {
                        if (err.status === 401) {
                            this.router.navigateByUrl('user/login');
                        }
                    }
                )
            );
        } else {
            return next.handle(req.clone());
        }
    }
}
