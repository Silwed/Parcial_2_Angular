import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { IDatos } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { DialogFormComponent } from '../dialog-form/dialog-form.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  data !: IDatos[];
  dataSource: any;
  displayedColumns = ['codigoProducto', 'nombre','precio','tipo','acciones'];
  contentType = 'image';
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */




  constructor( private productoService : ProductoService, private dialog: MatDialog) {

  }

  ngOnInit() {
     this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe( resp => {
      this.data = resp;
      console.log(this.data);
      this.dataSource = new MatTableDataSource<IDatos>(this.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  addProducto(){
    this.Openpopup(0, 'Agregar Producto',DialogFormComponent);
  }


  editProducto(code : any){
    this.Openpopup(code, 'Editar Producto',DialogFormComponent);
  }

  Openpopup(code: any, title: any,component:any) {
    var _popup = this.dialog.open(component, {
      width: '20%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {
        title: title,
        code: code
      }
    });
    _popup.afterClosed().subscribe(item => {
      // console.log(item)
      this.cargarProductos();
    })
  }

  deleteProducto(code : number){
    this.productoService.deleteProducto(code).subscribe( resp => {
      if(resp){
        Swal.fire({
          position: 'center',
          title: 'Buen Trabajo',
          text: `Datos Eliminados con exito`,
          icon: 'info',
        });

      }

      this.cargarProductos();
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Ocurrio un error`,
      });
    });

  }

  pdfMake(){
    this.productoService.generarPdfMake('PDFMAKE ------ Angular', this.data);
  }

}
