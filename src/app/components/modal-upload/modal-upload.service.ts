import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ModalUploadService {
  public tipo: string; //  Medico, usuario, hospital
  public id: string; // id de cada uno de los tipos

  public oculto: string = 'oculto';

  public notificacion = new EventEmitter<any>();

  constructor() {
    // console.log('Modal upload service ready!');
  }

  ocultarModal() {
    this.oculto = 'oculto';
    this.tipo = null;
    this.id = null;
  }

  mostrarModal(tipo: string, id: string) {
    this.oculto = '';
    this.id = id;
    this.tipo = tipo;
  }
}
