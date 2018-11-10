import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import * as swal2 from 'sweetalert';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde: number = 0;

  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService) {}

  ngOnInit() {
    this.cargarUsuarios();

    // Escuchamos si se actualizó la imagen del usuario
    this._modalUploadService.notificacion
    .subscribe( resp => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;

    this._usuarioService.cargarUsuarios(this.desde).subscribe((resp: any) => {
      // console.log(resp);
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
    });
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this._usuarioService
      .buscarUsuario(termino)
      .subscribe((usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this._usuarioService.usuario._id) {
      swal(
        'No se puede borrar usuario',
        'No se puede borrar asi mismo',
        'error'
      );
      return;
    }

   swal({
      title: '¿Estas seguro?',
      text: 'Estas a punto de borrar a: ' + usuario.nombre,
      icon: 'warning',
      buttons: 'Si, Borrar',
      dangerMode: true
    }).then(borrar => {
      if (borrar) { 
        this._usuarioService.borrarUsuario(usuario._id).subscribe(resp => {
          this.cargarUsuarios();
        });
       }
    });
  }

  guardarUsuario(usuario: Usuario) {

    this._usuarioService.actualizarUsuario(usuario)
    .subscribe();

  } 

  mostrarModal( idUsuario: string) {
    // console.log('hola modal');
      this._modalUploadService.mostrarModal('usuarios', idUsuario);
  }

}