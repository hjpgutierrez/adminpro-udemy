import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
// import * as swal2 from 'sweetalert';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
 
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
      this.cargarHospitales();

      // Escuchamos si se actualizó la imagen del hosptal
    this._modalUploadService.notificacion
    .subscribe( resp => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargando = true;

    this._hospitalService.cargarHospitales().subscribe((resp: any) => {
      // console.log(resp);
      this.totalRegistros = resp.total;
      this.hospitales = resp.hospitales;
      this.cargando = false;
    });
  }

  buscarHospital(termino: string) {
     if (termino.length <= 0) {
       this.cargarHospitales();
       return;
     }

     this.cargando = true;

     this._hospitalService
       .buscarHospital(termino)
       .subscribe((hospitales: Hospital[]) => {
         this.hospitales = hospitales;
         this.cargando = false;
       });
  }

  modalCrearUsuario() {

    swal({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del hospital',
      content: 'input',
      icon: 'info',
      buttons: true,
      dangerMode: true
    }).then((valor: string) => {

      if (!valor || valor.length === 0) {
        return;
      }

      this._hospitalService.crearHospital(valor)
      .subscribe(resp => this.cargarHospitales());


    });
  }

  mostrarModal(idHospital: string) {
    this._modalUploadService.mostrarModal('hospitales', idHospital);
  }

  guardarHospital( hospital: Hospital ) {
    this._hospitalService.actualizarHospital(hospital)
    .subscribe();
  }

  borrarHospital( hospital: Hospital ) {
    swal({
      title: '¿Estas seguro?',
      text: 'Estas a punto de borrar: ' + hospital.nombre,
      icon: 'warning',
      buttons: 'Si, Borrar',
      dangerMode: true
    }).then(borrar => {
      if (borrar) { 
        this._hospitalService.borrarHospital(hospital._id).subscribe(resp => {
          this.cargarHospitales();
        });
       }
    });
  }

}
