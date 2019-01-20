import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class VerificaTokenGuard implements CanActivate {

  constructor(public _usuarioService: UsuarioService,
    public router: Router) {

  }


  canActivate():  Promise<boolean> | boolean {


    let token = this._usuarioService.token;
    let payload = JSON.parse( atob(token.split('.')[1]) );
    // console.log(payload);

    let expirado = this.expirado(payload.exp);

    if (expirado) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.verificaRenueva(payload.exp);
  }

  verificaRenueva (fechaExp: number):  Promise<boolean> {

    return new Promise( (resolve, reject) => {

      let tokenExp = new Date( fechaExp * 1000 );
      let ahora = new Date();

      // Sumamos 1 hora al momento actual
      ahora.setTime( ahora.getTime() + (1 * 60 * 60 * 1000) );
      // console.log(tokenExp);
      // console.log(ahora);

      if ( tokenExp.getTime() > ahora.getTime() ) {
        resolve(true);
      } else {
        this._usuarioService.renuevaToken()
        .subscribe( () => {
          resolve(true);
        }, () => {
          reject(false);
        });
      }

      resolve(true);
    });

  }

  expirado(fechaExp: number) {

    // Obtenemos la hora actual, pero como esta en milisegundos la dividimos para convertirla en segundos
    let ahora = new Date().getTime() / 1000;

    if (fechaExp < ahora) {
      return true;
    } else {
      return false;
    }
  }

}
