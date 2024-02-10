import { Component , Inject, OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ProductoService } from 'src/app/services/producto.service';
import { IDatos } from 'src/app/interfaces/producto';
import { Observable, Subscriber } from 'rxjs';


@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss']
})
export class DialogFormComponent implements OnInit {

  filefoto !: File;
  inputdata: any;
  editdata: any;
  myimage : string | undefined;
  codigoBase64 : string | undefined;
  closemessage = 'closed using directive';
  selectedFileName: string = 'No file selected';

  constructor(@Inject(MAT_DIALOG_DATA) public data : any, private ref : MatDialogRef<DialogFormComponent>,
  private buildr : FormBuilder, private productoService : ProductoService ) { }

  ngOnInit(): void {
    this.inputdata = this.data;
    if(this.inputdata.code != 0){
      this.setProductoData(this.inputdata.code)
    }
  }


  closepopup(){
    this.ref.close('closed using method');
  }

  onFileSelected(event: any): void {
     this.filefoto = event.target.files[0];
     this.selectedFileName = this.filefoto ? this.filefoto.name : 'No file selected';
     // Do whatever you want with the selected file here
     const target = event.target as HTMLInputElement;
     const files = (target.files as FileList)[0];
    if(this.filefoto.type.indexOf('image') < 0 ){

      this.selectedFileName = 'Only images are supported'




    }else{
      const observable = new Observable((subscriber: Subscriber<any>) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.onload = () => {
          subscriber.next(fileReader.result);
          subscriber.complete();
        }
        fileReader.onerror = (error) => {
          subscriber.error(error);
          subscriber.complete();
        }
    });

    observable.subscribe((resp : string) => {
      this.myimage = resp;
      this.codigoBase64 = resp;
    });
    }




  }

  /*
  myform = this.buildr.group({
    nombre: this.buildr.control('').addValidators([Validators.required, Validators.pattern('[a-zA-Z ]*')]),
    precio: this.buildr.control('').addValidators([Validators.required, Validators.pattern('[0-9]*')]),
    tipo: this.buildr.control('').addValidators([Validators.required])
  });
  */

  myform = this.buildr.group({
    nombre : ['', Validators.compose([Validators.required, Validators.pattern('[A-Z- ]*')]) ],
    precio : ['', Validators.required,  ],
    tipo : ['', Validators.required ],
    foto : ['', Validators.required]
  });


  setProductoData(code : any){
    this.productoService.getProductobyId(code).subscribe( resp => {
      this.editdata = resp;
      this.myform.setValue({
        nombre: this.editdata.nombre,
        precio: this.editdata.precio,
        tipo: this.editdata.tipo,
        foto : ""
      });
    });
  }

  Saveuser(){
      if(this.myform.valid){

        if(this.inputdata.code != 0){

          const producto : any = [
            {
              codigoProducto: this.editdata.codigoProducto,
              nombre: this.myform.value.nombre,
              precio: this.myform.value.precio,
              tipo: this.myform.value.tipo,
              foto : this.codigoBase64
            }

          ];

            console.log("entro al edit",producto)
            this.productoService.editProducto(this.editdata.codigoProducto, this.myform.value.nombre, this.myform.value.precio,this.myform.value.tipo,this.myimage).subscribe(  {

            next : (resp) => {
              if(resp){
                Swal.fire({
                  position: 'center',
                  title: 'Buen Trabajo',
                  text: `Datos Guardados con exito`,
                  icon: 'info',
                });

              }
              this.ref.close('closed using method');
            },

            error : (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Ocurrio un error`,

              });
            },
            complete : () => {
              Swal.fire({
                position: 'center',
                title: 'Buen Trabajo',
                text: `Datos Guardados con exito`,
                icon: 'info',
              });
            }

          }

            );

          }else{
            console.log("entro al guardar")

            const nombreProducto = this.myform.value.nombre;
            const precio = this.myform.value.precio;
            const tipo =  this.myform.controls['tipo'].value   //this.myform.value.tipo;

            const producto : IDatos  =
              {

                nombre: nombreProducto,
                precio: precio,
                tipo: tipo ,
                foto : this.myimage
              }
            ;

          this.productoService.saveProducto(producto).subscribe(  {

            next : (resp) => {

              this.ref.close('closed using method');
            },
            error : (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Ocurrio un error`,

              });
              console.log(error);
            },
            complete : () => {
              Swal.fire({
                position: 'center',
                title: 'Buen Trabajo',
                text: `Datos Guardados con exito`,
                icon: 'info',
              });
            }

          }
          );
        }
      }else{

      }


  }



  get nombre(){
    return this.myform.get('nombre');
  }

  get precio(){
    return this.myform.get('precio');
  }

  get tipo(){
    return this.myform.get('tipo');
  }

}
